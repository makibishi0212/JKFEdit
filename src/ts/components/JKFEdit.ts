import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import ShogiBan from './shogiBan'
import MoveList from './moveList'
import ToolBar from './toolBar'
import EditorMenu from './editorMenu'

export default class JKFEdit implements ComponentBasic {
    private appData: AppData
    private shogiBan: ShogiBan
    private moveList: MoveList
    private toolBar: ToolBar
    private editorMenu: EditorMenu

    public oninit() {
        this.appData = new AppData()
        this.shogiBan = ShogiBan.getInstance(ShogiBan, this.appData)
        this.moveList = MoveList.getInstance(MoveList, this.appData)
        this.toolBar = ToolBar.getInstance(ToolBar, this.appData)
        this.editorMenu = EditorMenu.getInstance(EditorMenu, this.appData)
    }

    public view() {
        return [
            m('.c-kifuPlayer', [
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
                    
                ]),
                m(this.moveList)
            ]),
        ]
    }
}
