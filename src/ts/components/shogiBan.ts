// 将棋盤のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Util from '../util'
import Koma from './koma'
import SingleComponentBasic from '../singleComponentBasic'
import { PLAYER } from '../const'

export default class ShogiBan extends SingleComponentBasic {
    private koma: Koma
    private handArray: Array<Array<Array<Object>>>

    constructor(appdata) {
        super(appdata)
        this.koma = Koma.getInstance(Koma, this.appData)
        this.handArray = []
        this.handArray[PLAYER.SENTE] = [[]]

    }

    public view() {
        console.log(this.getHand(PLAYER.SENTE))

        return [
            m('.c-shogiBan_koma', [
                // 盤の描画
                m('.c-shogiBan', 
                    this.appData.jkfEditor.board.map((boardRow) => {
                        return m('.c-koma_row', boardRow.map((piece) => {
                            return m(this.koma, {kind: piece.kind, color: piece.color, komaNum: 1})
                        }))
                    })
                ),

                // 持ち駒の描画
                m('.c-shogiBan_hand_place', [
                    m('.c-shogiBan_hand', {class: c('c-shogiBan_oppo_hand')}, [
                        m('.c-shogiBan_hand_pieces', [
                            this.getHand(PLAYER.SENTE).map((handRow) => {
                                return  m('div.c-koma_row', [
                                    Object.keys(handRow).map((kind) => {
                                        return m(this.koma, {kind: kind, color: PLAYER.SENTE, komaNum: handRow[kind]})
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
                                        return m(this.koma, {kind: kind, color: PLAYER.SENTE, komaNum: handRow[kind]})
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

    public getHand(player: number): Array<object> {
        let handArray = []
        let count = 0
        let tmpObj = null

        Object.keys(this.appData.jkfEditor.hands[player]).forEach((key) => {
            if(count === 0) {
                let partObj = {}
                tmpObj = partObj
            }

            tmpObj[key] = this.appData.jkfEditor.hands[player][key]
            count++
            if(count === 4) {
                handArray.push(tmpObj)
                tmpObj = null
                count = 0
            }
        })

        return handArray
    }
}
