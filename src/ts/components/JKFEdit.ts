
import SingleComponentBasic from '../singlecomponentBasic'
import m from 'mithril'
import AppData from '../appdata'
import ShogiBan from './shogiBan'
import MoveList from './moveList'
import ToolBar from './toolBar'
import EditorMenu from './editorMenu'
import KifuInfo from './kifuInfo';
import { MODE } from '../const';

export default class JKFEdit extends SingleComponentBasic {
    private shogiBan: ShogiBan
    private moveList: MoveList
    private toolBar: ToolBar
    private editorMenu: EditorMenu
    private kifuInfo: KifuInfo

    constructor() {
        super(new AppData(MODE.EDIT))
        /*
        super(new AppData(MODE.VIEW, {
            "header": {
              "先手": "makibishi",
              "後手": "kunai"
            },
            "moves": [
              {"comments":["初期盤面"]},
              {"move":{"from":{"x":7,"y":7},"to":{"x":7,"y":6},"color":0,"piece":"FU"}},
              {"move":{"from":{"x":3,"y":3},"to":{"x":3,"y":4},"color":1,"piece":"FU"}}
            ]
        }))
        */
    }

    public oninit() {
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
