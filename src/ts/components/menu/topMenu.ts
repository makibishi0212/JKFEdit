// 編集用メニューのルートコンポーネント

import ComponentBasic from '../../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../../appdata'

export default class TopMenu implements ComponentBasic {
    private appData: AppData
    
    constructor(appData: AppData) {
        this.appData = appData
    }

    public view() {
        return [
            m('label.label.is-main.c-shogiBan_menu_label', 'JKFEdit Menu'),
            m('.field.c-shogiBan_menu_button', [
                m('.control.button.is-primary', '棋譜の新規作成'),
            ]),
            m('.field.c-shogiBan_menu_button', [
                m('.control.button.is-primary', '棋譜の読み込み')
            ])
        ]
    }
}
