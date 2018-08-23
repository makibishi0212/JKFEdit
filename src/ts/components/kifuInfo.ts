// 棋譜に紐づく対局者、棋戦情報等の表示のコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'

export default class KifuInfo implements ComponentBasic {
    private appData: AppData

    constructor(appData: AppData) {
        this.appData = appData
    }

    public view() {
        return [
            m('.c-kifuPlayer_info', {class: c('is-active')}, [])
        ]
    }
}
