'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 云开发数据库相关
wx.cloud.init();
var db = wx.cloud.database({ env: 'eks' });
var collection = db.collection('music');

// 音乐相关
var audio = wx.getBackgroundAudioManager();

var Index = function (_wepy$page) {
  _inherits(Index, _wepy$page);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '口哨丨玄凤鹦鹉虎皮鹦鹉牡丹鹦鹉',
      usingComponents: {
        'i-tabs': '../iview/tabs/index',
        'i-tab': '../iview/tab/index',
        'i-icon': '../iview/icon/index',
        'i-cell-group': '../iview/cell-group/index',
        'i-cell': '../iview/cell/index',
        'i-modal': '../iview/modal/index',
        'i-input-number': '../iview/input-number/index'
      }
    }, _this.mixins = [], _this.data = {
      currentTab: 'people',
      musicList: [], // 音乐列表
      music: {
        img: '', // 图片地址
        name: '', // 歌名
        src: '', // 播放地址
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
    }, _this.computed = {}, _this.methods = {
      handleChangeTabs: function handleChangeTabs(_ref2) {
        var detail = _ref2.detail;

        this.currentTab = detail.key;
        this.getMusicList(this.currentTab);
      },
      handleChangePlayStatus: function handleChangePlayStatus() {
        this.music.status = (this.music.status + 1) % 2;
        if (this.music.status) {
          // 播放
          audio.play();
        } else {
          audio.pause();
        }
      },
      handlePlay: function handlePlay(item) {
        if (this.music.src !== item.src) {
          if (this.music.src) {
            audio.stop();
          }
          audio.title = item.name;
          audio.coverImgUrl = item.img;
          audio.src = item.src;
          audio.title = item.name; // 防止没设置到 title
          this.music.name = item.name;
          this.music.img = item.img;
          this.music.src = item.src;
          this.music.status = 1;
        }
      },
      handleShowModal: function handleShowModal() {
        // 打开 modal
        this.loop.start = this.music.start;
        this.loop.end = this.music.end;
        this.modalVisible = true;
      },
      handleChangeMusicStart: function handleChangeMusicStart(_ref3) {
        var detail = _ref3.detail;
        // 调整开始时间
        this.loop.start = detail.value;
        if (this.loop.end < this.loop.start) {
          this.loop.end = this.loop.start;
        }
        this.$apply();
      },
      handleChangeMusicEnd: function handleChangeMusicEnd(_ref4) {
        var detail = _ref4.detail;
        // 调整结束时间
        this.loop.end = detail.value;
        if (this.loop.end < this.loop.start) {
          this.loop.start = this.loop.end;
        }
        this.$apply();
      },
      handleModalOk: function handleModalOk() {
        // 设置了循环时间
        if (this.loop.start === this.loop.end) {
          return false;
        }
        this.music.start = this.loop.start;
        this.music.end = this.loop.end;
        this.music.autoLoop = true;
        this.modalVisible = false;
      },
      handleModalCancel: function handleModalCancel() {
        this.music.start = 0;
        this.music.end = 0;
        this.music.autoLoop = false;
        this.modalVisible = false;
      }
    }, _this.events = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: 'getMusicList',
    value: function getMusicList(type) {
      var _this2 = this;

      collection.where({
        type: type
      }).get({
        success: function success(res) {
          _this2.musicList = res.data;
          _this2.$apply();
        }
      });
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {
      var _this3 = this;

      this.getMusicList(this.currentTab);
      audio.onTimeUpdate(function () {
        _this3.music.currentTime = Math.floor(audio.currentTime);
        _this3.music.duration = Math.floor(audio.duration);
        if (_this3.music.autoLoop && (_this3.music.currentTime >= _this3.music.end || _this3.music.currentTime < _this3.music.start)) {
          // 开启自动循环
          _this3.music.currentTime = _this3.music.start;
          audio.seek(_this3.music.start);
        }
        _this3.$apply();
      });
      audio.onEnded(function () {
        audio.src = _this3.music.src;
        audio.title = _this3.music.name;
      });
      audio.onStop(function () {
        setTimeout(function () {
          if (!audio.src) {
            _this3.music.src = '';
            _this3.music.img = '';
            _this3.music.name = '';
            _this3.music.duration = '';
          }
          _this3.$apply();
        }, 1000);
      });
    }
  }]);

  return Index;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Index , 'pages/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInd4IiwiY2xvdWQiLCJpbml0IiwiZGIiLCJkYXRhYmFzZSIsImVudiIsImNvbGxlY3Rpb24iLCJhdWRpbyIsImdldEJhY2tncm91bmRBdWRpb01hbmFnZXIiLCJJbmRleCIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJ1c2luZ0NvbXBvbmVudHMiLCJtaXhpbnMiLCJkYXRhIiwiY3VycmVudFRhYiIsIm11c2ljTGlzdCIsIm11c2ljIiwiaW1nIiwibmFtZSIsInNyYyIsInN0YXR1cyIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJzdGFydCIsImVuZCIsImF1dG9Mb29wIiwibG9vcCIsIm1vZGFsVmlzaWJsZSIsImNvbXB1dGVkIiwibWV0aG9kcyIsImhhbmRsZUNoYW5nZVRhYnMiLCJkZXRhaWwiLCJrZXkiLCJnZXRNdXNpY0xpc3QiLCJoYW5kbGVDaGFuZ2VQbGF5U3RhdHVzIiwicGxheSIsInBhdXNlIiwiaGFuZGxlUGxheSIsIml0ZW0iLCJzdG9wIiwidGl0bGUiLCJjb3ZlckltZ1VybCIsImhhbmRsZVNob3dNb2RhbCIsImhhbmRsZUNoYW5nZU11c2ljU3RhcnQiLCJ2YWx1ZSIsIiRhcHBseSIsImhhbmRsZUNoYW5nZU11c2ljRW5kIiwiaGFuZGxlTW9kYWxPayIsImhhbmRsZU1vZGFsQ2FuY2VsIiwiZXZlbnRzIiwidHlwZSIsIndoZXJlIiwiZ2V0Iiwic3VjY2VzcyIsInJlcyIsIm9uVGltZVVwZGF0ZSIsIk1hdGgiLCJmbG9vciIsInNlZWsiLCJvbkVuZGVkIiwib25TdG9wIiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDRTs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQUEsR0FBR0MsS0FBSCxDQUFTQyxJQUFUO0FBQ0EsSUFBTUMsS0FBS0gsR0FBR0MsS0FBSCxDQUFTRyxRQUFULENBQWtCLEVBQUNDLEtBQUssS0FBTixFQUFsQixDQUFYO0FBQ0Es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QUhEO0FBSUFaLFlBQU1zRCxNQUFOLENBQWEsWUFBTTtBQUNqQkMsbUJBQVcsWUFBTTtBQUNmLGNBQUksQ0FBQ3ZELE1BQU1hLEdBQVgsRUFBZ0I7QUFDZCxtQkFBS0gsS0FBTCxDQUFXRyxHQUFYLEdBQWlCLEVBQWpCO0FBQ0EsbUJBQUtILEtBQUwsQ0FBV0MsR0FBWCxHQUFpQixFQUFqQjtBQUNBLG1CQUFLRCxLQUFMLENBQVdFLElBQVgsR0FBa0IsRUFBbEI7QUFDQSxtQkFBS0YsS0FBTCxDQUFXTSxRQUFYLEdBQXNCLEVBQXRCO0FBQ0Q7QUFDRCxpQkFBS3VCLE1BQUw7QUFDRCxTQVJELEVBUUcsSUFSSDtBQVNELE9BVkQ7QUFXRDs7OztFQXhKZ0NpQixlQUFLQyxJOztrQkFBbkJ2RCxLIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG4gIC8vIOS6keW8gOWPkeaVsOaNruW6k+ebuOWFs1xuICB3eC5jbG91ZC5pbml0KClcbiAgY29uc3QgZGIgPSB3eC5jbG91ZC5kYXRhYmFzZSh7ZW52OiAnZWtzJ30pXG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uKCdtdXNpYycpXG5cbiAgLy8g6Z+z5LmQ55u45YWzXG4gIGNvbnN0IGF1ZGlvID0gd3guZ2V0QmFja2dyb3VuZEF1ZGlvTWFuYWdlcigpXG5cbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXggZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICflj6Plk6jkuKjnjoTlh6TpuabpuYnomY7nmq7puabpuYnniaHkuLnpuabpuYknLFxuICAgICAgdXNpbmdDb21wb25lbnRzOiB7XG4gICAgICAgICdpLXRhYnMnOiAnLi4vaXZpZXcvdGFicy9pbmRleCcsXG4gICAgICAgICdpLXRhYic6ICcuLi9pdmlldy90YWIvaW5kZXgnLFxuICAgICAgICAnaS1pY29uJzogJy4uL2l2aWV3L2ljb24vaW5kZXgnLFxuICAgICAgICAnaS1jZWxsLWdyb3VwJzogJy4uL2l2aWV3L2NlbGwtZ3JvdXAvaW5kZXgnLFxuICAgICAgICAnaS1jZWxsJzogJy4uL2l2aWV3L2NlbGwvaW5kZXgnLFxuICAgICAgICAnaS1tb2RhbCc6ICcuLi9pdmlldy9tb2RhbC9pbmRleCcsXG4gICAgICAgICdpLWlucHV0LW51bWJlcic6ICcuLi9pdmlldy9pbnB1dC1udW1iZXIvaW5kZXgnXG4gICAgICB9XG4gICAgfVxuXG4gICAgbWl4aW5zID0gW11cblxuICAgIGRhdGEgPSB7XG4gICAgICBjdXJyZW50VGFiOiAncGVvcGxlJyxcbiAgICAgIG11c2ljTGlzdDogW10sIC8vIOmfs+S5kOWIl+ihqFxuICAgICAgbXVzaWM6IHtcbiAgICAgICAgaW1nOiAnJywgLy8g5Zu+54mH5Zyw5Z2AXG4gICAgICAgIG5hbWU6ICcnLCAvLyDmrYzlkI1cbiAgICAgICAgc3JjOiAnJywgLy8g5pKt5pS+5Zyw5Z2AXG4gICAgICAgIHN0YXR1czogMCwgLy8gMSDmkq3mlL4gMCDmmoLlgZxcbiAgICAgICAgY3VycmVudFRpbWU6ICcnLCAvLyDlvZPliY3mkq3mlL7ml7bpl7RcbiAgICAgICAgZHVyYXRpb246ICcnLCAvLyDmgLvml7bplb9cbiAgICAgICAgc3RhcnQ6IDAsIC8vIOaIquWPluaXtumXtC3lvIDlp4vml7bpl7RcbiAgICAgICAgZW5kOiAwLCAvLyDmiKrlj5bml7bpl7Qt57uT5p2f5pe26Ze0XG4gICAgICAgIGF1dG9Mb29wOiBmYWxzZSAvLyDlrprliLblvqrnjq9cbiAgICAgIH0sXG4gICAgICBsb29wOiB7XG4gICAgICAgIHN0YXJ0OiAwLCAvLyDmiKrlj5bml7bpl7Qt5byA5aeL5pe26Ze0XG4gICAgICAgIGVuZDogMCAvLyDmiKrlj5bml7bpl7Qt57uT5p2f5pe26Ze0XG4gICAgICB9LFxuICAgICAgbW9kYWxWaXNpYmxlOiBmYWxzZSAvLyBtb2RhbCDlvIDlhbNcbiAgICB9XG5cbiAgICBjb21wdXRlZCA9IHtcbiAgICB9XG5cbiAgICBtZXRob2RzID0ge1xuICAgICAgaGFuZGxlQ2hhbmdlVGFicyAoeyBkZXRhaWwgfSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBkZXRhaWwua2V5XG4gICAgICAgIHRoaXMuZ2V0TXVzaWNMaXN0KHRoaXMuY3VycmVudFRhYilcbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZUNoYW5nZVBsYXlTdGF0dXMgKCkge1xuICAgICAgICB0aGlzLm11c2ljLnN0YXR1cyA9ICh0aGlzLm11c2ljLnN0YXR1cyArIDEpICUgMlxuICAgICAgICBpZiAodGhpcy5tdXNpYy5zdGF0dXMpIHsgLy8g5pKt5pS+XG4gICAgICAgICAgYXVkaW8ucGxheSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXVkaW8ucGF1c2UoKVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVQbGF5IChpdGVtKSB7XG4gICAgICAgIGlmICh0aGlzLm11c2ljLnNyYyAhPT0gaXRlbS5zcmMpIHtcbiAgICAgICAgICBpZiAodGhpcy5tdXNpYy5zcmMpIHtcbiAgICAgICAgICAgIGF1ZGlvLnN0b3AoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBhdWRpby50aXRsZSA9IGl0ZW0ubmFtZVxuICAgICAgICAgIGF1ZGlvLmNvdmVySW1nVXJsID0gaXRlbS5pbWdcbiAgICAgICAgICBhdWRpby5zcmMgPSBpdGVtLnNyY1xuICAgICAgICAgIGF1ZGlvLnRpdGxlID0gaXRlbS5uYW1lIC8vIOmYsuatouayoeiuvue9ruWIsCB0aXRsZVxuICAgICAgICAgIHRoaXMubXVzaWMubmFtZSA9IGl0ZW0ubmFtZVxuICAgICAgICAgIHRoaXMubXVzaWMuaW1nID0gaXRlbS5pbWdcbiAgICAgICAgICB0aGlzLm11c2ljLnNyYyA9IGl0ZW0uc3JjXG4gICAgICAgICAgdGhpcy5tdXNpYy5zdGF0dXMgPSAxXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZVNob3dNb2RhbCAoKSB7IC8vIOaJk+W8gCBtb2RhbFxuICAgICAgICB0aGlzLmxvb3Auc3RhcnQgPSB0aGlzLm11c2ljLnN0YXJ0XG4gICAgICAgIHRoaXMubG9vcC5lbmQgPSB0aGlzLm11c2ljLmVuZFxuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZUNoYW5nZU11c2ljU3RhcnQgKHsgZGV0YWlsIH0pIHsgLy8g6LCD5pW05byA5aeL5pe26Ze0XG4gICAgICAgIHRoaXMubG9vcC5zdGFydCA9IGRldGFpbC52YWx1ZVxuICAgICAgICBpZiAodGhpcy5sb29wLmVuZCA8IHRoaXMubG9vcC5zdGFydCkge1xuICAgICAgICAgIHRoaXMubG9vcC5lbmQgPSB0aGlzLmxvb3Auc3RhcnRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVDaGFuZ2VNdXNpY0VuZCAoeyBkZXRhaWwgfSkgeyAvLyDosIPmlbTnu5PmnZ/ml7bpl7RcbiAgICAgICAgdGhpcy5sb29wLmVuZCA9IGRldGFpbC52YWx1ZVxuICAgICAgICBpZiAodGhpcy5sb29wLmVuZCA8IHRoaXMubG9vcC5zdGFydCkge1xuICAgICAgICAgIHRoaXMubG9vcFxuICAgICAgICAgIC5zdGFydCA9IHRoaXMubG9vcC5lbmRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVNb2RhbE9rICgpIHsgLy8g6K6+572u5LqG5b6q546v5pe26Ze0XG4gICAgICAgIGlmICh0aGlzLmxvb3Auc3RhcnQgPT09IHRoaXMubG9vcC5lbmQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm11c2ljLnN0YXJ0ID0gdGhpcy5sb29wLnN0YXJ0XG4gICAgICAgIHRoaXMubXVzaWMuZW5kID0gdGhpcy5sb29wLmVuZFxuICAgICAgICB0aGlzLm11c2ljLmF1dG9Mb29wID0gdHJ1ZVxuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlXG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVNb2RhbENhbmNlbCAoKSB7XG4gICAgICAgIHRoaXMubXVzaWMuc3RhcnQgPSAwXG4gICAgICAgIHRoaXMubXVzaWMuZW5kID0gMFxuICAgICAgICB0aGlzLm11c2ljLmF1dG9Mb29wID0gZmFsc2VcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGV2ZW50cyA9IHtcbiAgICB9XG5cbiAgICBnZXRNdXNpY0xpc3QgKHR5cGUpIHtcbiAgICAgIGNvbGxlY3Rpb24ud2hlcmUoe1xuICAgICAgICB0eXBlXG4gICAgICB9KS5nZXQoe1xuICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgdGhpcy5tdXNpY0xpc3QgPSByZXMuZGF0YVxuICAgICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICB0aGlzLmdldE11c2ljTGlzdCh0aGlzLmN1cnJlbnRUYWIpXG4gICAgICBhdWRpby5vblRpbWVVcGRhdGUoKCkgPT4ge1xuICAgICAgICB0aGlzLm11c2ljLmN1cnJlbnRUaW1lID0gTWF0aC5mbG9vcihhdWRpby5jdXJyZW50VGltZSlcbiAgICAgICAgdGhpcy5tdXNpYy5kdXJhdGlvbiA9IE1hdGguZmxvb3IoYXVkaW8uZHVyYXRpb24pXG4gICAgICAgIGlmICh0aGlzLm11c2ljLmF1dG9Mb29wICYmICh0aGlzLm11c2ljLmN1cnJlbnRUaW1lID49IHRoaXMubXVzaWMuZW5kIHx8IHRoaXMubXVzaWMuY3VycmVudFRpbWUgPCB0aGlzLm11c2ljLnN0YXJ0KSkgeyAvLyDlvIDlkK/oh6rliqjlvqrnjq9cbiAgICAgICAgICB0aGlzLm11c2ljLmN1cnJlbnRUaW1lID0gdGhpcy5tdXNpYy5zdGFydFxuICAgICAgICAgIGF1ZGlvLnNlZWsodGhpcy5tdXNpYy5zdGFydClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICB9KVxuICAgICAgYXVkaW8ub25FbmRlZCgoKSA9PiB7XG4gICAgICAgIGF1ZGlvLnNyYyA9IHRoaXMubXVzaWMuc3JjXG4gICAgICAgIGF1ZGlvLnRpdGxlID0gdGhpcy5tdXNpYy5uYW1lXG4gICAgICB9KVxuICAgICAgYXVkaW8ub25TdG9wKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCFhdWRpby5zcmMpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWMuc3JjID0gJydcbiAgICAgICAgICAgIHRoaXMubXVzaWMuaW1nID0gJydcbiAgICAgICAgICAgIHRoaXMubXVzaWMubmFtZSA9ICcnXG4gICAgICAgICAgICB0aGlzLm11c2ljLmR1cmF0aW9uID0gJydcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgICB9LCAxMDAwKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiJdfQ==