
import SingleComponentBasic from '../singlecomponentBasic'
import m from 'mithril'
import ShogiBan from './shogiBan'
import MoveList from './moveList'
import ToolBar from './toolBar'
import EditorMenu from './editorMenu'
import KifuInfo from './kifuInfo'

export default class JKFEdit extends SingleComponentBasic {
    private shogiBan: ShogiBan
    private moveList: MoveList
    private toolBar: ToolBar
    private editorMenu: EditorMenu
    private kifuInfo: KifuInfo

    public oninit() {
        this.shogiBan = ShogiBan.getInstance(ShogiBan)
        this.moveList = MoveList.getInstance(MoveList)
        this.toolBar = ToolBar.getInstance(ToolBar)
        this.editorMenu = EditorMenu.getInstance(EditorMenu)
        this.kifuInfo = KifuInfo.getInstance(KifuInfo)
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
                oncreate: (vnode) => {
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
