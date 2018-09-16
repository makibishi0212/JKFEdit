
import ComponentBasic from '../componentBasic'
import m from 'mithril'
import AppData from '../appdata'
import ShogiBan from './shogiBan'
import MoveList from './moveList'
import ToolBar from './toolBar'
import EditorMenu from './editorMenu'
import KifuInfo from './kifuInfo';

export default class JKFEdit implements ComponentBasic {
    private appData: AppData
    private shogiBan: ShogiBan
    private moveList: MoveList
    private toolBar: ToolBar
    private editorMenu: EditorMenu
    private kifuInfo: KifuInfo

    public oninit() {
        this.appData = new AppData()
        this.shogiBan = ShogiBan.getInstance(ShogiBan, this.appData)
        this.moveList = MoveList.getInstance(MoveList, this.appData)
        this.toolBar = ToolBar.getInstance(ToolBar, this.appData)
        this.editorMenu = EditorMenu.getInstance(EditorMenu, this.appData)
        this.kifuInfo = KifuInfo.getInstance(KifuInfo, this.appData)
    }

    public view() {
        return [
            m('.c-kifuPlayer', {
                onkeydown : (this.appData.isKeyActive) ? 
                (e: KeyboardEvent) => {
                    // 押されたキーでswitch
                    switch(e.keyCode) {
                        case 37:
                            if(this.appData.currentNum) this.appData.go(this.appData.currentNum - 1)
                            break
                        case 39:
                            if(this.appData.currentNum < (this.appData.moves.length - 1)) this.appData.go(this.appData.currentNum + 1)
                            break
                    }
                }
                :
                null,
                onupdate: (vnode) => {
                    if(this.appData.isKeyActive) {
                        (vnode.dom as HTMLElement).focus()
                    }
                },
                tabindex: 1
            }, [
                m('.c-kifuPlayer_inner', [
                    m('.c-kifuPlayer_main', [
                        m('.c-shogiBan', [
                            m(this.shogiBan),
                            m(this.editorMenu),
                            m('.c-shogiBan_bg', [
                                m('.c-shogiBan_base')
                            ])
                        ]),
                        m('.c-kifuPlayer_inner2', [
                            m(this.toolBar)
                        ])
                    ]),
                    m(this.kifuInfo)
                ]),
                m(this.moveList)
            ]),
        ]
    }
}
