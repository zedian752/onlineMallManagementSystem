module.exports = {
    configureWebpack: {
        resolve: {
          alias: {
            src: '@',
            // common: '@/common',
            // components: '@/components',
            // views: '@/views',
            // network: '@/network'
          }
        }
      },
    chainWebpack: config => {
        // 生产环境入口
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            // external 
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            // 生产环境为true，开发环境为false
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args;
            })
        })
        // 开发环境入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            // external
            config.set('externals', {
                // vue: 'Vue',
                // 'vue-roter':'VueRouter',
                // axios:'axios',
                // lodash:'_',
                // echarts: 'echarts',
                // "element-ui":'element-ui'
                // nprogress:'NProgress',
                // 'vue-quill-editor':'VueQuillEditor'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args;
            })
        })

    }
}