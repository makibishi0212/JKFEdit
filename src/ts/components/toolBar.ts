// 編集・閲覧用のボタン群のコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import SingleComponentBasic from '../singleComponentBasic';

export default class ToolBar extends SingleComponentBasic {

    public view() {
        return [
            m('.c-tool_comment', '初期盤面新規作成'),
            m('.c-tool_button', [
                m('.c-tool_button_container', [

                ]),
                m('.c-tool_button_container', [
                    
                ])
            ])
        ]
    }
}
