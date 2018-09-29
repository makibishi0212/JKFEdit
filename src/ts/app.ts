import m from "mithril"

import 'bulma'
import 'bulma-switch'
import 'bulma-tooltip'

import "../scss/main.scss"

import JKFEdit from "./components/JKFEdit"
import { MODE } from "./const";

const jkfedit = JKFEdit.getInstance(JKFEdit)
/*
jkfedit.appData.init(MODE.VIEW, {
  "header": {
    "先手": "makibishi",
    "後手": "kunai"
  },
  "moves": [
    {"comments":["初期盤面"]},
    {"move":{"from":{"x":7,"y":7},"to":{"x":7,"y":6},"color":0,"piece":"FU"}},
    {"move":{"from":{"x":3,"y":3},"to":{"x":3,"y":4},"color":1,"piece":"FU"}}
  ]
})
*/

document.addEventListener('DOMContentLoaded', () => {
  m.route(document.body, "/", {
    "/": jkfedit
  })
})
