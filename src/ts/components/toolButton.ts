// ひとつのツールボタンのコンポーネント

import m from 'mithril'
import c from 'classNames'
import SingleComponentBasic from '../singleComponentBasic'
import Util from '../util';

export default class ToolButton extends SingleComponentBasic {

    public view(vnode) {
        const title = Util.getAttr(vnode, 'title') ? Util.getAttr(vnode, 'title') : 'ボタン名'
        const iconClass = Util.getAttr(vnode, 'iconClass')
        const isActive = Util.getAttr(vnode, 'isActive')
        const action = Util.getAttr(vnode, 'action')
        const isSmall = Util.getAttr(vnode, 'isSmall')
        const color = Util.getAttr(vnode, 'color')

        return [
            m('button.button.is-tooltip-info', {
                disabled: !isActive,
                onclick: action,
                'data-tooltip': title,
                class: c(color, isActive ? 'tooltip' : null)
            }, [
                m('span.icon', 
                    m('i.fa', {class: iconClass})
                )
            ])
        ]
    }
}
