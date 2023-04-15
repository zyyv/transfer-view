import axios from 'axios'
import {Message as ElMessage} from 'element-ui'

const useErrorList = () => {
  return [
    {code: 403, type: 'warning', msg: '登录过期，请重新登录'},
    {code: 404, type: 'error', msg: '网络请求不存在'},
    {code: 500, type: 'error', msg: '服务器内部错误'},
  ]
}

const errorList = useErrorList()

class CancelToken {
  pending = new Map()
  whiteRequest = []

  getUrl(config) {
    return [config.method, config.url].join('&')
  }

  addPending(config) {
    const url = this.getUrl(config)

    config.cancelToken = new axios.CancelToken((cancel) => {
      if (!this.pending.has(url)) {
        // 如果 pending 中不存在当前请求，则添加进去
        this.pending.set(url, cancel)
      }
    })
  }

  removePending(config) {
    const url = this.getUrl(config)
    const method = url.split('&')[1]

    if (this.pending.has(url) && !this.whiteRequest.includes(method)) {
      // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
      const cancel = this.pending.get(url)
      cancel(url)
      this.pending.delete(url)
    }
  }

  clearPending() {
    for (const [url, cancel] of this.pending)
      cancel(url)

    this.pending.clear()
  }
}

export const cancelTokenIns = new CancelToken()

export class HttpRequest {
  _ins
  config
  static instance

  constructor(userConfig) {
    const defaultConfig = {
      timeout: 50000,
    }

    this.config = Object.assign({}, defaultConfig, userConfig)
    this._ins = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    })
    this._ins.defaults.headers.post['Content-Type']
      = 'application/x-www-form-urlencoded'

    this._init()
  }

  _init() {
    this._initRequest()
    this._initResponse()
  }

  _initRequest() {
    this._ins.interceptors.request.use(
      (config) => {
        cancelTokenIns.removePending(config)
        cancelTokenIns.addPending(config)
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  _initResponse() {
    this._ins.interceptors.response.use(
      (res) => {
        if (res.status !== 200) {
          ElMessage.error('网络错误')
          return Promise.reject(res)
        }
        const { code, msg } = res.data
        if (code !== 200) {
          displayError(code, msg)
          return Promise.reject(res.data)
        }

        return Promise.resolve(res)
      },
      (error) => {
        const { status } = error.response
        displayError(status)

        return Promise.reject(error)
      },
    )
  }

  $get = (url, params = {}, config = {}) => {
    return this._ins.get(url, { params, ...config })
  }

  $delete = (url, params = {}, config = {}) => {
    return this._ins.delete(url, { params, ...config })
  }

  $post = (url, data = {}, config = {}) => {
    return this._ins.post(url, data, config)
  }

  $put = (url, data = {}, config = {}) => {
    return this._ins.put(url, data, config)
  }

  static getInstance(config) {
    if (!HttpRequest.instance)
      HttpRequest.instance = new HttpRequest(config)

    return HttpRequest.instance
  }
}

function displayError(code, msg) {
  const errIns = errorList.find(e => e.code === code)
  if (errIns) {
    ElMessage[errIns.type](msg || errIns.msg)
    errIns.callback && errIns.callback()
  } else { ElMessage.error(msg || '未知错误') }
}

export const AxiosPlugin = {
  install(Vue, options) {
    const { $get, $delete, $post, $put } = HttpRequest.getInstance(options)
    Vue.prototype.$get = $get
    Vue.prototype.$delete = $delete
    Vue.prototype.$post = $post
    Vue.prototype.$put = $put
  }
}
