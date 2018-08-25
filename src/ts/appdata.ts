import JkfEditor from 'jkfeditor'
import StateMachine from '@taoqf/javascript-state-machine'
import { STATE, BAN, KOMAOCHI } from "./const"
import Util from './util';

export default class AppData {
    private _jkfEditor: JkfEditor = new JkfEditor()

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
        ]
    })

    // 反転状態で表示するかどうか
    private _reverse: boolean = false

    // 指し手入力時の移動駒の座標
    private _fromX: number
    private _fromY: number

    // 移動駒の移動先の情報 成・不成の判断時に利用する
    private _toX: number
    private _toY: number
    
    // 分岐棋譜ウインドウを開いているかどうか
    private _openForkWindow: boolean

    // 棋譜ヘッダ情報ウインドウを開いているかどうか
    private _openInfoWindow: boolean

    // 未配置の駒の情報
    private _unsetPieces: Object

    // 新規盤面作成時の盤面情報
    private _createBoard: Array<Array<Object>>

    // 新規盤面作成時の手持ち駒情報
    private _createHands: Array<Object>

    // 新規作成時の盤面プリセット
    private _initBoardPreset: string

    // 棋譜か定跡か
    private _kifuType: number

    // 棋譜のヘッダー情報
    private _headerInfo: Object = {}

    constructor() {
    }

    public switch_NEWKIFU() {
        this.stateMachine['newKifu']()
    }

    public switch_EDITINFO(kifuTitle: string, boardType: number, komaochiType: number, kifuType: number) {
        switch(boardType) {
            case BAN.HIRATE:
                this._initBoardPreset = null
                break
            case BAN.KOMAOCHI:
                this._initBoardPreset = Util.komaochiName(komaochiType)
                break
            case BAN.CUSTOM:
                break
        }
        this._headerInfo['title'] = kifuTitle
        this._kifuType = kifuType
        this.stateMachine['editInfo']()
    }

    public switch_EDITMOVE() {
        this.stateMachine['editMove']()
    }

    public switch_EDITKIFU() {
        // TODO: ここでこれまでの情報をjkfEditorに再ロードする
        this.stateMachine['editKifu']()
    }

    public get jkfEditor() {
        return this._jkfEditor
    }

    public get state() {
        if(typeof this.stateMachine.state === 'string') {
            return this.stateMachine.state
        }else {
            return 'ERROR'
        }
    }
}
