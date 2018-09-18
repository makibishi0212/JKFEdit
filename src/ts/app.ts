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

//TODO: 最後の指し手のハイライト
//TODO: 駒コンポーネントをモード別に実装するかアーキテクチャを検討
//TODO: VIEWモードの実装
