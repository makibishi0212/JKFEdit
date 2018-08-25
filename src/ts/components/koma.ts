// ひとつの駒のコンポーネント

import ComponentBasic from '../componentBasic'
import m from 'mithril'
import c from 'classNames'
import AppData from '../appdata'
import Util from '../util';
import SingleComponentBasic from '../singleComponentBasic';

export default class Koma extends SingleComponentBasic {

    public view(vnode) {
        let kind = Util.getAttr(vnode, 'kind') ? Util.getAttr(vnode, 'kind'): null
        let color = Util.getAttr(vnode, 'color') ? Util.getAttr(vnode, 'color') : 0
        let komaNum = Util.getAttr(vnode, 'komaNum') ? Util.getAttr(vnode, 'color'): 1

        return [
            m('.c-koma_piece_base', [
                (komaNum > 1) ? m('.c-koma_piece_num', komaNum) : null,
                m('.c-koma_piece', {class: c(kind ? Util.komaClassName(kind, color, false): null)})
            ])
        ]
    }
}
