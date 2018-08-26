// 将棋盤のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Koma from './koma'
import SingleComponentBasic from '../singleComponentBasic'
import { PLAYER, STATE, KOMATYPE, EDITSTATE } from '../const'
import AppData from '../appdata';

export default class ShogiBan extends SingleComponentBasic {
    private koma: Koma
    private handArray: Array<Array<Array<Object>>>
    private movables: any

    constructor(appdata: AppData) {
        super(appdata)
        this.koma = Koma.getInstance(Koma, this.appData)
        this.handArray = []
        this.handArray[PLAYER.SENTE] = [[]]
        this.movables = this.appData.jkfEditor.getMovables()
    }

    public view() {
        console.log(this.getHand(PLAYER.SENTE))
        if(this.appData.state === STATE.EDITMOVE) {
            if(this.appData.editState === EDITSTATE.INPUTFROM) {
                this.movables = this.appData.jkfEditor.getMovables()
                console.log(this.movables)               
            }
        }

        return [
            m('.c-shogiBan_koma', [
                // 盤の描画
                m('.c-shogiBan', 
                    this.appData.jkfEditor.board.map((boardRow, ay) => {
                        return m('.c-koma_row', boardRow.map((piece, ax) => {
                            const komaInfo = {kind: piece.kind, color: piece.color, komaNum: 1, dispType: KOMATYPE.NORMAL}
                            if(this.appData.state === STATE.EDITMOVE) {
                                if(this.appData.editState === EDITSTATE.INPUTFROM && this.movables[ay][ax]) {
                                    komaInfo.dispType = KOMATYPE.FROM
                                }
                            }else if(this.appData.state === STATE.EDITBOARD){
                                
                            }else {
                                
                            }
                            return m(this.koma, komaInfo)
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
                                        const komaInfo = {kind: kind, color: PLAYER.SENTE, komaNum: handRow[kind], dispType: KOMATYPE.NORMAL}
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
                                        const komaInfo = {kind: kind, color: PLAYER.SENTE, komaNum: handRow[kind], dispType: KOMATYPE.NORMAL}
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
