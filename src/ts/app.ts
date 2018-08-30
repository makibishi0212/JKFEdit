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
