// 指し手情報リストのコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import { STATE, KIFUTYPE, EDITSTATE } from '../const';

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
                                // 初期盤面と最後の指し手では分岐指し手アイコンを表示しない
                                if(num !== 0 && num !== this.appData.moves.length - 1 && (isActive || this.appData.haveFork(num))) {
                                    dispBranch = true 
                                }
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
                                        m('span.c-kifu_notation_branch.icon.is-small',{
                                            onclick: () => {
                                                this.appData.openFork(num)
                                            }
                                        }, [
                                            m('i.far.fa-clone')
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
                    ]),

                    // 分岐候補を表示するウインドウ
                    m('.c-kifu_fork', {class: c(this.appData.isOpenFork ? 'is-active' : null)}, [
                        m('.c-kifu_select', [
                            m('.c-kifu_move_info', [
                                m('.c-kifu_forkTitle', '次の指し手候補'),
                                m('.c-kifu_notation', [
                                    m('span', {onclick: () => {this.appData.closeFork()}}, 
                                        m('i.fa.fa-times.fa-lg')
                                    )
                                ])
                            ])
                        ]),
                        this.appData.forks.map((forkMove, forkNum) => {
                            return m('.c-kifu_row.c-kifu_forkRow', {
                                class: (this.appData.forkIndex === forkNum) ? 'is-active' : null,
                                onclick: () => {this.appData.switchFork(forkNum)}
                            }, m('.c-kifu_move_info', [
                                m('div', {class: c('c-kifu_number')}, forkNum + ':'),
                                m('div', {class: c('c-kifu_move')}, forkMove.name)
                            ]))
                        }),
                        m('.c-kifu_row.c-kifu_addRow', {
                            onclick: () => {
                                this.appData.addForkMove()
                            }
                        }, m('.c-kifu_move_info', [
                            (this.appData.editState === EDITSTATE.INPUTFROM) ?
                            [
                                m('div', {class: c('c-kifu_number')}, 
                                    m('span.icon.is-small', 
                                        m('i.fa.fa-exclamation-circle')
                                    )
                                ),
                                m('div.c-kifu_move.c-kifu_move_input', '分岐を入力して下さい')
                            ]
                            :
                            [
                                m('div', {class: c('c-kifu_number')}, 
                                    m('span.icon.is-small', 
                                        m('i.fa.fa-plus')
                                    )
                                ),
                                m('div.c-kifu_move', '分岐を追加')
                            ]
                        ]))
                    ]),

                    m('.c-kifu_blackOut', {class: c(this.appData.isOpenFork ? 'is-active' : null)})
                ])
            ])
        ]
    }
}
