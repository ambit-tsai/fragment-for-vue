# Fragment For Vue
Provide multi-root support in Vue 2, and able to work in Vue 3. 


## ✨ Comparison with `vue-fragment`
|Features|`fragment-for-vue`|`vue-fragment`|
|-|:-:|:-:|
|Vue 3|✅|❎|
|Vue Devtools|✅|❎|
|Directive `v-for`|✅|❎|
|Directive `v-if`|✅|❎|
|TypeScript|✅|✅|


## ⬇️ Install
```
npm i -S fragment-for-vue
```


## 📃 Usage
### In Vue 2
```javascript
import Vue from 'vue'
import { FragmentPlugin } from 'fragment-for-vue'

Vue.use(FragmentPlugin)
```
```html
<script>
    import { Fragment } from 'fragment-for-vue'

    export default {
        components: {
            Fragment,
        },
    }
</script>
```
```html
<template>
    <Fragment>
        <h1>title</h1>
        <Fragment v-for="i in 6" :key="i">
            <p>Num is {{ i }}</p>
        </Fragment>
    </Fragment>
</template>
```

### In Vue 3
```diff
- import { Fragment } from 'fragment-for-vue'
+ import { Fragment } from 'fragment-for-vue/vue3'
```
```javascript
import Vue from 'vue'
import { FragmentPlugin } from 'fragment-for-vue/vue3'

Vue.use(FragmentPlugin)
```


## ☎️ Contact
1. WeChat: ambit_tsai
1. QQ Group: 663286147
1. E-mail: ambit_tsai@qq.com
