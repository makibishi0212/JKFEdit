// 棋譜に紐づく対局者、棋戦情報等の表示のコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'

export default class KifuInfo extends SingleComponentBasic {

    public view() {
        return [
            m('.c-kifuPlayer_info', {class: c('is-active')}, [])
        ]
    }
}
