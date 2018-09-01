// 編集・閲覧用のボタン群のコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import ToolButton from './toolButton'

export default class ToolBar extends SingleComponentBasic {
    private toolButton: ToolButton

    public oninit() {
        this.toolButton = ToolButton.getInstance(ToolButton, this.appData)
    }

    public view() {

        return [
            m('.c-tool_comment', '初期盤面新規作成'),
            m('.c-tool_button', [

                // 一段目のツールボタンはどのステートでも表示する
                m('.c-tool_button_container', [
                    m(this.toolButton, {
                        title: '一番最初へ',
                        iconClass: 'fa-fast-backward',
                        action: () => {this.appData.go(0)},
                        isActive: (this.appData.currentNum) ? true : false
                    }),
                    m(this.toolButton, {
                        title: '一つ戻る',
                        iconClass: 'fa-chevron-left',
                        action: () => {this.appData.go(this.appData.currentNum - 1)},
                        isActive: (this.appData.currentNum) ? true : false
                    }),
                    m(this.toolButton, {
                        title: '一つ進む',
                        iconClass: c('fa-chevron-right'),
                        action: () => {this.appData.go(this.appData.currentNum + 1)},
                        isActive: (this.appData.currentNum < (this.appData.moves.length - 1)) ? true : false
                    }),
                    m(this.toolButton, {
                        title: '一番最後へ',
                        iconClass: c('fa-fast-forward'),
                        action: () => {this.appData.go(this.appData.moves.length - 1)},
                        isActive: (this.appData.currentNum < (this.appData.moves.length - 1)) ? true : false
                    }),
                ]),
                m('.c-tool_button_container', [
                    
                ])
            ])
        ]
    }
}
