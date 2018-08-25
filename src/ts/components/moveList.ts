// 指し手情報リストのコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'

export default class MoveList extends SingleComponentBasic {

    public view() {
        return [
            m('.c-kifu_container', [
                m('.c-kifu_title', 'タイトル'),
                m('.c-kifu_listContainer', [

                ])
            ])
        ]
    }
}
