// 棋譜に紐づく対局者、棋戦情報等の表示のコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import { STATE } from '../const';

export default class KifuInfo extends SingleComponentBasic {

    public view() {
        return [
            m('.c-kifuPlayer_info', {class: c(this.appData.isOpenInfo ? 'is-active' : null)}, [
                m('.columns', [
                    m('.c-kifuPlayer_info_title', 
                        m('label.label.c-shogiBan_menu_label.is-main', '棋譜情報')
                    ),
                    m('.c-kifuPlayer_info_close', 
                        m('span.icon.fa-lg', {
                            onclick: () => {
                                this.appData.isOpenInfo = false
                            }
                        }, 
                            m('i.fa.fa-times')
                        )
                    )
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('label.label.c-shogiBan_menu_label', 'タイトル'),
                    m('.field', 
                        m('.control', 
                            m('input.input.is-primary', {
                                type: 'text',
                                value: this.appData.title,
                                readonly: (this.appData.state === STATE.EDITMOVE) ? false : true,
                                placeholder: '棋譜タイトルを入力',
                                oninput: m.withAttr('value', (title) => {
                                    this.appData.setHeader('title', title)
                                })
                            })
                        )
                    )
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('.columns', [
                        m('.column', [
                            m('label.label.c-shogiBan_menu_label', '先手対局者'),
                            m('.field',
                                m('.control', 
                                    m('input.input.is-primary', {
                                        type: 'text',
                                        value: this.appData.proponent_name,
                                        readonly: (this.appData.state === STATE.VIEW) ? true : false,
                                        placeholder: '先手対局者情報なし',
                                        oninput: m.withAttr('value', (proponent_name) => {
                                            this.appData.setHeader('proponent_name', proponent_name)
                                        })
                                    })
                                )
                            )
                        ]),
                        m('.column', [
                            m('label.label.c-shogiBan_menu_label', '後手対局者'),
                            m('.field',
                                m('.control', 
                                    m('input.input.is-primary', {
                                        type: 'text',
                                        value: this.appData.opponent_name,
                                        readonly: (this.appData.state === STATE.VIEW) ? true : false,
                                        placeholder: '後手対局者情報なし',
                                        oninput: m.withAttr('value', (opponent_name) => {
                                            this.appData.setHeader('opponent_name', opponent_name)
                                        })
                                    })
                                )
                            )
                        ])
                    ])
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('label.label.c-shogiBan_menu_label', '棋戦名'),
                    m('.field',
                        m('.control', 
                            m('input.input.is-primary', {
                                type: 'text',
                                value: this.appData.place,
                                readonly: (this.appData.state === STATE.VIEW) ? true : false,
                                placeholder: '棋戦情報なし',
                                oninput: m.withAttr('value', (place) => {
                                    this.appData.setHeader('place', place)
                                })
                            })
                        )
                    )
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', '棋譜詳細'),
                    m('.field',
                        m('.control', 
                            m('textarea.textarea.is-primary', {
                                value: this.appData.detail,
                                readonly: (this.appData.state === STATE.VIEW) ? true : false,
                                placeholder: '棋譜詳細なし',
                                maxlength: 140,
                                oninput: m.withAttr('value', (detail) => {
                                    this.appData.setHeader('detail', detail)
                                })
                            })
                        )
                    )
                ])
            ])
        ]
    }
}
