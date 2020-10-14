<template>
  <div class="page hIntroduction">
    <div class="transit"></div>
    <div class="container">
      <!-- 医院相片 -->
      <div class="hosipatilImg" @click="lookHospitalImg">
        <img :src="hospitalDetail.hospital_img" alt="" mode="aspectFill" />
      </div>
      <!-- 医院信息盒子 -->
      <div class="hosipatilBox">
        <h2>{{ hospitalDetail.hospital_name }}</h2>
        <div class="starScore">
          <van-rate
            :value="hospitalDetail.hospital_score"
            size="12"
            allow-half
            color="#F46950"
            void-color="#EEF1F4"
            void-icon="star"
            readonly
          />
          <p>{{ hospitalDetail.hospital_score }}分</p>
        </div>
        <div class="tages">
          <span
            class="appointment"
            v-for="(item, index) in hospitalDetail.hospital_keywords"
            :key="index"
            :style="{
              backgroundColor: 'rgba(' + item.color + ',0.1)',
              color: 'rgb(' + item.color + ')'
            }"
            >{{ item.name }}</span
          >
        </div>
        <p class="hGrade">{{ hospitalDetail.hospital_description }}</p>
        <div
          class="isFollow"
          v-show="hospitalDetail.interest == 1"
          @click="follow(1)"
        >
          已关注
        </div>
        <div
          class="isFollow"
          v-show="hospitalDetail.interest == 0"
          style="background: #ff5a88; color: #ffffff"
          @click="follow(0)"
        >
          加关注
        </div>
      </div>
      <!-- tags栏 -->
      <div class="tags" v-if="isService == 1">
        <ul>
          <li
            v-for="(item, index) in tagsArr"
            :key="index"
            @click="activeTags = index"
            :class="{ active: activeTags === index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <!-- tag栏没有特色的情况 -->
      <div class="tags" v-else-if="isService == 0">
        <ul>
          <li
            v-for="(item, index) in newTags"
            :key="index"
            @click="activeTags = index"
            :class="{ active: activeTags === index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <!-- 切换内容 -->
      <div class="tagsContent" v-if="isService == 1">
        <!-- 0:医院特色 -->
        <div class="hospitalPackage" v-show="activeTags == 0">
          <ul>
            <li
              v-for="(item, index) in hospitalDetail.hospital_service"
              :key="index"
              @click="goPackageDetails(item.service_type_id)"
            >
              <div class="package">
                <p>{{ item.service_name }}</p>
                <span>¥{{ item.service_price }}</span>
              </div>
              <div class="packageInfo">{{ item.service_description }}</div>
            </li>
          </ul>
        </div>
        <!-- 1:医院介绍 -->
        <div class="hospitalInfo" v-show="activeTags == 1">
          <p v-html="hospitalDetail.hospital_content"></p>
        </div>
        <!-- 2:联系我门 -->
        <div v-show="activeTags == 2">
          <a class="callMe" @click="callMe()" :href="meNumber">
            <img src="@/assets/images/hIntroduction/ic_tel.png" alt="" />
            <p>{{ hospitalDetail.hospital_tel }}</p>
          </a>
          <div class="myMap">
            <div id="map" class="map"></div>
            <p class="dizhi">{{ hospitalDetail.hospital_address }}</p>
            <!-- 导航 -->
            <div class="navigation">
              <img src="@/assets/images/hIntroduction/ic_locate.png" alt="" />
              <p @click="comehere">到这去</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 切换内容没有套餐的情况 -->
      <div class="tagsContent" v-else-if="isService == 0">
        <!-- 0:医院介绍 -->
        <div class="hospitalInfo" v-show="activeTags == 0">
          <p v-html="hospitalDetail.hospital_content"></p>
        </div>
        <!-- 1:联系我门 -->
        <div v-show="activeTags == 1">
          <a class="callMe" @click="callMe()" :href="meNumber">
            <img src="@/assets/images/hIntroduction/ic_tel.png" alt="" />
            <p>{{ hospitalDetail.hospital_tel }}</p>
          </a>
          <div class="myMap">
            <div id="map" class="map"></div>
            <p class="dizhi">{{ hospitalDetail.hospital_address }}</p>
            <!-- 导航 -->
            <div class="navigation">
              <img src="@/assets/images/hIntroduction/ic_locate.png" alt="" />
              <p @click="comehere">到这去</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 客服 -->
      <div class="advisory">
        <a
          class="myBtn"
          href="https://yzf.qq.com/xv/web/static/chat/index.html?sign=37ef9b97867356ce24179cec1bb4b830058e47e33e47b6705fcdf047e43611cc6090de56ab3c08e734a5588ca5cadc415387068e"
        >
          <img src="@/assets/images/home/ic_home_advisory.png" alt="" />
        </a>
      </div>
      <!-- 结束 -->
    </div>
  </div>
