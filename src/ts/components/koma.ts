// ひとつの駒のコンポーネント

import m from 'mithril'
import c from 'classNames'
import Util from '../util'
import SingleComponentBasic from '../singleComponentBasic'
import { KOMATYPE, PLAYER, STATE, CREATESTATE } from '../const'

export default class Koma extends SingleComponentBasic {

    public hoverX: number = -1
    public hoverY: number = -1

    public view(vnode) {
        // 駒の種類と持ち主
        let kind = Util.getAttr(vnode, 'kind')
        const color = Util.getAttr(vnode, 'color') ? Util.getAttr(vnode, 'color') : 0

        // 駒の枚数
        const komaNum = Util.getAttr(vnode, 'komaNum') ? Util.getAttr(vnode, 'komaNum'): 1

        // 駒の表示モード
        const dispType = Util.getAttr(vnode, 'dispType') ? Util.getAttr(vnode, 'dispType'): KOMATYPE.NORMAL

        // 駒の座標
        const posX = Util.getAttr(vnode, 'posX')
        const posY = Util.getAttr(vnode, 'posY')

        // そのエリアに移動時に強制成の必要があるかどうか
        const forcePromote = Util.getAttr(vnode, 'forcePromote')

        // 対象の駒が盤に配置しようとしている駒かどうか
        const setTarget = Util.getAttr(vnode, 'setTarget')

        // 未配置駒かどうか
        const isUnset = Util.getAttr(vnode, 'isUnset')

        // その場所に配置可能かどうか
        let isReady = false

        // 編集モードに移行可能かどうか
        let isEditable = false

        // ホバー時に何らかの処理を行うかどうか
        let isHoverable = false

        let komaProp = {}

        let colorClass: string = null
        let clickAction: Function = null
        let mouseoverAction: Function = null
        let mouseoutAction: Function = null

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
            if(setTarget) {
                colorClass = 'is-green'
            }

            if(this.appData.state === STATE.EDITMOVE) {
                clickAction = () => {
                    this.appData.edit_inputReset()
                }
            }else if(this.appData.state === STATE.EDITBOARD) {
                // unset、持ち駒、盤上の駒で処理が異なる
                if(isUnset) {
                    // unsetの場合
                    clickAction = () => {
                        if(setTarget) {
                            this.appData.create_inputReset()
                        }else {
                            this.appData.create_inputKind(kind)
                        }
                    }
                }else {
                    if(posX === -1 && posY === -1) {
                        // 持ち駒の場合
                        if(this.appData.createState === CREATESTATE.INPUTKIND) {
                            colorClass = 'is-blue'
                            clickAction = () => {
                                this.appData.removeHandCreateBoard(color, kind)
                                if(this.appData.hands[kind]) {
                                    this.appData.create_inputReset()
                                }
                            }               
                        }
                    }else {
                        // 盤上の駒の場合
                        if(this.appData.createState === CREATESTATE.INPUTKIND) {
                            isHoverable = true
                            if(posX === this.hoverX && posY === this.hoverY && kind) {
                                colorClass = 'is-blue'
                                isEditable = true
                            }
                        }

                        clickAction = () => {
                            if(this.appData.createState === CREATESTATE.INPUTKIND) {
                                this.appData.create_komaEdit(posX, posY)
                            }else {
                                this.setHover(posX, posY)
                                this.appData.create_inputReset()
                            }
                        }
                    }
                }
            }
        }else if(dispType === KOMATYPE.KIND) {
            colorClass = 'is-blue'
            clickAction = () => {
                this.appData.create_inputKind(kind)
            }
        }else if(dispType === KOMATYPE.POS) {
            isHoverable = true

            clickAction = () => {
                this.appData.create_inputPos(posX, posY)
            }

            if(posX === this.hoverX && posY === this.hoverY && !kind) {
                kind = this.appData.setKomaKind
                isReady = true
            }
        }else if(dispType === KOMATYPE.EDIT) {
            clickAction = () => {

            }
        }else if(dispType === KOMATYPE.LAST) {
            colorClass = 'is-red'
        }

        if(isHoverable) {
            mouseoverAction = () => {
                this.setHover(posX, posY)
            }

            mouseoutAction = () => {
                this.setHover(-1, -1)
            }
        }else {
            this.setHover(-1, -1)
        }

        komaProp['class'] = c(colorClass)
        if(clickAction) komaProp['onclick'] = clickAction
        if(mouseoverAction) komaProp['onmouseenter'] = mouseoverAction
        if(mouseoutAction) komaProp['onmouseleave'] = mouseoutAction

        return [
            m('.c-koma_piece_base', komaProp, [
                // 駒状態の編集
                (dispType === KOMATYPE.EDIT) ?
                m('.c-koma_menu_container', [
                    m('.c-koma_half_button.is-change', {
                        onclick: (e: MouseEvent) => {
                            this.appData.switchColorCreateBoard(posX, posY)
                            this.appData.create_inputReset()
                            e.stopPropagation()
                        }
                    }, (color !== PLAYER.SENTE) ? '先手' : '後手'),
                    m('.c-koma_half_button.is-nari', {
                        onclick: (e: MouseEvent) => {
                            this.appData.switchNariCreateBoard(posX, posY)
                            this.appData.create_inputReset()
                            e.stopPropagation()
                        }
                    },  (Util.isPromoted(kind)) ? '不成' : '成り')
                ])
                :
                null,

                // 駒の成・不成
                (dispType === KOMATYPE.PROMOTE) ? 
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

                (isEditable) ?
                m('.c-koma_menu_container', [
                    m('.delete.is-small', {
                        onclick: (e: MouseEvent) => {
                            this.appData.unsetCreateBoard(posX, posY)
                            e.stopPropagation()
                        }
                    })
                ]) 
                : null,

                (komaNum > 1) ? m('.c-koma_piece_num', komaNum) : null,
                m('.c-koma_piece', {class: c(kind ? Util.komaClassName(kind, color, this.appData.isReverse): null, isReady ? 'is-ready' : false)})
            ])
        ]
    }

    public setHover(posX: number, posY: number) {
        this.hoverX = posX
        this.hoverY = posY
    }
}
