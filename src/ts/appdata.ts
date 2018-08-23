import JkfEditor from 'jkfeditor'

export default class AppData {
    private _jkfEditor: JkfEditor = new JkfEditor()

    constructor() {
        
    }

    public get jkfEditor() {
        return this._jkfEditor
    }
}
