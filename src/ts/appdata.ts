import JkfEditor from 'jkfeditor'
import StateMachine from '@taoqf/javascript-state-machine'
import { STATE, BAN, EDITSTATE, CREATESTATE, PLAYER, KOMAOCHI, MODE } from "./const"
import Util from './util'

export default class AppData {
    private jkfEditor: JkfEditor

    // 有限ステートマシンで画面の遷移を定義
    private stateMachine =  new StateMachine({
        init: STATE.TOP,
        transitions: [
            {
                name: 'newKifu',
                from: STATE.TOP,
                to: STATE.NEWKIFU
            },
            {
                name: 'loadKifu',
                from: STATE.TOP,
                to: STATE.LOADKIFU
            },
            {
                name: 'editInfo',
                from: [STATE.NEWKIFU, STATE.EDITBOARD],
                to: STATE.EDITINFO
            },
            {
                name: 'editMove',
                from: [STATE.EDITINFO, STATE.LOADKIFU],
                to: STATE.EDITMOVE
            },
            {
                name: 'editBoard',
                from: STATE.NEWKIFU,
                to: STATE.EDITBOARD
            },
            {
                name: 'reset',
                from: [STATE.NEWKIFU, STATE.LOADKIFU, STATE.EDITBOARD, STATE.EDITMOVE],
                to: STATE.TOP
            }
        ],
        methods: {
            onEditMove: () => {
                if(this.jkfEditor.currentNum === (this.jkfEditor.moves.length - 1)) {
                    this.editStateMachine['inputFrom']()
                    this.setMask(this.jkfEditor.getMovables())
                }else {
                    this.editStateMachine['inputReset']()
                }
            }
        }
    })

    // 棋譜編集モード時のサブステートを定義
    private editStateMachine = new StateMachine({
        init: EDITSTATE.INPUTFROM,
        transitions: [
            {
                name: 'inputTo',
                from: EDITSTATE.INPUTFROM,
                to: EDITSTATE.INPUTTO
            },
            {
                name: 'inputNari',
                from: EDITSTATE.INPUTTO,
                to: EDITSTATE.INPUTNARI
            },
            {
                name: 'inputFrom',
                from: [EDITSTATE.NOINPUT, EDITSTATE.INPUTFROM, EDITSTATE.INPUTTO, EDITSTATE.INPUTNARI],
                to: EDITSTATE.INPUTFROM
            },
            {
                name: 'inputReset',
                from: [EDITSTATE.NOINPUT, EDITSTATE.INPUTFROM, EDITSTATE.INPUTTO, EDITSTATE.INPUTNARI],
                to: EDITSTATE.NOINPUT
            }
        ],
        methods: {
            onInputFrom: () => {this.setMask(this.jkfEditor.getMovables())},
            onInputTo: () => {
                if(this.fromX !== -1 && this.fromY !== -1) {
                    // 盤上を移動する指し手の場合
                    this.setMask(this.jkfEditor.getKomaMoves(this.fromX, this.fromY))
                }else {
                    this.setMask(this.jkfEditor.getPutables(this.fromKind))
                }
            }
        }
    })

    // 新規盤面作成時のサブステートを定義
    private createStateMachine = new StateMachine({
        init: CREATESTATE.INPUTKIND,
        transitions: [
            {
                name: 'inputPos',
                from: [CREATESTATE.INPUTKIND, CREATESTATE.INPUTPOS],
                to: CREATESTATE.INPUTPOS
            },
            {
                name: 'inputKind',
                from: [CREATESTATE.INPUTKIND, CREATESTATE.INPUTPOS, CREATESTATE.KOMAEDIT],
                to: CREATESTATE.INPUTKIND
            },
            {
                name: 'komaEdit',
                from: [CREATESTATE.INPUTKIND, CREATESTATE.INPUTPOS],
                to: CREATESTATE.KOMAEDIT
            }
        ],
        methods: {
            onInputPos: () => {
                // 駒の配置可能箇所をマスクする
                this.setMask(this.createMask(this._createBoard))
            }
        }
    })

