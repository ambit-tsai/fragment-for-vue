const fs = require('fs');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const banner = require('./banner');


(async () => {
    await fs.promises.rm('dist', {
        force: true,
        recursive: true,
    })
    await fs.promises.mkdir('dist')
    compile('src/index.ts')
    compile('src/vue3.ts')
    copyFile('package.json')
    copyFile('README.md')
    copyFile('LICENSE')
})();


async function compile(file) {
    const bundle = await rollup.rollup({
        input: file,
        external: [
            'vue',
        ],
        plugins: [
            typescript(),
            terser(),
        ],
    })
    await bundle.write({
        dir: 'dist',
        banner,
        format: 'esm',
        sourcemap: true,
    })
}

function copyFile(file) {
    fs.copyFile(file, `dist/${file}`, err => {
        if (err) console.log(err)
    })
}