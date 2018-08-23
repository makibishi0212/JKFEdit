// 将棋盤のコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import Util from '../util';
import Koma from './koma';

export default class ShogiBan implements ComponentBasic {
    private appData: AppData
    private koma: Koma

    constructor(appData: AppData) {
        this.appData = appData
        this.koma = new Koma(appData)
    }

    public view() {
        return [
            m('.c-shogiBan_koma', [
                m('.c-shogiBan', 
                    this.appData.jkfEditor.board.map((boardRow) => {
                        return m('.c-koma_row', boardRow.map((piece) => {
                            return m(this.koma, {kind: piece.kind, color: piece.color, komaNum: 1})
                        }))
                    })
                ),

                m('.c-shogiBan_hand_place', [
                    m('.c-shogiBan_hand', {class: c('c-shogiBan_oppo_hand')}, [
                        m('.c-shogiBan_hand_pieces', [
                            m('.c-koma_row', [
                                m(this.koma, {kind: 'KA', komaNum: 1}),
                                m(this.koma, {kind: 'FU', komaNum: 1})
                            ])
                        ]),
                        m('.c-shogiBan_hand_base')
                    ]),
                    m('.c-shogiBan_hand', {class: c('c-shogiBan_prop_hand')}, [
                        m('.c-shogiBan_hand_pieces', [
                            m('.c-koma_row', [
                                m('.c-koma_piece_base', [
                                    m('.c-koma_piece', {class: Util.komaClassName('KA', 0, false)})
                                ]),
                                m('.c-koma_piece_base', [
                                    m('.c-koma_piece', {class: Util.komaClassName('HI', 0, false)})
                                ]),
                            ])
                        ]),
                        m('.c-shogiBan_hand_base')
                    ])
                ])
            ]),
            m('.c-shogiBan_grid', {class: c('is-reverse')}),
        ]
    }
}
