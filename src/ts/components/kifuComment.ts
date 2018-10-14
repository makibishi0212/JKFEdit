// コメント領域のコンポーネント

import m from 'mithril'
import SingleComponentBasic from "../singleComponentBasic"
import { MODE, STATE } from '../const';

export default class KifuComment extends SingleComponentBasic {
    public view() {
        return [
            (this.appData.state === STATE.TOP) ?
            m('.c-tool_comment', 'メニュー選択') : null,
            (this.appData.state === STATE.NEWKIFU) ?
            m('.c-tool_comment', '棋譜の形式を入力') : null,
            (this.appData.state === STATE.LOADKIFU) ?
            m('.c-tool_comment', 'ファイルから棋譜読み込み') : null,
            (this.appData.state === STATE.EDITINFO) ?
            m('.c-tool_comment', '棋譜の詳細情報入力') : null,
            (this.appData.state === STATE.EDITBOARD) ?
            m('.c-tool_comment', '初期盤面入力') : null,
            (this.appData.state === STATE.EDITMOVE) ?
            m('textarea.c-tool_comment',{
                placeholder: 'コメントを入力…',
                value: this.appData.comment,
                oninput: m.withAttr('value', (comment) => {
                    this.appData.setComment(comment)
                }),
                onclick: () => {
                    this.appData.setCommentActive()
                }
            }, this.appData.comment) : null,
        ]
    }
}
