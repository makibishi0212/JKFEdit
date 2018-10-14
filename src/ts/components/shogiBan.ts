// 将棋盤のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Koma from './koma'
import SingleComponentBasic from '../singleComponentBasic'
import { PLAYER, STATE, KOMATYPE, EDITSTATE, CREATESTATE, BAN } from '../const'
import Util from '../util';

export default class ShogiBan extends SingleComponentBasic {
    private koma: Koma
    private handArray: Array<Array<Array<Object>>>
    private senteHandHover: boolean
    private goteHandHover: boolean

    public oninit() {
        this.koma = Koma.getInstance(Koma)
        this.handArray = []
        this.handArray[PLAYER.SENTE] = [[]]
    }

    public view() {
        return [
            m('.c-shogiBan_koma', [
                // 盤の描画
                m('.c-shogiBan', 
                    this.appData.board.map((boardRow, ay) => {
                        return m('.c-koma_row', boardRow.map((piece, ax) => {
                            const komaInfo = this.getBoardKomaProp(piece['kind'], piece['color'], ax, ay)
                            return m(this.koma, komaInfo)
                        }))
                    })
                ),

                // 持ち駒の描画(盤面編集時は編集用メニュー)
                m('.c-shogiBan_hand_place', [
                    m('.c-shogiBan_hand.c-shogiBan_oppo_hand', [
                        (this.appData.state === STATE.EDITBOARD) ?
                        [
                            m('.c-shogiBan_hand_pieces.is-oppoHands',{
                                class: c((this.goteHandHover) ? 'is-adding' : null),
                                onclick: () => {
                                    if(this.appData.createState === CREATESTATE.INPUTPOS) {
                                        this.appData.addHandCreateBoard(PLAYER.GOTE, this.appData.setKomaKind)
                                        if(!this.appData.unsetPieces[this.appData.setKomaKind]) {
                                            this.appData.create_inputReset()
                                        }
                                    }
                                }
                            }, [
                                m('.c-shogiBan_hand_pieces_inner', [
                                    this.getHand(this.appData.hands[PLAYER.GOTE]).map((handRow) => {
                                        return  m('div.c-koma_row', [
                                            Object.keys(handRow).map((kind) => {
                                                const komaInfo = this.getHandKomaProp(kind, PLAYER.GOTE, handRow[kind])
                                                return m(this.koma, komaInfo)
                                            })
                                        ])
                                    })
                                ]),
                                m('.c-shogiBan_hand_owner', {
                                    onmouseenter: () => {
                                        // 持ち駒に駒を加えるときのホバー処理
                                        if(this.appData.setKomaKind) {
                                            this.goteHandHover = true
                                        }
                                    },
                                    onmouseleave: () => {
                                        this.goteHandHover = false
                                    }
                                }, (this.goteHandHover) ? '初期持ち駒追加' : '後手持ち駒')
                            ]),
                            m('.c-shogiBan_hand_pieces.is-propHands',{
                                class: c((this.senteHandHover) ? 'is-adding' : null),
                                onclick: () => {
                                    if(this.appData.createState === CREATESTATE.INPUTPOS) {
                                        this.appData.addHandCreateBoard(PLAYER.SENTE, this.appData.setKomaKind)
                                        if(!this.appData.unsetPieces[this.appData.setKomaKind]) {
                                            this.appData.create_inputReset()
                                        }
                                    }
                                }
                            }, [
                                m('.c-shogiBan_hand_pieces_inner', [
                                    this.getHand(this.appData.hands[PLAYER.SENTE]).map((handRow) => {
                                        return  m('div.c-koma_row', [
                                            Object.keys(handRow).map((kind) => {
                                                const komaInfo = this.getHandKomaProp(kind, PLAYER.SENTE, handRow[kind])
                                                return m(this.koma, komaInfo)
                                            })
                                        ])
                                    })
                                ]),
                                m('.c-shogiBan_hand_owner', {
                                    onmouseenter: () => {
                                        // 持ち駒に駒を加えるときのホバー処理
                                        if(this.appData.setKomaKind) {
                                            this.senteHandHover = true
                                        }
                                    },
                                    onmouseleave: () => {
                                        this.senteHandHover = false
                                    }
                                }, (this.senteHandHover) ? '初期持ち駒追加' : '先手持ち駒')
                            ])
                        ]
                        :
                        m('.c-shogiBan_hand_pieces', [
                            this.getHand(this.appData.hands[PLAYER.GOTE]).map((handRow) => {
                                return  m('div.c-koma_row', [
                                    Object.keys(handRow).map((kind) => {
                                        const komaInfo = this.getHandKomaProp(kind, PLAYER.GOTE, handRow[kind])
                                        return m(this.koma, komaInfo)
                                    })
                                ])
                            })
                        ]),
                        m('.c-shogiBan_hand_base')
                    ]),
                    m('.c-shogiBan_hand', {class: c('c-shogiBan_prop_hand')}, [
                        (this.appData.state === STATE.EDITBOARD) ?
                        [
                            m('.c-shogiBan_hand_pieces', [
                                this.getHand(this.appData.unsetPieces).map((handRow) => {
                                    return  m('div.c-koma_row', [
                                        Object.keys(handRow).map((kind) => {
                                            const komaInfo = this.getUnsetKomaProp(kind, PLAYER.SENTE, handRow[kind])
                                            return m(this.koma, komaInfo)
                                        })
                                    ])
                                })
                            ]),
                            m('.c-shogiBan_hand_pieces.is-button', 
                                m('.c-shogiBan_createButton', 
                                    m('.button.is-primary', {
                                        onclick: () => {
                                            this.appData.switch_EDITINFO(BAN.CUSTOM)
                                        }
                                    }, '盤面編集完了')
                                )
                            ),
                        ]
                        :
                        m('.c-shogiBan_hand_pieces', [
                            this.getHand(this.appData.hands[PLAYER.SENTE]).map((handRow) => {
                                return  m('.c-koma_row', [
                                    Object.keys(handRow).map((kind) => {
                                        const komaInfo = this.getHandKomaProp(kind, PLAYER.SENTE, handRow[kind])
                                        return m(this.koma, komaInfo)
                                    })
                                ])
                            })
                        ]),
                        m('.c-shogiBan_hand_base')
                    ])
                ])
            ]),
            m('.c-shogiBan_grid', {class: c(this.appData.isReverse ? 'is-reverse' : null)}),
        ]
    }

