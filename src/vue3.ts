import {
  createVNode,
  Fragment as RawFragment,
  App,
  VNode,
  ComponentPublicInstance,
} from 'vue'


const name = 'Fragment'


export const Fragment = {
  name,
  render(this: ComponentPublicInstance): VNode {
    return createVNode(RawFragment, null, this.$slots.default?.())
  },
}

export function FragmentPlugin(app: App) {
  app.component(name, Fragment)
}