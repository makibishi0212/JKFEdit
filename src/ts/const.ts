// エディターのモード
export const MODE = {
    // 棋譜を編集するモード
    EDIT: 'EDIT',

    // 棋譜を閲覧するモード
    VIEW: 'VIEW'
}

export const STATE = {
    // トップメニューのステート
    TOP: 'TOP',

    // 新規棋譜の属性を決定するステート
    NEWKIFU: 'NEWKIFU',

    // jkfファイルを読み込むステート
    LOADKIFU: 'LOADKIFU',

    // カスタムの新規盤面を作成するステート
    EDITBOARD: 'EDITBOARD',

    // 新規棋譜の詳細情報を入力するステート
    EDITINFO: 'EDITINFO',

    // 駒の移動を入力するためのステート
    EDITMOVE: 'EDITMOVE',

    // 棋譜閲覧のステート
    VIEW: 'VIEW'
}

export const EDITSTATE = {
    // 移動する駒の位置を入力するステート
    INPUTFROM: 'INPUTFROM',

    // 移動先を入力するステート
    INPUTTO: 'INPUTTO',

    // 移動時に成るかどうかを入力するステート
    INPUTNARI: 'INPUTNARI',

    // 移動の追加入力を行えないステート
    NOINPUT: 'NOINPUT'
}

export const CREATESTATE = {
    // 盤面に配置する駒を選択するステート
    INPUTKIND: 'INPUTKIND',

    // 駒の配置先を選択するステート
    INPUTPOS:  'INPUTPOS',

    // 配置した駒の成・不成や持ち主を編集するステート
    KOMAEDIT: 'KOMAEDIT',
}

export const KOMATYPE = {
    NORMAL: 'NORMAL',

    // 指し手編集時の移動開始駒候補
    FROM: 'FROM',

    // 指し手編集時の移動先候補
    TO: 'TO',

    // 成るかどうかを選択する状態
    PROMOTE: 'PROMOTE',

    // 新規盤面編集時の配置駒候補
    KIND: 'KIND',

    // 新規駒編集時の配置先候補
    POS: 'POS',

    // 新規駒編集時の駒状態変更可能駒
    EDIT: 'EDIT'
}

export const KOMAPLACE = {
    BOARD: 'BOARD',
    HAND: 'HAND',
    UNSET: 'UNSET'
}

export const PLAYER = {
    SENTE: 0,
    GOTE: 1
}

export const BAN = {
    HIRATE   : 0,
    KOMAOCHI : 1,
    CUSTOM   : 2
}

export const KOMAOCHI = {
    KYO    : 0,
    KAKU   : 1,
    HISHA  : 2,
    HIKYO  : 3,
    NI     : 4,
    YON    : 5,
    ROKU   : 6,
    HACHI  : 7,
}

export const KIFUTYPE = {
    KIFU  : 0,
    JOSEKI: 1
}
