import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import ShogiBan from './shogiBan'
import MoveList from './moveList'
import ToolBar from './toolBar';
import EditorMenu from './editorMenu';

export default class JKFEdit implements ComponentBasic {
    private appData: AppData = new AppData()
    
    private shogiBan: ShogiBan
    private moveList: MoveList
    private toolBar: ToolBar
    private editorMenu: EditorMenu

    constructor() {
        this.shogiBan = new ShogiBan(this.appData)
        this.moveList = new MoveList(this.appData)
        this.toolBar = new ToolBar(this.appData)
        this.editorMenu = new EditorMenu(this.appData)
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
