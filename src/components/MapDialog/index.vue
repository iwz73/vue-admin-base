<!--
 * @Author: your name
 * @Date: 2019-11-01 10:18:26
 * @LastEditTime: 2020-04-26 14:56:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-ui\src\views\pages\Info\Staffs\index.vue
 -->
<template lang="pug">
el-dialog.dialogmap-class(
  :title='dialogTitle',
  :visible.sync='dialogMapVisible'
  width='90%'
  :append-to-body="true"
  top="5vh"
  :close-on-click-modal='false'
  @open="openMap"
  @close="closeDialog")
  #container()
  .map-query(v-if="hasQuery")
    el-input.input-search#input-search(placeholder='请输入关键字' v-model='mapSearch' size="small" clearable @clear="searchMap(mapSearch)" @input="onInput")
      el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="searchMap(mapSearch)")
    //- input#input-search(type="text")
    #panel
  .input-card(v-if="showLnglat")
    p 左击获取经纬度：
    .input-item
      el-input#lnglat(size="small")
  //- input#tipinput

</template>
<script >
import { mapGetters } from 'vuex'
import LongDatePicker from '@/components/LongDatePicker'
import 'viewerjs/dist/viewer.css'
import AMap from 'AMap'
export default {
  name: 'Index',
  components: {
    LongDatePicker
  },
  filters: {
    filterImg: (val) => {
      if (val) {
        if (val.includes('http')) {
          return val
        } else {
          return process.env.VUE_APP_BASE_API + val
        }
      } else {
        return val
      }
    }
  },
  props: {
    dialogTitle: {
      type: String,
      default: '地图'
    },
    dialogMapVisible: {
      type: Boolean,
      default: false
    },
    hasQuery: {
      type: Boolean,
      default: false
    },
    showLnglat: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: String,
      default: ''
    },
    latitude: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 地图
      mapSearch: '',
      map: '', // 地图实例
      searchCity: '',
      marker: []
    }
  },
  computed: {
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    },
    ...mapGetters(['sysInfo', 'userInfo'])
  },
  watch: {
    dialogMapVisible(news, olds) {
      if (news) {
        this.initMap()
      }
    }
  },
  created() {
  },
  mounted() {
    // this.initMap()
  },
  methods: {
    /** *** 基本设置 start ******/

    /** *** 按钮点击 start ******/
    closeDialog() {
      this.map = null
      this.$emit('closeDialog')
    },
    openMap() {
      this.$emit('openMap')
    },
    initMap() {
      this.$nextTick(() => {
        let option
        if (this.longitude && this.latitude) {
          option = {
            center: [parseFloat(this.longitude), parseFloat(this.latitude)],
            // center: [116.397428, 39.90923],
            resizeEnable: true,
            zoom: 10,
            rotateEnable: true,
            expandZoomRange: true,
            pitchEnable: true,
            pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 开启3D视图,默认为关闭
            buildingAnimation: true // 楼块出现是否带动画
          }
        } else {
          option = {
            resizeEnable: true,
            zoom: 10,
            rotateEnable: true,
            expandZoomRange: true,
            pitchEnable: true,
            pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 开启3D视图,默认为关闭
            buildingAnimation: true // 楼块出现是否带动画
          }
        }
        this.map = new AMap.Map('container', option)
        const that = this
        var geocoder = ''
        console.log(this.map)
        // 加载插件 比例尺\工具条
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.ControlBar', 'AMap.PlaceSearch', 'AMap.CitySearch', 'AMap.Geocoder'], function() { // 异步同时加载多个插件
          var toolbar = new AMap.ToolBar()
          that.map.addControl(toolbar)
          var Scale = new AMap.Scale()// 驾车路线规划
          that.map.addControl(Scale)
          // that.map.addControl(new AMap.Geolocation())
          // map.addControl(new AMap.ControlBar({
          //   showZoomBar: false,
          //   showControlButton: true,
          //   position: {
          //     right: '10px',
          //     top: '10px'
          //   }
          // 打开定位当前电脑所在位置
          // toolbar.doLocation()

          // 获取当前城市
          var citysearch = new AMap.CitySearch()
          // 自动获取用户IP，返回当前城市
          citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.city && result.bounds) {
                var cityinfo = result.city
                // var citybounds = result.bounds
                // document.getElementById('info').innerHTML = '您当前所在城市：' + cityinfo
                that.searchCity = cityinfo
                // 地图显示当前城市
                // that.map.setBounds(citybounds)
              }
            } else {
              // document.getElementById('info').innerHTML = result.info
            }
          })
          geocoder = new AMap.Geocoder()
        })

        let marker = ''
        // 点击坐标
        this.map.on('click', function(e) {
          document.getElementById('lnglat').value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
          var lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
          // that.$set(that.longitude, e.lnglat.getLng())
          // that.$set(that.latitude, e.lnglat.getLat())
          this.$emit('onGetlnglat', e.lnglat.getLng(), e.lnglat.getLat())
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.regeocode) {
              // var address = result.regeocode.formattedAddress
              // document.getElementById('address').value = address
              that.searchCity = result.regeocode.addressComponent.city || '028'
            } else {
              // log.error('根据经纬度查询地址失败')
            }
          })
        })
        // 点击显示图标
        AMap.event.addListener(that.map, 'click', function(e) {
          that.map.remove(marker)
          marker = new AMap.Marker({
            position: e.lnglat,
            map: that.map
          })
        })
        if (this.showLnglat) {
          // 点击坐标
          this.map.on('click', function(e) {
            document.getElementById('lnglat').value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            var lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            // that.$set(that.longitude, e.lnglat.getLng())
            // that.$set(that.latitude, e.lnglat.getLat())
            this.$emit('onGetlnglat', e.lnglat.getLng(), e.lnglat.getLat())
            geocoder.getAddress(lnglat, function(status, result) {
              if (status === 'complete' && result.regeocode) {
                // var address = result.regeocode.formattedAddress
                // document.getElementById('address').value = address
                that.searchCity = result.regeocode.addressComponent.city || '028'
              } else {
                // log.error('根据经纬度查询地址失败')
              }
            })
          })
          // 点击显示图标
          AMap.event.addListener(that.map, 'click', function(e) {
            that.map.remove(marker)
            marker = new AMap.Marker({
              position: e.lnglat,
              map: that.map
            })
          })
        }
        // 如果有地址 标记当前地址
        if (this.longitude && this.latitude) {
          console.log(this.longitude, this.latitude)
          marker = new AMap.Marker({
            position: new AMap.LngLat(parseFloat(this.longitude), parseFloat(this.latitude)),
            map: that.map
          })
        }
        console.log(this.marker)
        this.marker.push(marker)
        // var auto = new AMap.Autocomplete({
        //   input: 'tipinput'
        // })
        // AMap.event.addListener(auto, 'select', select)// 注册监听，当选中某条记录时会触发
        // function select(e) {
        //   if (e.poi && e.poi.location) {
        //     map.setZoom(15)
        //     map.setCenter(e.poi.location)
        //   }
        // }
      })
    },
    onInput(e) {
      // 情空所有标记
      var that = this
      // that.map.remove(that.marker[0])
      that.map.clearMap()
      this.that.marker[0] ? that.map.add(that.marker[0]) : ''
      const map = that.map
      AMap.service(['AMap.PlaceSearch'], function() {
        // 构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 4, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: that.searchCity, // 兴趣点城市
          citylimit: true, // 是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          panel: 'panel', // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
        // 关键字查询
        placeSearch.search(that.mapSearch)
      })
    },
    searchMap(serch) {
      this.onInput(this.mapSearch)
    }
    /** *** 接口调用 start ******/

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/

/** *** 基本设置 end ******/
.dialogmap-class{
  /deep/ .el-dialog{
    .el-dialog__body{
      padding: 0 10px 10px 10px;
      height: calc(100vh - 150px);
      overflow-y: auto;
      position: relative;
      .el-form{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          width: 100%;
          // margin-bottom: 0;
          .el-form-item__content{
            line-height: 32px;
          }
        }
      }
      .el-input{
        width: 220px
      }
      .el-select{
        width: 100%
      }
      .el-cascader{
        width: 100%

      }
    }
  }
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  // overflow-y: auto;
  top: 35px;
  left: 0px;
  width: 280px;
}
.input-item {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  /deep/ input{
    width: 200px
  }
}
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: .25rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  position: absolute;
  padding: 0.75rem 1.25rem;
  bottom: 40px;
  left: 20px;
}
#container{
  height: 100%;
  width: 100%
}
.map-query{
  position: absolute;
  top: 20px;
  right: 80px;
}
</style>
