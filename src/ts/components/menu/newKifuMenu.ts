// 新規棋譜メニューのコンポーネント

import m from 'mithril'
import c from 'classNames'
import { BAN} from '../../const';
import Util from '../../util';
import SingleComponentBasic from '../../singleComponentBasic';

export default class NewKifuMenu extends SingleComponentBasic {
    private kifuTitle: string
    private boardType: number
    private komaochiType: number
    private kifuType: number

    public oninit() {
        this.kifuTitle = ''
        this.boardType = 0 
        this.komaochiType = 0
        this.kifuType = 0
    }

    public view() {
        return [
            m('label.label.c-shogiBan_menu_label.is-main', '新規作成'),
            m('.field.c-shogiBan_menu_option', [
                m('label.label.c-shogiBan_menu_label', 'タイトル(必須)'),
                m('.field', 
                    m('.control', [
                        m('input.input.is-primary', {
                            maxlength: 32,
                            type: 'text',
                            value: this.kifuTitle,
                            placeholder: '棋譜タイトルを入力',
                            oninput: m.withAttr('value', (title) => {
                                this.kifuTitle = title
                            })
                        })
                    ])
                ),
                m('label.label.c-shogiBan_menu_label', '初期盤面'),
                m('.control', [
                    m('.select', [
                        m('select', {
                            selected: this.boardType,
                            onchange: m.withAttr('selectedIndex', (value) => {
                                this.boardType = value
                                switch(this.boardType) {
                                    case BAN.HIRATE:
                                        this.appData.load({header:{}, initial: {preset: 'HIRATE'}, moves: [{}]})
                                        break
                                    case BAN.KOMAOCHI:
                                        this.appData.load({header:{}, initial: {preset: 'KY'}, moves: [{}]})
                                        break
                                    case BAN.CUSTOM:
                                        this.appData.load({header:{}, initial: {preset: 'HIRATE'}, moves: [{}]})
                                        break
                                }
                            })
                        }, [
                            m('option', '平手'),
                            m('option', '駒落ち'),
                            m('option', 'カスタム')
                        ])
                    ])
                ])
            ]),

            // 駒落ちを選択した場合のみ表示
            (this.boardType === BAN.KOMAOCHI) ?
            [
                m('.c-shogiBan_menu_komaochi.field', [
                    m('label.label.c-shogiBan_menu_label', '駒落ち詳細'),
                ]),
                m('.field.c-shogiBan_menu_option', [
                    m('.control', [
                        m('.select', [
                            m('select', {
                                selected: this.komaochiType,
                                onchange: m.withAttr('selectedIndex', (value) => {
                                    this.komaochiType = value;        
                                    this.appData.load({header:{}, initial: {preset: Util.komaochiName(this.komaochiType)}, moves: [{}]})                                      
                                })
                            }, [
                                m('option', '香落ち'),
                                m('option', '角落ち'),
                                m('option', '飛車落ち'),
                                m('option', '飛香落ち'),
                                m('option', '二枚落ち'),
                                m('option', '四枚落ち'),
                                m('option', '六枚落ち'),
                                m('option', '八枚落ち')
                            ])
                        ])
                    ])
                ])
            ]
            :
            null,

            m('.field.c-shogiBan_menu_option', [
                m('label.label.c-shogiBan_menu_label', '入力形式'),
                m('.control', [
                    m('.select', [
                        m('select', {
                            selected: this.kifuType,
                            onchange: m.withAttr('selectedIndex', (value) => {
                                this.kifuType = value;
                            })
                        }, [
                            m('option', '棋譜'),
                            m('option', '定跡')
                        ])
                    ])
                ])
            ]),
            m('.field.c-shogiBan_menu_button', [
                m('.control', [
                    (this.boardType === BAN.CUSTOM) ?
                    m('button.button.is-danger', {
                        disabled: (this.kifuTitle) ? false : true,
                        onclick: () => {
                            this.appData.switch_EDITBOARD(this.kifuTitle, this.kifuType)
                        }
                    }, '盤面入力へ')
                    :
                    m('button.button.is-primary', {
                        disabled: (this.kifuTitle) ? false : true,
                        onclick: () => {
                            this.appData.switch_EDITINFO(this.boardType, this.kifuTitle, this.komaochiType, this.kifuType) 
                        }
                    }, '棋譜情報入力へ')
                ])
            ])
        ]
    }
}
