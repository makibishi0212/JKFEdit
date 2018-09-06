// 編集用メニューのコンポーネント

import m from 'mithril'
import SingleComponentBasic from '../../singleComponentBasic'

export default class TopMenu extends SingleComponentBasic {
    public view() {
        return [
            m('label.label.is-main.c-shogiBan_menu_label', 'JKFEdit Menu'),
            m('.field.c-shogiBan_menu_button', [
                m('.control.button.is-primary', {
                    onclick: () => {
                        this.appData.switch_NEWKIFU()
                    }
                }, '棋譜の新規作成'),
            ]),
            m('.field.c-shogiBan_menu_button', [
                m('.control.button.is-primary', {
                    onclick: () => {
                        this.appData.switch_LOADKIFU()
                    }
                }, '棋譜の読み込み')
            ])
        ]
    }
}
