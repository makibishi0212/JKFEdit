// 編集・閲覧用のボタン群のコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import ToolButton from './toolButton'
import { STATE } from '../const';

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
                        iconClass: c('fa-fast-backward'),
                        action: () => {this.appData.go(0)},
                        isActive: (this.appData.currentNum) ? true : false
                    }),
                    m(this.toolButton, {
                        title: '一つ戻る',
                        iconClass: c('fa-chevron-left'),
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
                    m(this.toolButton, {
                        title: '先後交代',
                        iconClass: c('fa-exchange-alt', 'fa-rotate-90'),
                        action: () => { this.appData.isReverse = !this.appData.isReverse },
                        isActive: true,
                        color: this.appData.isReverse ? 'is-danger' : null
                    }),
                    m(this.toolButton, {
                        title: '棋譜情報表示',
                        iconClass: c('fa-info-circle'),
                        action: () => { this.appData.isOpenInfo = !this.appData.isOpenInfo },
                        isActive:  (this.appData.state === STATE.EDITMOVE || this.appData.state === STATE.VIEW) ? true : false,
                        color: this.appData.isOpenInfo ? 'is-danger' : null
                    }),
                    m(this.toolButton, {
                        title: 'jkfエクスポート',
                        iconClass: c('fa-file-export'),
                        action: () => { this.appData.export() },
                        isActive:  (this.appData.state === STATE.EDITMOVE || this.appData.state === STATE.VIEW) ? true : false
                    }),
                ])
            ])
        ]
    }
}
