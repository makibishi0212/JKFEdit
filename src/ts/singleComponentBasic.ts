import ComponentBasic from './componentBasic'
import AppData from './appdata';

export default class SingleComponentBasic implements ComponentBasic {
    public appData: AppData
    private static _instance:any

    constructor(appdata: AppData) {
        this.appData = appdata
    }


    public static getInstance<T extends SingleComponentBasic>(c: {new(appdata): T; }, appData) : T{
        if (this._instance == null){
            this._instance = new c(appData)
        }else {
            this._instance.appdata = appData
        }
        return this._instance;
    }

    public view(vnode) {
        return []
    }
}
