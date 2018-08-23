// 編集用メニューのルートコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import TopMenu from './menu/topMenu';

export default class EditorMenu implements ComponentBasic {
    private appData: AppData

    private topMenu: TopMenu
    
    constructor(appData: AppData) {
        this.appData = appData
        this.topMenu = new TopMenu(this.appData)
    }

    public view() {
        return [
            m('.c-shogiBan_menu_place', [
                m('.c-shogiBan_menu_base', [
                    m(this.topMenu),
                ])
            ])
        ]
    }
}
