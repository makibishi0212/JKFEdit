import JkfEditor from 'jkfeditor'
import StateMachine from '@taoqf/javascript-state-machine'
import { STATE, BAN, EDITSTATE } from "./const"
import Util from './util';

export default class AppData {
    private jkfEditor: JkfEditor = new JkfEditor()

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
            onEditMove: () => {this.setMask(this.jkfEditor.getMovables())}
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
    private _createHands: Array<Object>

    // 新規作成時の盤面プリセット
    private initBoardPreset: string

    // 棋譜か定跡か
    private _kifuType: number

    // 移動可能なコマなど、将棋盤をマスクするための配列
    private _maskArray: Array<Array<number>> = this.jkfEditor.getMovables()
    private _reverseMaskArray: Array<Array<number>> = Util.reverseBoard(this._maskArray)

    // 棋譜のヘッダー情報
    private _headerInfo: { [index: string]: string; } = {}

    public switch_NEWKIFU() {
        this.stateMachine['newKifu']()
    }

    public switch_LOADKIFU() {
        this.stateMachine['loadKifu']()
    }

    public switch_EDITINFO(kifuTitle: string, boardType: number, komaochiType: number, kifuType: number) {
        switch(boardType) {
            case BAN.HIRATE:
                this.initBoardPreset = null
                break
            case BAN.KOMAOCHI:
                this.initBoardPreset = Util.komaochiName(komaochiType)
                break
            case BAN.CUSTOM:
                break
        }
        this._headerInfo['title'] = kifuTitle
        this._kifuType = kifuType
        this.stateMachine['editInfo']()
    }

    public switch_EDITBOARD(kifuTitle: string, kifuType: number) {
        this._headerInfo['title'] = kifuTitle
        this._kifuType = kifuType
        this.stateMachine['editBoard']()
    }

    public switch_EDITMOVE(detail: string, propName: string = null, oppoName: string = null, place: string = null) {
        if(detail) this._headerInfo['detail'] = detail
        if(propName) this._headerInfo['proponent_name'] = propName
        if(oppoName) this._headerInfo['opponent_name'] = oppoName
        if(place) this._headerInfo['place'] = place

        const jkfObj = {
            header: this._headerInfo, 
            initial: {
                preset: this.initBoardPreset
            }, 
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

    public edit_inputReset(isFork = false) {
        if(isFork || this.jkfEditor.currentNum === (this.jkfEditor.moves.length - 1)) {
            this.editStateMachine['inputFrom']()
        }else {
            this.editStateMachine['inputReset']()
        }
    }

    public addForkMove() {
        if(this.editState === EDITSTATE.NOINPUT) {
            console.log('oh add forkMove')
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
        return (this.isReverse) ? this.jkfEditor.reverseBoard :  this.jkfEditor.board
    }

    public get currentNum() {
        return this.jkfEditor.currentNum
    }

    public get hands() {
        return this.jkfEditor.hands
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
}
