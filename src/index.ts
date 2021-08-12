const { defineProperty } = Object
const { insertBefore, removeChild } = Node.prototype
const componentName = 'Fragment'
const WARNING = `[${componentName}] Runtime directive used on component with non-element root node. The directives will not function as intended.`


const fragmentStyle = defineProperty({}, 'display', {
    get() {
        console.warn(WARNING)
    },
})
const descOfNextSibling = {
    get(this: CustomDocumentFragment) {
        // Get the last child's `nextSibling`
        return this._children.slice(-1)[0].elm.nextSibling
    },
}
const descOfParentNode = {
    get(this: CustomDocumentFragment) {
        // Get the child's `parentNode`
        return this._children[0].elm.parentNode
    },
}
const descOfDevTool = {
    set(this: CustomDocumentFragment, val: unknown) {
        // Pass to the first child
        this._children[0].elm.__vue__ = val
    },
}

function createDocumentFragment(vnode: VNode) {
    const fragment = document.createDocumentFragment() as CustomDocumentFragment
    defineProperty(fragment, '_children', {
        get: () => vnode.children,
    })
    fragment.setAttribute = newSetAttribute
    fragment.style = fragmentStyle
    defineProperty(fragment, 'nextSibling', descOfNextSibling)
    defineProperty(fragment, 'parentNode', descOfParentNode)
    defineProperty(fragment, '__vue__', descOfDevTool)
    return fragment
}

const descOfElm = {
    get(this: VNode) {
        return this._elm
    },
    set(this: VNode, val: Node) {
        this._elm = isCustomDocumentFragment(val) ? val : createDocumentFragment(this)
    },
}



export const Fragment = {
    name: componentName,
    render(this: any, h: Function) {
        const vm = this
        const vnode = h('i')
        vnode.children = vm.$slots.default || [vm._e(componentName)]
        defineProperty(vnode, 'elm', descOfElm) // hajack property `elm`
        return vnode
    },
    mounted(this: any) {
        // Hajack methods `removeChild` and `insertBefore` of parent node 
        const { parentNode } = this._vnode.children[0].elm
        parentNode.removeChild = newRemoveChild
        parentNode.insertBefore = newInsertBefore
    },
    
}

export function FragmentPlugin(Vue: { component: Function }) {
    Vue.component(componentName, Fragment)
}



function isCustomDocumentFragment(node: Node): node is CustomDocumentFragment {
    return node?.nodeType === 11 && '_children' in node
}

function newSetAttribute(this: CustomDocumentFragment, name: string, value: string) {
    for (const { elm } of this._children) {
        if (elm instanceof Element || isCustomDocumentFragment(elm)) {
            elm.setAttribute(name, value)
        }
    }
}

function newInsertBefore(this: Node, newNode: Node, referenceNode: Node) {
    if (isCustomDocumentFragment(referenceNode)) {
        this.insertBefore(newNode, referenceNode._children[0].elm)
    } else if (isCustomDocumentFragment(newNode)) {
        for (const { elm } of newNode._children) {
            if (isCustomDocumentFragment(elm)) {
                this.insertBefore(elm, referenceNode)
            } else {
                insertBefore.call(this, elm, referenceNode)
            }
        }
    } else {
        insertBefore.call(this, newNode, referenceNode)
    }
    return newNode
}

function newRemoveChild(this: Node, child: Node) {
    if (isCustomDocumentFragment(child)) {
        for(const { elm } of child._children) {
            if (isCustomDocumentFragment(elm)) {
                this.removeChild(elm)
            } else {
                removeChild.call(this, elm)
            }
        }
    } else {
        removeChild.call(this, child)
    }
    return child
}



interface CustomNode extends Node {
    __vue__?: unknown
}

interface VNode {
    _elm: CustomNode
    elm: CustomNode
    children: VNode[]
}

interface CustomDocumentFragment extends DocumentFragment {
    __vue__?: unknown
    _children: VNode[]
    setAttribute(name: string, value: string): void
    style: Record<string, unknown>
}
