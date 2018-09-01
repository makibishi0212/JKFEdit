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
//TODO: 分岐ウインドウ
//TODO: 分岐切り替え・分岐削除
//TODO: 棋譜情報ウインドウ
//TODO: モードごとのボタン実装

