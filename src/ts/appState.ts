import FSM from "javascript-state-machine";

export default class AppState {
    // 有限ステートマシン
    private stateMachine = new FSM()

    // 反転状態で表示するかどうか
    private _reverse: boolean = false

    // コンポーネントのステート
    private _state: number

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

    // 棋譜のヘッダー情報
    private _headerInfo: Object

    constructor() {

    }
}
