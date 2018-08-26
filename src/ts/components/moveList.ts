// 指し手情報リストのコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'

export default class MoveList extends SingleComponentBasic {

    public view() {
        return [
            m('.c-kifu_container', [
                m('.c-kifu_title', this.appData.title),
                m('.c-kifu_listContainer', [
                    m('.c-kifu_list', [
                        // TODO: ここに棋譜を表示する
                        this.appData.jkfEditor.moves.map((move, num) => {
                            return m('.c-kifu_row', {
                                class: c((num === this.appData.jkfEditor.currentNum) ? 'is-active' : null)
                            }, [
                                m('.c-kifu_move_info', [
                                    m('.c-kifu_number', num + ':'),
                                    // 6文字以上なら小さく表示
                                    m('.c-kifu_move', {class: c((move.name.length >= 6) ? 'is-small' : null)}, move.name),
                                    m('.c-kifu_notation', [
                                        (move.comments) ?
                                        m('span', {class: c('c-kifu_notation_comment', 'icon', 'is-small')}, [
                                            m('i.fa.fa-commenting-o')
                                        ]) : null,
                                        (this.appData.jkfEditor.haveFork(num)) ?
                                        m('span.c-kifu_notation_branch.icon.is-small', [
                                            m('i.fa.fa-clone')
                                        ]) : null
                                    ])
                                ])
                            ])
                        })
                    ])
                ])
            ])
        ]
    }
}
