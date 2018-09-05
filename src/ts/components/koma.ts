// ひとつの駒のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Util from '../util'
import SingleComponentBasic from '../singleComponentBasic'
import { KOMATYPE } from '../const'

export default class Koma extends SingleComponentBasic {

    public view(vnode) {
        const kind = Util.getAttr(vnode, 'kind')
        const color = Util.getAttr(vnode, 'color') ? Util.getAttr(vnode, 'color') : 0
        const komaNum = Util.getAttr(vnode, 'komaNum') ? Util.getAttr(vnode, 'komaNum'): 1
        const dispType = Util.getAttr(vnode, 'dispType') ? Util.getAttr(vnode, 'dispType'): KOMATYPE.NORMAL

        const posX = Util.getAttr(vnode, 'posX')
        const posY = Util.getAttr(vnode, 'posY')

        const forcePromote = Util.getAttr(vnode, 'forcePromote')
        const selectPromote = Util.getAttr(vnode, 'selectPromote')

        let komaProp = {}

        let colorClass: string = null
        let clickAction: Function = null
        if(dispType === KOMATYPE.FROM){
            colorClass = 'is-blue'
            clickAction = () => {
                this.appData.edit_inputFrom(posX, posY, kind)
            }
        }else if(dispType === KOMATYPE.TO){
            colorClass = 'is-red'
            clickAction = () => {
                this.appData.edit_inputTo(posX, posY, forcePromote)
            }
        }else if(dispType === KOMATYPE.NORMAL) {
            clickAction = () => {
                this.appData.edit_inputReset()
            }
        }

        komaProp['class'] = c(colorClass)
        if(clickAction) komaProp['onclick'] = clickAction

        return [
            m('.c-koma_piece_base', komaProp, [
                (selectPromote) ? 
                m('.c-koma_menu_container', [
                    m('.c-koma_half_button.is-nari', {
                        onclick: () => {
                            this.appData.edit_inputNari(true)
                        }
                    }, '成'),
                    m('.c-koma_half_button.is-funari', {
                        onclick: () => {
                            this.appData.edit_inputNari(false)
                        }
                    }, '不成')
                ]) 
                : null,
                (komaNum > 1) ? m('.c-koma_piece_num', komaNum) : null,
                m('.c-koma_piece', {class: c(kind ? Util.komaClassName(kind, color, this.appData.isReverse): null)})
            ])
        ]
    }
}
