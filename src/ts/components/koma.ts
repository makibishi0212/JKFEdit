// ひとつの駒のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Util from '../util';
import SingleComponentBasic from '../singleComponentBasic';
import { KOMATYPE } from '../const';

export default class Koma extends SingleComponentBasic {

    public view(vnode) {
        let kind = Util.getAttr(vnode, 'kind') ? Util.getAttr(vnode, 'kind'): null
        let color = Util.getAttr(vnode, 'color') ? Util.getAttr(vnode, 'color') : 0
        let komaNum = Util.getAttr(vnode, 'komaNum') ? Util.getAttr(vnode, 'komaNum'): 1
        let dispType = Util.getAttr(vnode, 'dispType') ? Util.getAttr(vnode, 'dispType'): KOMATYPE.NORMAL

        let colorClass = null
        if(dispType === KOMATYPE.FROM) colorClass = 'is-blue'
        if(dispType === KOMATYPE.TO) colorClass = 'is-red'

        return [
            m('.c-koma_piece_base', {class: c(colorClass)}, [
                (komaNum > 1) ? m('.c-koma_piece_num', komaNum) : null,
                m('.c-koma_piece', {class: c(kind ? Util.komaClassName(kind, color, false): null)})
            ])
        ]
    }
}
