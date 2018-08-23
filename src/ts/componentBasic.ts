import * as m from 'mithril';

export default interface ComponentBasic extends m.Component<{}, {}> {
    oninit?: (vnode: m.VnodeDOM<{}, {}>) => void;
    oncreate?: (vnode: m.VnodeDOM<{}, {}>) => void;
    onbeforeupdate?: (vnode: m.VnodeDOM<{}, {}>, old) => boolean;
    onupdate?: (vnode: m.VnodeDOM<{}, {}>) => void;
    onbeforeremove?: (vnode: m.VnodeDOM<{}, {}>) => void;
    onremove?: (vnode: m.VnodeDOM<{}, {}>) => void;

    view: (vnode: m.VnodeDOM<{}, {}>) => m.Vnode<{}, {}>[];
}
