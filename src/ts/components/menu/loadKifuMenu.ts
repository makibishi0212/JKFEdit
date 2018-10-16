// 棋譜読み込み用メニューのコンポーネント

import m from 'mithril'
import SingleComponentBasic from '../../singleComponentBasic'

export default class LoadKifuMenu extends SingleComponentBasic {
    public view(vnode) {
        return [
            m('label.label.is-main.c-shogiBan_menu_label', '棋譜の読み込み'),
            m('.field.c-shogiBan_menu_button',{
                ondragover: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                },
                ondrop: (e: DragEvent) => {
                    e.stopPropagation()
                    const file = e.dataTransfer.files[0]
                    if(file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const jkf = JSON.parse(reader.result as string)
                            this.appData.switch_EDITMOVEfromLOADKIFU(jkf)
                            m.redraw()
                        }
                        reader.readAsText(file)
                    }
                    
                    e.preventDefault()
                }
            }, [
                m(".file.is-boxed.is-danger", 
                    m("label.file-label", [
                        m("input.file-input[name='resume'][type='file']", {
                            onchange: m.withAttr('files', (files) => {
                                const file = files[0]
                                if(file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const jkf = JSON.parse(e.target.result)
                                        this.appData.switch_EDITMOVEfromLOADKIFU(jkf)
                                        m.redraw()
                                    }
                                    reader.readAsText(file)
                                }
                            })
                        }),
                        m("span.file-cta", [
                            m("span.file-icon", 
                                m("i.fas.fa-upload")
                            ),
                            m("span.file-label", 
                                "jkfファイルを選択…"
                            )
                        ])
                    ])
                )
            ]),
        ]
    }
}
