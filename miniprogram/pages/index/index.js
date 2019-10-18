//index.js
const app = getApp()
// 初始化云开发
const db = wx.cloud.database({env: 'eks'})
// 初始化云数据库
const collection = db.collection('music')
// 音乐相关
const audio = wx.getBackgroundAudioManager()
audio.autoplay = true;
audio.loop = true;
// audio.title = '此时此刻'
// audio.epname = '此时此刻'
// audio.singer = '许巍'
// audio.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
// audio.src = 'http://127.0.0.1:8080/1.mp3'
// wx.playBackgroundAudio({
//   dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
//   title: '此时此刻',
//   coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
// })
// console.log('aaa')
Page({
  data: {
    currentTab: 'people',
    musicList: [], // 音乐列表
    music: {
      img: 'https://656b-eks-1259468723.tcb.qcloud.la/assets/img/logo.jpg', // 图片地址
      name: '', // 歌名
      src: 'aa', // 播放地址
      status: 0, // 1 播放 0 暂停
      currentTime: '', // 当前播放时间
      duration: '', // 总时长
      start: 0, // 截取时间-开始时间
      end: 0, // 截取时间-结束时间
      autoLoop: false // 定制循环
    },
    loop: {
      start: 0, // 截取时间-开始时间
      end: 0 // 截取时间-结束时间
    },
    modalVisible: false // modal 开关
  },

  onLoad () {
    this.getMusicList(this.currentTab)
    // let audio = wx.getBackgroundAudioManager()
    // const audio = wx.getBackgroundAudioManager()
    // audio.title = '此时此刻'
    // audio.epname = '此时此刻'
    // audio.singer = '许巍'
    // audio.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // audio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    console.log(audio)
  },

  // 右上角分享事件
  onShareAppMessage () {
    return {
      title: '学口哨，教鹦鹉',
      path: '/index',
      imageUrl: 'https://656b-eks-1259468723.tcb.qcloud.la/assets/img/share.jpg'
    }
  },

  /**
   * 钩子函数
   */

  // 切换tab
  handleChangeTabs ({ detail }) {
    this.setData({
      currentTab: detail.key
    })
    
    this.getMusicList(this.currentTab)
  },

  handleChangePlayStatus () {
    this.music.status = (this.music.status + 1) % 2
    if (this.music.status) { // 播放
      audio.play()
    } else {
      audio.pause()
    }
  },

  // 点击了播放按钮
  handlePlay (item) {
    item = item.target.dataset.item
    // console.log(item.src)
    console.log(audio, item)
    audio.title = item.name
    audio.epname = item.name
    audio.singer = item.type
    audio.coverImgUrl = item.img
    audio.src = item.src
    // if (this.music.src !== item.src) {
    //   if (this.music.src) {
    //     audio.stop()
    //   }
      // audio.title = item.name
      // audio.coverImgUrl = item.img
      // audio.src = item.src
      // audio.title = item.name // 防止没设置到 title
      // audio.title = '此时此刻'
      // audio.epname = '此时此刻'
      // audio.singer = '许巍'
      // audio.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
      // audio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
      // this.music.name = item.name
      // this.music.img = item.img
      // this.music.src = item.src
      // this.music.status = 1
    // }
  },

  handleShowModal () { // 打开 modal
    this.loop.start = this.music.start
    this.loop.end = this.music.end
    this.modalVisible = true
  },

  handleChangeMusicStart ({ detail }) { // 调整开始时间
    this.loop.start = detail.value
    if (this.loop.end < this.loop.start) {
      this.loop.end = this.loop.start
    }
    this.$apply()
  },

  handleChangeMusicEnd ({ detail }) { // 调整结束时间
    this.loop.end = detail.value
    if (this.loop.end < this.loop.start) {
      this.loop
      .start = this.loop.end
    }
    this.$apply()
  },

  handleModalOk () { // 设置了循环时间
    if (this.loop.start === this.loop.end) {
      return false
    }
    this.music.start = this.loop.start
    this.music.end = this.loop.end
    this.music.autoLoop = true
    this.modalVisible = false
  },

  handleModalCancel () {
    this.music.start = 0
    this.music.end = 0
    this.music.autoLoop = false
    this.modalVisible = false
  },

  /**
   * 自定义函数区域
   */
  getMusicList (type) {
    collection.where({
      type
    }).get({
      success: (res) => {
        this.setData({
          musicList: res.data
        })
      }
    })
  }
})