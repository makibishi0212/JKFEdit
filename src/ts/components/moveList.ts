// 指し手情報リストのコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import { STATE, KIFUTYPE } from '../const';

export default class MoveList extends SingleComponentBasic {

    public view() {
        return [
            m('.c-kifu_container', [
                m('.c-kifu_title', this.appData.title),
                m('.c-kifu_listContainer', [
                    m('.c-kifu_list',{
                        onupdate: (vnode) => {
                            const targetHeight: number = (this.appData.currentNum * 24)
                                
                            // スクロール位置の調整
                            vnode.dom.scrollTop = (targetHeight - 480)
                        }
                    }, [
                        this.appData.moves.map((move, num) => {

                            let isActive = false
                            if(num === this.appData.currentNum) {
                                isActive = true
                            }

                            let dispComment = false
                            if(this.appData.state ===STATE.VIEW && move.comments) {
                                dispComment = true
                            }

                            let dispBranch = false
                            if(this.appData.kifuType === KIFUTYPE.JOSEKI) {
                                dispBranch = true
                            }else {
                                if(this.appData.haveFork(num)) {
                                    dispBranch = true
                                }
                            }
                            let dispDelete = false
                            if(this.appData.state === STATE.EDITMOVE && num === this.appData.currentNum && num !== 0) {
                                dispDelete = true
                            }


                            return m('.c-kifu_row', {
                                class: c(isActive ? 'is-active' : null),
                                onclick: () => {
                                    if(!isActive) {
                                        this.appData.go(num)
                                    }
                                }
                            }, [
                                m('.c-kifu_move_info', [
                                    m('.c-kifu_number', num + ':'),
                                    // 6文字以上なら小さく表示
                                    m('.c-kifu_move', {class: c((move.name.length >= 6) ? 'is-small' : null)}, move.name),
                                    m('.c-kifu_notation', [
                                        (dispComment) ?
                                        m('span', {class: c('c-kifu_notation_comment', 'icon', 'is-small')}, [
                                            m('i.fa.fa-commenting-o')
                                        ]) : null,
                                        (dispBranch) ?
                                        m('span.c-kifu_notation_branch.icon.is-small', [
                                            m('i.fa.fa-clone')
                                        ]) : null,
                                        (dispDelete) ?
                                        m('span.c-kifu_notation_close.icon.is-small',{
                                            onclick: () => {
                                                this.appData.deleteMove(num)
                                            }
                                        }, [
                                            m('i.fa.fa-times.fa-lg')
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