    // 反転状態で表示するかどうか
    private _isReverse: boolean = false

    // 指し手入力時の移動駒の座標
    private fromX: number
    private fromY: number

    private fromKind: string

    // 移動駒の移動先の情報 成・不成の判断時に利用する
    private _toX: number
    private _toY: number
    
    // 分岐棋譜ウインドウを開いているかどうか
    private _isOpenFork: boolean = false

    // 棋譜ヘッダ情報ウインドウを開いているかどうか
    private _isOpenInfo: boolean = false

    // 未配置の駒の情報
    private _unsetPieces: Object

    // 新規盤面作成時の盤面情報
    private _createBoard: Array<Array<Object>>

    // 新規盤面作成時の手持ち駒情報
    private _createHands: Array<{ [index: string]: number }>

    // 新規盤面作成時の配置対象駒
    private _setKomaKind: string

    // 新規盤面作成時の状態編集対象の駒の座標
    private _editX: number
    private _editY: number

    // 新規作成時の盤面プリセット
    private initBoardPreset: string

    // 棋譜か定跡か
    private _kifuType: number

    // 移動可能なコマなど、将棋盤をマスクするための配列
    private _maskArray: Array<Array<number>>
    private _reverseMaskArray: Array<Array<number>>

    // 棋譜のヘッダー情報
    private _headerInfo: { [index: string]: string; } = {}


    constructor(mode: string, initJkf: Object = {header: {}, moves: []}) {
        if(mode === MODE.EDIT) {
            this.jkfEditor = new JkfEditor()
        }else if(mode === MODE.VIEW) {
            this.jkfEditor = new JkfEditor(initJkf as {header: { [index: string]: string; }, moves:Array<any>})
        }
    }

    public switch_NEWKIFU() {
        this.stateMachine['newKifu']()
    }

    public switch_LOADKIFU() {
        this.stateMachine['loadKifu']()
    }

    public switch_EDITINFO(boardType: number,kifuTitle: string = null, komaochiType: number = KOMAOCHI.NI, kifuType: number = null) {
        switch(boardType) {
            case BAN.HIRATE:
                this.initBoardPreset = null
                break
            case BAN.KOMAOCHI:
                this.initBoardPreset = Util.komaochiName(komaochiType)
                break
            case BAN.CUSTOM:
                this.initBoardPreset = 'OTHER'
                break
        }
        if(kifuTitle) this._headerInfo['title'] = kifuTitle
        if(kifuType) this._kifuType = kifuType
        this.stateMachine['editInfo']()
    }

    public switch_EDITBOARD(kifuTitle: string, kifuType: number) {
        this._headerInfo['title'] = kifuTitle
        this._kifuType = kifuType

        // 初期盤面を定義
        this._createBoard = []
        for (let ky = 0; ky < 9; ky++) {
            const rowArray = []
            for (let kx = 0; kx < 9; kx++) {
                rowArray.push({})
            }
            this._createBoard.push(rowArray)
        }

        // 未配置駒を定義
        this._unsetPieces = {
            'FU' : 18,
            'KY' : 4,
            'KE' : 4,
            'GI' : 4,
            'KI' : 4,
            'KA' : 2,
            'HI' : 2,
            'OU' : 2
        }

        this._createHands = [{},{}]

        this._setKomaKind = null

        this.stateMachine['editBoard']()
    }

    public switch_EDITMOVE(detail: string, propName: string = null, oppoName: string = null, place: string = null) {
        if(detail) this._headerInfo['detail'] = detail
        if(propName) this._headerInfo['proponent_name'] = propName
        if(oppoName) this._headerInfo['opponent_name'] = oppoName
        if(place) this._headerInfo['place'] = place

        const initial = {
            preset: this.initBoardPreset
        }

        if(this.initBoardPreset === 'OTHER') {
            initial['data'] = {
                board: this._createBoard,
                color: PLAYER.SENTE,
                hands: this._createHands
            }
        }

        const jkfObj = {
            header: this._headerInfo, 
            initial: initial, 
            moves: [{}]
        }
        this.jkfEditor.load(jkfObj)
        this.stateMachine['editMove']()
    }