    private getHand(hands: Object): Array<object> {
        let handArray = []
        let count = 0
        let tmpObj = null

        Object.keys(hands).forEach((key) => {
            if(count === 0) {
                let partObj = {}
                tmpObj = partObj
            }

            tmpObj[key] = hands[key]
            count++
            if(count === 4) {
                handArray.push(tmpObj)
                tmpObj = null
                count = 0
            }
        })

        if(tmpObj && Object.keys(tmpObj).length) handArray.push(tmpObj)

        return handArray
    }

    // 盤に配置する駒の属性を設定する
    private getBoardKomaProp(kind: string, color: number, ax: number, ay: number) {
        let pos = Util.getKifuPos(ax, ay, this.appData.isReverse)
        const komaInfo = {kind: kind, color: color, komaNum: 1, dispType: KOMATYPE.NORMAL, posX: pos.x, posY: pos.y}

        if(this.appData.state === STATE.EDITMOVE) {
            if(this.appData.editState === EDITSTATE.NOINPUT && this.appData.lastX === pos.x && this.appData.lastY === pos.y) {
                komaInfo.dispType = KOMATYPE.LAST
            }

            if(this.appData.maskArray[ay][ax]) {
                // 各編集ステートで盤面マスクの対象となっているとき
                if(this.appData.editState === EDITSTATE.INPUTFROM) {
                    komaInfo.dispType = KOMATYPE.FROM
                }else if(this.appData.editState === EDITSTATE.INPUTTO) {
                    komaInfo.dispType = KOMATYPE.TO
                    if(this.appData.maskArray[ay][ax] === 2) {
                        komaInfo['forcePromote'] = true
                    }
                }else if(this.appData.editState === EDITSTATE.INPUTNARI && this.appData.toX === pos.x && this.appData.toY === pos.y) {
                    komaInfo.dispType = KOMATYPE.PROMOTE
                }
            }
        }else if(this.appData.state === STATE.EDITBOARD){
            if(this.appData.createState === CREATESTATE.KOMAEDIT) {
                if(this.appData.editX === pos.x && this.appData.editY === pos.y) {
                    komaInfo.dispType = KOMATYPE.EDIT
                }
            }else if(!this.appData.maskArray[ay][ax]) {
                komaInfo.dispType = KOMATYPE.POS
            }
        }else if(this.appData.state === STATE.VIEW) {
            if(this.appData.lastX === pos.x && this.appData.lastY === pos.y) {
                komaInfo.dispType = KOMATYPE.LAST
            }
        }

        return komaInfo
    }

    // 持ち駒として描画する駒の属性を設定する
    private getHandKomaProp(kind: string, color: number, komaNum: number = 1) {
        // 持ち駒の座標情報はx: -1, y: -1 とする
        const komaInfo = {kind: kind, color: color, komaNum: komaNum, dispType: KOMATYPE.NORMAL, posX: -1, posY: -1}

        if(this.appData.state === STATE.EDITMOVE) {
            if(this.appData.editState === EDITSTATE.INPUTFROM && color === Util.oppoPlayer(this.appData.color)) {
                komaInfo.dispType = KOMATYPE.FROM
            }
        }else if(this.appData.state === STATE.EDITBOARD){
            
        }

        return komaInfo
    }

    // 未配置駒として描画する駒の属性を設定する
    private getUnsetKomaProp(kind: string, color: number, komaNum: number = 1) {
        // 持ち駒の座標情報はx: -1, y: -1 とする
        const komaInfo = {kind: kind, color: color, komaNum: komaNum, dispType: KOMATYPE.NORMAL, posX: -1, posY: -1}
        komaInfo['isUnset'] = true

        if(this.appData.state === STATE.EDITBOARD){
            if(this.appData.createState === CREATESTATE.INPUTKIND) {
                komaInfo.dispType = KOMATYPE.KIND
            }else if(this.appData.createState === CREATESTATE.INPUTPOS) {
                if(kind === this.appData.setKomaKind) {
                    komaInfo['setTarget'] = true
                }
            }
        }

        return komaInfo
    }
}