</template>
<script>
import { Rate } from "vant";
export default {
  name: "hIntroduction",
  components: {
    [Rate.name]: Rate
  },
  data() {
    return {
      //数据
      hospitalDetail: {},
      // tags
      activeTags: 0,
      tagsArr: [],
      newTags: [],
      // 记录是否有医院特色
      isService: 1,
      //记录是否需要token
      isToken: "",
      // 解决异步请求
      map1: 0,
      map2: 0,
      //电话
      meNumber: "",
      //
      hospital_id: ""
    };
  },
  created() {
    this.$store.commit("changeFbTitle", { name: "医院详情", tState: "0" });
    this.$store.commit("changeFbFoot", 0);
    this.hospital_id = this.$route.params.hospital_id;
    this.$wxInit();
    //初始化数据
    this.tagsArr = [];
    this.newTags = [];
    this.activeTags = 0;
    this.map1 = 0;
    this.map2 = 0;
    this.isService = 1;
    this.getHospitalDetail(this.hospital_id);
  },
  methods: {
    //获取医院详情
    getHospitalDetail(hospital_id) {
      this.$request
        .getHospitalDetail({
          hospital_id
        })
        .then(data => {
          this.hospitalDetail = data.data;
          console.log(this.hospitalDetail);
          // 处理返回的图片和文字
          let html = "";
          html = data.data.hospital_content.replace(
            /<img/g,
            '<img style="width:100%"  '
          );
          html = html.replace(
            /<p/g,
            '<p style="font-family: PingFangSC-Regular, PingFang SC"'
          );
          this.hospitalDetail.hospital_content = html;
          if (data.data.hospital_service.length == 0) {
            // 没有特色的情况
            this.isService = 0;
            this.newTags = ["医院介绍", "联系我们"];
          } else {
            this.tagsArr = ["医院套餐", "医院介绍", "联系我们"];
            this.map1 = 1;
          }
        });
    },
    //前往套餐详情
    goPackageDetails(service_type_id) {
      this.$router.replace({
        path: "/packageDetails",
        name: "packageDetails",
        params: {
          service_type_id: service_type_id,
          hospital_id: this.hospital_id
        }
      });
    },
    // 腾讯地图
    setMap(e) {
      //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      //设置地图中心点
      console.log();
      console.log(123);
      var myLatlng = new qq.maps.LatLng(
        this.hospitalDetail.latitude,
        this.hospitalDetail.longitude
      );
      //定义工厂模式函数
      var myOptions = {
        zoom: 100, //设置地图缩放级别
        center: myLatlng, //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP, //设置地图样式详情参见MapType
        zoomControl: false,
        mapTypeControl: false
      };
      //获取dom元素添加地图信息
      var map = new qq.maps.Map(document.getElementById("map"), myOptions);

      //给定位的位置添加图片标注
      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: map
      });
    },
    //电话
    callMe() {
      this.meNumber = "tel://" + this.hospitalDetail.hospital_tel;
    },
    //到这去
    comehere() {
      let latitude = this.hospitalDetail.latitude;
      let longitude = this.hospitalDetail.longitude;
      let name = this.hospitalDetail_hospital_name;
      let address = this.hospitalDetail.hospital_address;
      wx.ready(data => {
        wx.openLocation({
          latitude,
          longitude,
          scale: 28,
          name,
          address
        });
      });
    },
    // 预览图片
    lookHospitalImg() {
      wx.previewImage({
        current: this.hospitalDetail.hospital_img,
        urls: [this.hospitalDetail.hospital_img]
      });
    },
    //关注
    follow(e) {
      let url = "";
      if (e == 0) {
        // 加关注
        url = "interest";
      } else if (e == 1) {
        //取消关注
        url = "cancelInterest";
      }

      this.$request[url]({
        hospital_id: this.hospitalDetail.hospital_id
      }).then(data => {
        if (data.msg == "关注成功") {
          this.$toast.success({
            message: "关注成功",
            onClose: res => {
              this.hospitalDetail.interest = 1;
            }
          });
        } else if (data.msg == "取消成功") {
          this.$toast.fail({
            message: "已取消关注",
            onClose: res => {
              this.hospitalDetail.interest = 0;
            }
          });
        }
      });
    }
  },

  updated() {
    this.setMap();
  }
};
</script>
<style lang="less">
.hIntroduction {
  display: flex;
  flex-direction: column;
  margin-top: 86px;
  .transit {
    position: fixed;
    width: 100%;
    height: 200px;
    background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
    z-index: -1;
  }
  .container {
    justify-content: start;
    padding: 0 30px 100px 30px;
    background: #f7f9fb;
    height: auto;

    .hosipatilImg {
      width: 690px;
      height: 388px;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
      border-radius: 16px;
      margin: 20px 0;
      img {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 16px;
      }
    }
    .hosipatilBox {
      width: 690px;
      position: relative;
      h2 {
        font-size: 32px;
        font-weight: 500;
        color: #252a34;
        line-height: 44px;
      }
      .starScore {
        margin: 10px 0;
        display: flex;
        align-items: center;
        p {
          margin-left: 16px;
          height: 34px;
          font-size: 24px;
          font-weight: 500;
          color: #f46950;
        }
      }
      .tages {
        display: flex;
        align-items: center;
        span {
          display: block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 24px;
          margin-right: 20px;
          font-weight: 500;
          line-height: 34px;
        }
      }
      .hGrade {
        font-size: 24px;
        font-weight: 300;
        margin-top: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        color: #252a34;
        line-height: 34px;
      }
      .isFollow {
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 8px;
        border: 2px solid rgba(255, 90, 136, 0.5);
        padding: 4px 10px;
        position: absolute;
        right: 0;
        top: 56px;
        font-size: 24px;
        font-weight: 500;
        color: #ff5a88;
        line-height: 34px;
      }
    }
    .tags {
      margin-top: 48px;
      margin-bottom: 24px;

      ul {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 690px;
        li {
          margin-right: 60px;
          font-size: 28px;
          font-weight: 500;
          color: #bac5d2;
          line-height: 40px;
          &.active {
            font-size: 40px;
            font-weight: 500;
            color: #2a90ff;
            line-height: 56px;
          }
        }
      }
    }
    .tagsContent {
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      width: 690px;
      // 0
      .hospitalPackage {
        width: 100%;
        ul {
          width: 690px;
          margin-bottom: 480px;
          li {
            padding: 30px;
            background: #ffffff;
            box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
            border-radius: 16px;
            margin-bottom: 20px;
            .package {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
              p {
                font-size: 36px;
                font-weight: 500;
                color: #252a34;
                line-height: 50px;
              }
              span {
                font-size: 32px;
                font-weight: 500;
                color: #ff4040;
                line-height: 44px;
              }
            }
            .packageInfo {
              font-size: 24px;
              font-weight: 400;
              color: #bac5d2;
              line-height: 34px;
            }
          }
        }
      }
      // 1
      .hospitalInfo {
        background-color: #ffffff;
        padding: 30px;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        margin-bottom: 60px;
        p {
          font-size: 28px;
          color: #464e5e;
          line-height: 56px !important;
        }
        img {
          margin-top: 20px;
          display: block;
          width: 630px;
          height: 358px;
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
          border-radius: 16px;
        }
      }
      //2
      .callMe {
        height: 100px;
        width: 690px;
        background: #ffffff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 40px;
          height: 40px;
          display: block;
          margin: 0 30px;
        }
        p {
          font-size: 32px;
          font-weight: 500;
          color: #2a90ff;
          line-height: 44px;
        }
      }
      .myMap {
        padding: 30px;
        background: #ffffff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        margin-bottom: 280px;
        .map {
          width: 100%;
          height: 240px;
        }
        .dizhi {
          font-size: 28px;
          font-weight: 400;
          color: #464e5e;
          line-height: 56px;
          margin: 20px 0 30px;
        }
        .navigation {
          background: #2a90ff;
          box-shadow: 0px 0px 16px 0px rgba(42, 144, 255, 0.3);
          border-radius: 30px;
          display: flex;
          align-items: center;
          width: 200px;
          height: 60px;
          margin: 0 auto;
          img {
            width: 32px;
            height: 32px;
            display: block;
            margin: 0 12px 0 34px;
          }
          p {
            font-size: 28px;
            font-weight: 500;
            color: #ffffff;
            line-height: 40px;
          }
        }
      }
    }
    .advisory {
      position: fixed;
      width: 176px;
      height: 184px;
      bottom: 123px;
      right: 30px;
      .myBtn {
        padding: 0;
        margin: 0;
        background-color: transparent;
        overflow: visible;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &::after {
          border: 0;
        }
        img {
          width: 108px;
          height: 108px;
        }
      }
    }
  }
}
</style>
