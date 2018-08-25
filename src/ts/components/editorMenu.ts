// 編集用メニューのルートコンポーネント

import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import TopMenu from './menu/topMenu';
import { STATE } from '../const';
import NewKifuMenu from './menu/newKifuMenu';
import KifuInfoMenu from './menu/kifuInfoMenu';
import SingleComponentBasic from '../singleComponentBasic';

export default class EditorMenu extends SingleComponentBasic {
    private topMenu: TopMenu
    private newKifuMenu: NewKifuMenu
    private kifuInfoMenu: KifuInfoMenu

    public oninit() {
        this.topMenu = TopMenu.getInstance(TopMenu, this.appData)
        this.newKifuMenu = NewKifuMenu.getInstance(NewKifuMenu, this.appData)
        this.kifuInfoMenu = KifuInfoMenu.getInstance(KifuInfoMenu, this.appData)
    }

    public view() {
        return [
            (this.appData.state === STATE.TOP || this.appData.state === STATE.NEWKIFU || this.appData.state === STATE.EDITINFO || this.appData.state === STATE.EDITBOARD) ?
            m('.c-shogiBan_menu_place', [
                m('.c-shogiBan_menu_base', [
                    (this.appData.state === STATE.TOP) ? m(this.topMenu): null,
                    (this.appData.state === STATE.NEWKIFU) ? m(this.newKifuMenu) : null,
                    (this.appData.state === STATE.EDITINFO) ? m(this.kifuInfoMenu) : null,
                    (this.appData.state === STATE.EDITBOARD) ? null : null
                ])
            ]) : null
        ]
    }
}
