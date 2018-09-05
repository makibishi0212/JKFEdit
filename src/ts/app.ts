import m from "mithril"

import 'bulma'
import 'bulma-switch'
import 'bulma-tooltip'

import "../scss/main.scss"

import JKFEdit from "./components/JKFEdit"

const jkfedit = new JKFEdit()

document.addEventListener('DOMContentLoaded', () => {
  m.route(document.body, "/", {
    "/": jkfedit
  })
})

//TODO: forcePromoteをappdataで管理させる？
//TODO: 非活性のボタンが押せてしまう件の改修
//TODO: 最後の指し手のハイライト
//TODO: 棋譜情報ウインドウ
//TODO: モードごとのボタン実装

