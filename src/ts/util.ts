import { KOMAOCHI, PLAYER } from "./const";

export default class Util {
    public static reverseBoard(board: Array<Array<any>>) {
        return board
            .slice()
            .reverse()
            .map(boardRow => {
            return boardRow.slice().reverse()
        })
    }

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

    public static komaochiName(komaochiType: number) {
        let komaochiString = ''
        switch(komaochiType) {
            case KOMAOCHI.KYO:
                komaochiString = 'KY'
                break
            case KOMAOCHI.KAKU:
                komaochiString = 'KA'
                break
            case KOMAOCHI.HISHA:
                komaochiString = 'HI'
                break
            case KOMAOCHI.HIKYO:
                komaochiString = 'HIKY'
                break
            case KOMAOCHI.NI:
                komaochiString = '2'
                break
            case KOMAOCHI.YON:
                komaochiString = '4'
                break
            case KOMAOCHI.ROKU:
                komaochiString = '6'
                break
            case KOMAOCHI.HACHI:
                komaochiString = '8'
                break
        }

        return komaochiString
    }

    public static canPromote(kind: string): boolean {
        let canPromote = false
        switch (kind) {
            case 'FU':
                canPromote = true
                break
            case 'KY':
                canPromote = true
                break
            case 'KE':
                canPromote = true
                break
            case 'GI':
                canPromote = true
                break
            case 'KA':
                canPromote = true
                break
            case 'HI':
                canPromote = true
                break
        }

        return canPromote
    }

    public static getAttr(vnode: Object, key: string):any {
        if(vnode && vnode['attrs'] && vnode['attrs'].hasOwnProperty(key)) {
            return vnode['attrs'][key]
        }else {
            return null
        }
    }

    public static getKifuPos(ax: number, ay: number, reverse: boolean = false):{x: number, y: number} {
        let x = (!reverse) ? 9 - ax : 10 - (9 - ax)
        let y = (!reverse) ? ay + 1 : 10 - (ay + 1)
        return {x: x, y: y}
    }

    public static getPromote(kind: string) {
        let promoteKind = kind
        switch (kind) {
            case 'FU':
                promoteKind = 'TO'
                break
            case 'KY':
                promoteKind = 'NY'
                break
            case 'KE':
                promoteKind = 'NK'
                break
            case 'GI':
                promoteKind = 'NG'
                break
            case 'KA':
                promoteKind = 'UM'
                break
            case 'HI':
                promoteKind = 'RY'
                break
        }
        return promoteKind
    }

    public static getDemote(kind: string) {
        let promoteKind = kind
        switch (kind) {
            case 'TO':
                promoteKind = 'FU'
                break
            case 'NY':
                promoteKind = 'KY'
                break
            case 'NK':
                promoteKind = 'KE'
                break
            case 'NG':
                promoteKind = 'GI'
                break
            case 'UM':
                promoteKind = 'KA'
                break
            case 'RY':
                promoteKind = 'HI'
                break
        }
        return promoteKind
    }

    // その駒が成ることができるかどうか
    public static isPromotable(fromY: number, toY: number, owner: number, kind: string) {
        if(!Util.canPromote(kind)) {
            return false
        }

        if(owner === PLAYER.SENTE) {
            if (toY <= 3 || fromY <= 3) {
                return true;
            } else {
                return false;
            }
        }else if(owner === PLAYER.GOTE) {
            if (toY >= 7 || fromY >= 7) {
                return true;
            } else {
                return false;
            }
        }

        return false
    }

    // その駒が成り駒かどうか
    public static isPromoted(kind) {
        let isPromoted = false
        switch (kind) {
            case 'TO':
                isPromoted = true
                break
            case 'NY':
                isPromoted = true
                break
            case 'NK':
                isPromoted = true
                break
            case 'NG':
                isPromoted = true
                break
            case 'UM':
                isPromoted = true
                break
            case 'RY':
                isPromoted = true
                break
        }

        return isPromoted
    }

    public static oppoPlayer(player: number) {
        if(player === PLAYER.SENTE) {
            return PLAYER.GOTE
        }else {
            return PLAYER.SENTE
        }
    }
}
