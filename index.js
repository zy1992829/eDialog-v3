import { render, h, getCurrentInstance, ref } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import 'element-plus/es/components/dialog/style/css'

export default {
  install(app, config = {}) {
    app.config.globalProperties.useDialog = function () {
      const vm = getCurrentInstance()
      return function (compName, props = {}, fn, selfConfig = { title: '标题', isConfirm: true }) {
        let AllConfig = Object.assign(config, selfConfig)
        const floorBtn = AllConfig.isConfirm ? [
          h(ElButton, { type: 'primary', onClick: () => { success() } }, '确认'),
          h(ElButton, { type: '', onClick: () => { close() } }, '取消')
        ] : [
          h(ElButton, { type: '', onClick: () => { close() } }, '关闭')
        ]
        let vnode = null

        if (!compName) throw new Error('No pop-up content passed in'); 
        if (typeof compName == 'string') {
          vnode = compName
        } else if (typeof compName == 'object') {
          vnode = h(compName, props)
        } else {
          throw new Error('Please enter a valid value'); 
        }

        vnode.appContext = vm.appContext
        const dom = document.createElement('div')
        const dialogVnode = h(
          ElDialog,
          {
            onClosed: () => {
              close()
              dom.remove()
            },
            modelValue: true,
            draggable: true,
            closeOnClickModal: false,
            alignCenter: true,
            ...AllConfig
          },
          {
            default: () => vnode,
            footer: h('div', { class: 'dialog-footer' }, floorBtn)
          }
        )

        render(dialogVnode, dom)
        document.body.appendChild(dom)

        function success() {
          if (fn) {
            fn(vnode.component.exposed, close);
          }
        }
        function close() {
          dialogVnode.component.props.modelValue = false
          setTimeout(() => {
            dom.remove()
          },500)
        }
      }
    }
  }
}