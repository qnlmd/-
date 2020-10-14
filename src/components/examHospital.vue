<template>
  <div class="exam">
    <div class="container">
      <div class="c-title">
        <div class="c-location">
          <img src="@/assets/images/examHospital/ic_choose_city.png" alt="" />
          <p>
            {{ cityName }}
          </p>
        </div>
        <div @click="showPopup" class="selection">
          <p>选择地址</p>
          <img
            src="@/assets/images/examHospital/ic_hospital_list_fold.png"
            alt=""
          />
        </div>
      </div>
      <mescroll-vue
        ref="mescroll"
        :up="mescrollUp"
        @init="mescrollInit"
        class="scrollView c-content"
      >
        <div class="c-content">
          <ul>
            <li v-for="(item, index) in examData" :key="index">
              <!-- 左侧 -->
              <div class="li-left">
                <img :src="item.hospital_img" alt="" />
              </div>
              <!-- 中间 -->
              <div class="li-center">
                <h2>{{ item.hospital_name }}</h2>
                <div class="tags">
                  <span
                    v-for="(it, j) in item.hospital_keywords"
                    :key="j"
                    :style="{
                      backgroundColor: 'rgba(' + it.color + ',0.1)',
                      color: 'rgb(' + it.color + ')'
                    }"
                    >{{ it.name }}</span
                  >
                </div>
                <p>{{ item.hospital_address }}</p>
              </div>
              <!-- 右侧 -->
              <div class="li-right">
                <p>{{ item.distance }}km</p>
              </div>
              <!-- 线 -->
              <div class="line"></div>
            </li>
          </ul>
        </div>
      </mescroll-vue>
      <!-- 弹窗 和 弹窗内容 -->
      <van-popup
        v-model="isShow"
        bind:close="onClose"
        position="bottom"
        custom-style="height: 30%;"
        @close="onClose"
      >
        <van-area
          :area-list="areaList"
          :value="cityValue"
          columns-num="2"
          @confirm="confirm"
          @cancel="cancel"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import area from "@/libs/area";
import MescrollVue from "mescroll.js/mescroll.vue";
import { Popup } from "vant";
import { Area } from "vant";
export default {
  name: "examHospital",
  components: {
    MescrollVue,
    [Popup.name]: Popup,
    [Area.name]: Area
  },
  data() {
    return {
      // 省市级数据
      areaList: {},
      // 弹出框是否显示1是不限时
      isShow: false,
      //用户定位信息
      latitude: "",
      longitude: "",
      province: "",
      city: "",
      newData: {},
      //市区名字
      cityName: "",
      //获取体检医院数据
      examData: [],
      //address
      address: [],
      page: 1,
      // 加载的数据
      loadData: {
        page: 1
      },
      //记录是定位还是选择位置
      positionState: "",
      //
      cityValue: "110101",
      mescroll: null,
      mescrollUp: {
        callback: this.upCallback,
        htmlNodata: '<p class="upwarp-nodata">-- 我是有底线的公众号 --</p>',
        toTop: {
          //回到顶部按钮
          src: "https://mykjminiapp.ivfhome.com/static/images/top.png",
          offset: 300
        }
      }
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "体检医院", tState: "1" });
    this.$store.commit("changeFbFoot", 0);
    // 省市区数据
    this.areaList = area;
    this.latitude = window.sessionStorage.getItem("latitude");
    this.longitude = window.sessionStorage.getItem("longitude");
  },
  methods: {
    //上啦加载
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.$request
        .getExamHospital({
          page: page.num,
          pageSize: 10,
          latitude: this.latitude,
          longitude: this.longitude
        })
        .then(res => {
          this.cityName = res.data.address[1].name;
          // 请求的列表数据
          let arr = res.data.hospital.data;
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.examData = [];
          // 把请求到的数据添加到列表
          this.examData = this.examData.concat(arr);
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
            if (arr.length == 0) {
              this.$toast("亲，请休息下暂无更多内容啦");
            }
          });
        })
        .catch(e => {
          mescroll.endErr();
        });
    },
    // 弹窗
    showPopup() {
      this.isShow = true;
    },
    // 关闭弹窗
    onClose() {
      this.isShow = false;
    },
    // 省市联动数据
    confirm(e) {
      this.cityValue = e[1].code;
      this.cityName = e[1].name;
      this.$request
        .getExamHospital({
          province: e[0].code,
          city: e[1].code,
          latitude: this.latitude,
          longitude: this.longitude
        })
        .then(data => {
          this.examData = data.data.hospital.data;
        });
      this.isShow = false;
    },
    //关闭省市联动
    cancel(e) {
      this.isShow = false;
    }
  }
};
</script>
<style lang="less">
.exam {
  margin-top: 86px;
  height: 100%;
  .container {
    padding: 0 30px;
    display: block;
    width: 690px;
    height: 100%;
    .c-title {
      display: flex;
      flex-direction: row;
      width: 690px;
      justify-content: flex-end;
      margin: 0 0 60px 0;
      position: fixed;
      top: 106px;
      div {
        display: flex;
        align-items: center;
        background: #f7f9fb;
        border-radius: 30px;
        height: 40px;
        p {
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #252a34;
          line-height: 40px;
        }
      }
      .c-location {
        padding: 10px 52px;
        img {
          width: 22px;
          height: 28px;
          display: block;
          margin-right: 10px;
        }
      }
      .selection {
        margin-left: 56px;
        padding: 10px 30px;
        img {
          width: 10px;
          height: 10px;
          display: block;
          transform: rotate(180deg);
          margin-left: 12px;
        }
      }
    }
    .c-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      ul {
        li {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding-bottom: 30px;
          margin-bottom: 30px;
          .li-left {
            margin-right: 20px;
            img {
              width: 80px;
              height: 80px;
              background: #2a90ff;
              border-radius: 60px;
              display: block;
            }
          }
          .li-center {
            width: 450px;
            padding-right: 50px;
            h2 {
              font-size: 32px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #252a34;
              line-height: 44px;
              margin-bottom: 16px;
            }
            .tags {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              span {
                display: block;
                height: 34px;
                background: rgba(8, 217, 214, 0.1);
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 24px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #17c9c6;
                line-height: 34px;
                margin-right: 20px;
              }
            }
            p {
              font-size: 24px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #bac5d2;
              line-height: 34px;
            }
          }
          .li-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            p {
              font-size: 24px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #bac5d2;
              line-height: 34px;
            }
          }
          .line {
            position: absolute;
            width: 590px;
            height: 2px;
            background: #f7f9fb;
            bottom: 0;
            left: 100px;
          }
        }
      }
    }
    // vant样式
    .scrollView {
      top: 226px;
    }
    .van-picker__cancel {
      font-size: 14px;
    }
    .van-picker__confirm {
      font-size: 14px;
    }
    .van-ellipsis {
      font-size: 28px;
    }
  }
}
</style>
