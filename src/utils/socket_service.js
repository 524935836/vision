export default class SocketService {
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null
  // 存储回调函数，当服务器返回数据自动调用
  callBackMapping = {}
  // 连接的状态
  connected = false
  sendRetryCount = 0
  connectRetryCount = 0
  connect() {
    if (!window.WebSocket) console.log('你的浏览器不支持WebSocket')
    // 创建WebSocket实例,赋值给SocketService实例的方法
    // this.ws = new WebSocket('ws://localhost:9998')
    this.ws = new WebSocket('ws://101.34.160.195:9998')
    // 连接成功的事件
    this.ws.onopen = () => {
      // console.log('连接服务器成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    // 连接失败的回调
    this.ws.onclose = () => {
      // console.log('连接服务器失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
    }
    // 接收服务器数据的回调
    this.ws.onmessage = msg => {
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          // 执行获取数据的回调
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 注册回调函数
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 注销回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送请求
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
