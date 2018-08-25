// 編集用メニューのコンポーネント

import m from 'mithril'
import c from 'classNames'
import AppData from '../../appdata'
import SingleComponentBasic from '../../singleComponentBasic';

export default class KifuInfoMenu extends SingleComponentBasic {
    private dispPlayerName: boolean // 対局社名を表示するかどうか
    private proponentName: string   // 先手対局者名
    private opponentName: string    // 後手対局者名

    private dispPlaceName: boolean  // 対局場所を表示するかどうか
    private place: string           // 対局場所
    private detail: string          // 棋譜詳細

    public oninit() {
        this.dispPlayerName = false
        this.proponentName = ''
        this.opponentName = ''
        this.place = ''
        this.detail = ''
        this.dispPlaceName = false
    }

    public view() {
        return [
            m('label.label.is-main.c-shogiBan_menu_label', '棋譜情報入力'),
            m('.field.c-shogiBan_menu_option', [
                m('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', {
                    onclick: () => {
                        this.dispPlayerName = !this.dispPlayerName;
                    }
                }, 
                    m('span.icon.is-small', [
                        m('i.fa.fa-chevron-right', {class: c((this.dispPlayerName) ? 'is-open' : null)})
                    ]),
                    '対局者名'
                ),
                (this.dispPlayerName) ?
                [
                    m('.field', 
                        m('.control', [
                            m('input.input.is-primary', {
                                type: 'text',
                                value: this.proponentName,
                                placeholder: '先手',
                                oninput: m.withAttr('value', (value) => {
                                    this.proponentName = value
                                })
                            })
                        ]),
                        
                    ),
                    m('.field', 
                        m('.control', [
                            m('input.input.is-primary', {
                                type: 'text',
                                value: this.opponentName,
                                placeholder: '後手',
                                oninput: m.withAttr('value', (value) => {
                                    this.opponentName = value
                                })
                            })
                        ])
                    ),
                ] : null,
                m('.field.c-shogiBan_menu_option', [
                    m('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', {
                        onclick: () => {
                            this.dispPlaceName = !this.dispPlaceName;
                        }
                    }, 
                        m('span.icon.is-small', [
                            m('i.fa.fa-chevron-right', {class: c((this.dispPlaceName) ? 'is-open' : null)})
                        ]),
                        '棋戦名'
                    ),
                    (this.dispPlaceName) ?
                    [
                        m('.field', 
                            m('.control', [
                                m('input.input.is-primary', {
                                    type: 'text',
                                    value: this.place,
                                    placeholder: '棋戦名',
                                    oninput: m.withAttr('value', (value) => {
                                        this.place = value;
                                    })
                                })
                            ])
                        )
                    ] : null
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', '棋譜詳細(必須)'),
                    m('.field', 
                        m('.control', [
                            m('textarea.textarea.is-primary', {
                                value: this.detail,
                                placeholder: '棋譜詳細を入力\n(最大140文字)',
                                maxlength: 140,
                                oninput: m.withAttr('value', (value) => {
                                    this.detail = value;
                                })
                            })
                        ])
                    )
                ]),
                m('.field.c-shogiBan_menu_button', [
                    m('.control', [
                        m('.button.is-primary', {
                            disabled: (this.detail) ? false : true,
                            onclick: () => {
                                // 指し手入力ステートへ
                                this.appData.switch_EDITMOVE()
                            }
                        }, '棋譜編集開始')
                    ])
                ])
            ]),  
        ]
    }
}
