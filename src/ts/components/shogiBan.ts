// 将棋盤のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Koma from './koma'
import SingleComponentBasic from '../singleComponentBasic'
import { PLAYER, STATE, KOMATYPE, EDITSTATE } from '../const'
import Util from '../util';

export default class ShogiBan extends SingleComponentBasic {
    private koma: Koma
    private handArray: Array<Array<Array<Object>>>

    public oninit() {
        this.koma = Koma.getInstance(Koma, this.appData)
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
                            const komaInfo = this.getBoardKomaProp(piece.kind, piece.color, ax, ay)
                            return m(this.koma, komaInfo)
                        }))
                    })
                ),

                // 持ち駒の描画
                m('.c-shogiBan_hand_place', [
                    m('.c-shogiBan_hand', {class: c('c-shogiBan_oppo_hand')}, [
                        m('.c-shogiBan_hand_pieces', [
                            this.getHand(PLAYER.GOTE).map((handRow) => {
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
                        m('.c-shogiBan_hand_pieces', [
                            this.getHand(PLAYER.SENTE).map((handRow) => {
                                return  m('div.c-koma_row', [
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
            m('.c-shogiBan_grid', {class: c('is-reverse')}),
        ]
    }

    private getHand(player: number): Array<object> {
        let handArray = []
        let count = 0
        let tmpObj = null

        Object.keys(this.appData.hands[player]).forEach((key) => {
            if(count === 0) {
                let partObj = {}
                tmpObj = partObj
            }

            tmpObj[key] = this.appData.hands[player][key]
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

    private getBoardKomaProp(kind: string, color: number, ax: number, ay: number) {
        let pos = Util.getKifuPos(ax, ay, this.appData.reverse)
        const komaInfo = {kind: kind, color: color, komaNum: 1, dispType: KOMATYPE.NORMAL, posX: pos.x, posY: pos.y}

        if(this.appData.state === STATE.EDITMOVE) {
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
                    komaInfo['selectPromote'] = true
                }
            }
        }else if(this.appData.state === STATE.EDITBOARD){
            
        }

        return komaInfo
    }

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
}
