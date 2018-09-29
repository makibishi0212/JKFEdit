import ComponentBasic from './componentBasic'
import AppData from './appdata';

export default class SingleComponentBasic implements ComponentBasic {
    public appData: AppData
    private static _instance:any

    constructor() {
        this.appData = AppData.getInstance()
    }


    public static getInstance<T extends SingleComponentBasic>(c: {new(): T; }) : T{
        if (this._instance == null){
            this._instance = new c()
        }
        return this._instance;
    }

    public view(vnode) {
        return []
    }
}
