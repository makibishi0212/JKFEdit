// 指し手情報リストのコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'

export default class MoveList implements ComponentBasic {
    private appData: AppData
    
    constructor(appData: AppData) {
        this.appData = appData
    }

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
