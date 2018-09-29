// 編集用メニューのルートコンポーネント

import m from 'mithril'
import TopMenu from './menu/topMenu'
import { STATE } from '../const'
import NewKifuMenu from './menu/newKifuMenu'
import KifuInfoMenu from './menu/kifuInfoMenu'
import SingleComponentBasic from '../singleComponentBasic'
import LoadKifuMenu from './menu/loadKifuMenu'

export default class EditorMenu extends SingleComponentBasic {
    private topMenu: TopMenu
    private newKifuMenu: NewKifuMenu
    private kifuInfoMenu: KifuInfoMenu
    private loadKifuMenu: LoadKifuMenu

    public oninit() {
        this.topMenu = TopMenu.getInstance(TopMenu)
        this.newKifuMenu = NewKifuMenu.getInstance(NewKifuMenu)
        this.kifuInfoMenu = KifuInfoMenu.getInstance(KifuInfoMenu)
        this.loadKifuMenu = LoadKifuMenu.getInstance(LoadKifuMenu)
    }

    public view() {
        return [
            (this.appData.state === STATE.TOP || this.appData.state === STATE.NEWKIFU || this.appData.state === STATE.EDITINFO || this.appData.state === STATE.LOADKIFU) ?
            m('.c-shogiBan_menu_place', [
                m('.c-shogiBan_menu_base', [
                    (this.appData.state === STATE.TOP) ? m(this.topMenu): null,
                    (this.appData.state === STATE.NEWKIFU) ? m(this.newKifuMenu) : null,
                    (this.appData.state === STATE.EDITINFO) ? m(this.kifuInfoMenu) : null,
                    (this.appData.state === STATE.LOADKIFU) ? m(this.loadKifuMenu) : null,
                ])
            ]) : null
        ]
    }
}