    public switch_EDITMOVEfromLOADKIFU(jkf: Object) {
        this.load(jkf)
        this.stateMachine['editMove']()
    }

    public edit_inputFrom(fromX: number, fromY: number, kind: string) {
        if(this.editState === EDITSTATE.INPUTFROM) {
            this.fromX = fromX
            this.fromY = fromY
            this.fromKind = kind

            this.editStateMachine['inputTo']()
        }else {
            console.log('INPUTFROM状態以外ではFROM座標の入力はできません。')
        }
    }

    public edit_inputTo(toX: number, toY: number, forcePromote: boolean = false) {
        if(this.editState === EDITSTATE.INPUTTO) {
            this._toX = toX
            this._toY = toY

            if(this.fromX !== -1 && this.fromY !== -1) {
                // 盤上を移動する指し手の場合
                const moveKoma = this.jkfEditor.getBoardPiece(this.fromX, this.fromY)

                const isPromotable = Util.isPromotable(this.fromY, this.toY, moveKoma.color, moveKoma.kind)

                if(isPromotable) {
                    if(forcePromote) {
                        // 強制成りの場合はNARIステートに遷移せずに直ちに駒を成る
                        this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY, true)
                        this.jkfEditor.currentNum++
                        this.editStateMachine['inputFrom']()
                    }else {
                        // 成ることができる場合は指し手を追加せずinputNariに遷移
                        this.editStateMachine['inputNari']()
                    }
                }else {
                    this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY)
                    if(this.isOpenFork) {
                        this.jkfEditor.switchFork(this.jkfEditor.nextMoves.length - 1)
                        this.isOpenFork = false
                    }
                    this.jkfEditor.currentNum++
                    this.editStateMachine['inputFrom']()
                }
            }else {
                // 持ち駒から配置する指し手の場合
                this.jkfEditor.addHandMove(this.fromKind, this.toX, this.toY)
                if(this.isOpenFork) {
                    this.jkfEditor.switchFork(this.jkfEditor.nextMoves.length - 1)
                    this.isOpenFork = false
                }
                this.jkfEditor.currentNum++
                this.editStateMachine['inputFrom']()
            }
        }else {
            console.log('INPUTTO状態以外ではTO座標の入力はできません。')
        }
    }

    public edit_inputNari(promote: boolean) {
        if(this.editState === EDITSTATE.INPUTNARI) {
            if(promote) {
                this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY, true)
            }else {
                this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY)
            }
    
            this.jkfEditor.currentNum++
            this.editStateMachine['inputFrom']()
        }
    }

    public edit_inputReset(isFork: boolean = false) {
        if(isFork || this.jkfEditor.currentNum === (this.jkfEditor.moves.length - 1)) {
            this.editStateMachine['inputFrom']()
        }else {
            this.editStateMachine['inputReset']()
        }
    }

    public create_inputKind(kind: string) {
        this._setKomaKind = kind
        this.createStateMachine['inputPos']()
    }

    public create_inputPos(toX: number, toY: number) {

        // 盤に駒を配置
        this.setCreateBoard(toX, toY, this.setKomaKind)

        // 配置駒のストックが無くなった場合はINPUTKINDに遷移する
        if(!this.unsetPieces[this.setKomaKind]) {
            this.create_inputReset()
        }
    }

    public create_komaEdit(posX: number, posY: number) {
        this._editX = posX
        this._editY = posY
        this.createStateMachine['komaEdit']()
        this._setKomaKind = null
    }

    public create_inputReset() {
        this._setKomaKind = null
        this._editX = null
        this._editY = null
        this.createStateMachine['inputKind']()
    }

    public addForkMove() {
        if(this.editState === EDITSTATE.NOINPUT) {
            this.edit_inputReset(true)
        }
    }

    public go(kifuNum: number) {
        this.jkfEditor.go(kifuNum)
        if(this.state === STATE.EDITMOVE) {
            this.edit_inputReset()
        }
    }

    public deleteMove(deleteNum: number) {
        this.jkfEditor.deleteMove(deleteNum)
        this.go(deleteNum - 1)
    }

    public get state() {
        if(typeof this.stateMachine.state === 'string') {
            return this.stateMachine.state
        }else {
            return 'ERROR'
        }
    }

    public get editState() {
        if(this.state === STATE.EDITMOVE && typeof this.editStateMachine.state === 'string') {
            return this.editStateMachine.state
        }else {
            return 'ERROR'
        }
    }

    public get createState() {
        if(this.state === STATE.EDITBOARD && typeof this.createStateMachine.state === 'string') {
            return this.createStateMachine.state
        }else {
            return 'ERROR'
        }
    }

    public get title() {
        return (this._headerInfo['title']) ? this._headerInfo['title'] : ''
    }

    public get detail() {
        return (this._headerInfo['detail']) ? this._headerInfo['detail'] : ''
    }

    public get proponent_name() {
        return (this._headerInfo['proponent_name']) ? this._headerInfo['proponent_name'] : ''
    }

    public get opponent_name() {
        return (this._headerInfo['opponent_name']) ? this._headerInfo['opponent_name'] : ''
    }

    public get place() {
        return (this._headerInfo['place']) ? this._headerInfo['place'] : ''
    }

    public get kifuType() {
        return this._kifuType
    }

    public get isReverse(): boolean {
        return this._isReverse
    }

    public get maskArray() {
        return this.isReverse ? this._reverseMaskArray : this._maskArray
    }

    public get toX() {
        return this._toX
    }

    public get toY() {
        return this._toY
    }

    public get isOpenFork() {
        return this._isOpenFork
    }

    public get isOpenInfo() {
        return this._isOpenInfo
    }

    public get isKeyActive() {
        return (this._isOpenInfo) ? false : (this.state === STATE.EDITMOVE) ? true : false
    }

    public get unsetPieces() {
        return this._unsetPieces
    }

    public get setKomaKind() {
        return this._setKomaKind
    }

    public get editX() {
        return this._editX
    }

    public get editY() {
        return this._editY
    }

    // 棋譜の操作
    public load(jkf: Object) {
        (!jkf.hasOwnProperty('header')) ? jkf['header'] = this._headerInfo : this._headerInfo = jkf['header']
        if(!jkf.hasOwnProperty('moves')) jkf['moves'] = []
        this.jkfEditor.load(jkf as {header: { [index: string]: string; }, moves:Array<any>})
    }

    public export() {
        const exportJkf = this.jkfEditor.export()
        const jsonURI = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(exportJkf))
        this.downloadURI(jsonURI, 'jkf.json')
    }

    public switchFork(forkIndex: number) {
        this.jkfEditor.switchFork(forkIndex)
        this.isOpenFork = false
    }

    public deleteFork(forkIndex: number) {
        this.jkfEditor.deleteFork(forkIndex)
    }


    // 棋譜の情報
    public haveFork(num) {
        return this.jkfEditor.haveFork(num)
    }

    public get board() {
        return (this.state === STATE.EDITBOARD || this.state === STATE.EDITINFO && this.initBoardPreset === 'OTHER') ?
        this._createBoard
        :
        (this.isReverse) ? this.jkfEditor.reverseBoard :  this.jkfEditor.board
    }

    public get currentNum() {
        return this.jkfEditor.currentNum
    }

    public get hands() {
        return (this.state === STATE.EDITBOARD) ? this._createHands : this.jkfEditor.hands
    }

    public get color() {
        return this.jkfEditor.color
    }

    public get moves() {
        return this.jkfEditor.moves
    }

    public get forks() {
        return this.jkfEditor.nextMoves
    }

    public get forkIndex() {
        return this.jkfEditor.nextSelect
    }

    // ウインドウ表示状態の切り替え用setter
    public set isOpenFork(isOpen: boolean) {
        this._isOpenFork = isOpen
    }

    public set isOpenInfo(isOpen: boolean) {
        this._isOpenInfo = isOpen
    }

    public set isReverse(isReverse: boolean) {
        this._isReverse = isReverse
    }

    // 棋譜情報変更用のsetter
    public setHeader(key: string, value: string) {
        if(this.state === STATE.EDITMOVE) {
            this._headerInfo[key] = value
        }
    }

    // 盤面マスク用の配列を生成する
    private setMask(maskArray: Array<Array<number>>) {
        this._maskArray = maskArray
        this._reverseMaskArray = Util.reverseBoard(maskArray)
    }

    // 指定したファイルパスをダウンロードする
    private downloadURI(uri, name) {
        const link: HTMLAnchorElement = document.createElement('a')
        link.download = name
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // 新規作成用の盤面情報からmaskArrayを作成する
    private createMask(boardArray: Array<Array<Object>>): Array<Array<number>> {
        return boardArray.map((boardRow) => {
            return boardRow.map((boardObj) => {
                return (boardObj['kind']) ? 1 : 0
            })
        })
    }

    // 新規盤面に駒を配置する
    private setCreateBoard(posX: number, posY: number, kind: string) {
        if(this.unsetPieces[kind]) {
            const ax = 9 - posX
            const ay = posY - 1
            if(!this._createBoard[ay][ax]['kind']) {
                this.unsetPieces[kind]--
                if(!this.unsetPieces[kind]) {
                    delete this.unsetPieces[kind]
                }
                this._createBoard[ay][ax] = {kind: kind , color: PLAYER.SENTE}
            }
        }

        this.setMask(this.createMask(this._createBoard))
    }

    // 新規盤面上の駒を削除する
    public unsetCreateBoard(posX: number, posY: number) {
        const ax = 9 - posX
        const ay = posY - 1
        if(this._createBoard[ay][ax]['kind']) {
            const kind = Util.getDemote(this._createBoard[ay][ax]['kind'])
            this.unsetPieces[kind] = this.unsetPieces[kind] ? this.unsetPieces[kind] + 1 : 1
            this._createBoard[ay][ax] = {}
        }

        this.setMask(this.createMask(this._createBoard))
    }

    // 新規盤面上の駒の先後を変更する
    public switchColorCreateBoard(posX: number, posY: number) {
        const ax = 9 - posX
        const ay = posY - 1
        if(this._createBoard[ay][ax]['kind']) {
            this._createBoard[ay][ax]['color'] = (this._createBoard[ay][ax]['color'] === PLAYER.SENTE) ? PLAYER.GOTE : PLAYER.SENTE
        }
    }

    // 新規盤面上の駒の成・不成を変更する
    public switchNariCreateBoard(posX: number, posY: number) {
        const ax = 9 - posX
        const ay = posY - 1
        if(this._createBoard[ay][ax]['kind']) {
            this._createBoard[ay][ax]['kind'] = Util.canPromote(this._createBoard[ay][ax]['kind']) ? Util.getPromote(this._createBoard[ay][ax]['kind']) : Util.getDemote(this._createBoard[ay][ax]['kind'])
        }
    }

    // 新規盤面の初期持ち駒を追加する
    public addHandCreateBoard(player: number, kind: string) {

        if(this.unsetPieces[kind]) {
            this._createHands[player][kind] = this._createHands[player][kind] ? this._createHands[player][kind] + 1 : 1

            this.unsetPieces[kind]--
            if(!this.unsetPieces[kind]) {
                delete this.unsetPieces[kind]
            }
        }
    }

    // 新規盤面の初期持ち駒を削除する
    public removeHandCreateBoard(player: number, kind: string) {
        if(this._createHands[player][kind]) {
            this._createHands[player][kind]--
            if(!this._createHands[player][kind]) {
                delete this._createHands[player][kind]
            }

            this.unsetPieces[kind] = this.unsetPieces[kind] ? this.unsetPieces[kind] + 1 : 1
        }
    }
}
