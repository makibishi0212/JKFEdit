export default class Util {
    public static komaClassName(kind: string, color: number, reverse: boolean = false):string {
        const PLAYER = {
            SENTE: 0,
            GOTE : 1
        }

        const ownerName = (reverse)? (color === PLAYER.SENTE) ? 'oppo' : 'prop' : (color === PLAYER.SENTE) ? 'prop' : 'oppo'
        let komaName = null
        switch (kind) {
            case 'FU':
                komaName = 'fu'
                break
            case 'KY':
                komaName = 'kyo'
                break
            case 'KE':
                komaName = 'kei'
                break
            case 'GI':
                komaName = 'gin'
                break
            case 'KI':
                komaName = 'kin'
                break
            case 'KA':
                komaName = 'kaku'
                break
            case 'HI':
                komaName = 'hisha'
                break
            case 'OU':
                komaName = 'ou'
                break
            case 'TO':
                komaName = 'to'
                break
            case 'NY':
                komaName = 'nkyo'
                break
            case 'NK':
                komaName = 'nkei'
                break
            case 'NG':
                komaName = 'ngin'
                break
            case 'UM':
                komaName = 'uma'
                break
            case 'RY':
                komaName = 'ryu'
                break
        }
        return (komaName) ? 'c-koma' + '_' + ownerName + '_' + komaName : ''
    }

    public static getAttr(vnode: Object, key: string):any {
        if(vnode && vnode['attrs'] && vnode['attrs'].hasOwnProperty(key)) {
            return vnode['attrs'][key]
        }else {
            return null
        }
    }
}
