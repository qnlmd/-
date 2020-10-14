<template>
  <mescroll-vue
    ref="mescroll"
    :up="mescrollUp"
    @init="mescrollInit"
    class="scrollView home"
  >
    <div class="page">
      <!-- 渐变 -->
      <div class="transit">
        <!-- 轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in homeData.ad" :key="index">
            <img alt="" v-lazy="item.ad_img" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="container">
        <!-- 导航栏 -->
        <div class="navBox">
          <ul>
            <li v-for="(item, index) in homeData.category_menu" :key="index">
              <a href="javascript:void(0)" @click="goNav(index)">
                <img :src="item.category_icon" alt />
                <h1>{{ item.category_name }}</h1>
              </a>
            </li>
          </ul>
        </div>
        <!-- 附近医院 -->
        <div class="recommend">
          <div class="ty-title">
            <div class="rHospital">
              <span></span>
              <h1>附近医院</h1>
            </div>
            <div class="more">
              <a href="javascript:void(0)" @click="more(0)">
                更多
                <img src="@/assets/images/home/ic_more@2x.png" alt />
              </a>
            </div>
          </div>
          <div class="recommendBox">
            <ul>
              <li
                v-for="(item, index) in homeData.recommend_hospital"
                :key="index"
                class="recommendBox-li"
                @click="goHospitalInfo(item.hospital_id)"
              >
                <div class="recommendBox-left">
                  <img alt="" v-lazy="item.hospital_img" />
                </div>
                <div class="recommendBox-right">
                  <h2>{{ item.hospital_name }}</h2>
                  <div class="starScore">
                    <van-rate
                      :value="item.hospital_score"
                      size="12"
                      allow-half
                      color="#F46950"
                      void-color="#EEF1F4"
                      void-icon="star"
                      readonly
                    />
                    <p>{{ item.hospital_score }}分</p>
                  </div>
                  <div class="tages">
                    <span
                      v-for="(it, j) in item.hospital_keywords"
                      :key="j"
                      :style="{
                        backgroundColor: 'rgba(' + it.color + ',0.1)',
                        color: 'rgb(' + it.color + ')'
                      }"
                    >
                      {{ it.name }}
                    </span>
                  </div>
                  <p class="hGrade">{{ item.hospital_description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 热门医院 -->
        <div class="hotHospital">
          <div class="ty-title">
            <div class="rHospital">
              <span></span>
              <h1>热门医院</h1>
            </div>
            <div class="more">
              <a href="javascript:void(0)" @click="more(1)">
                更多
                <img src="@/assets/images/home/ic_more@2x.png" alt />
              </a>
            </div>
          </div>
          <div class="hotHospitalBox">
            <ul>
              <li
                class="hotHospitalBox-li"
                v-for="(item, index) in homeData.hot_hospital"
                :key="index"
                @click="goHospitalInfo(item.hospital_id)"
              >
                <img class="hotImg" alt="" v-lazy="item.hospital_img" />
                <div class="hotBox">
                  <h2>{{ item.hospital_name }}</h2>
                  <div class="starScore">
                    <van-rate
                      :value="item.hospital_score"
                      size="12"
                      allow-half
                      color="#F46950"
                      void-color="#EEF1F4"
                      void-icon="star"
                      readonly
                    />
                    <p>{{ item.hospital_score }}分</p>
                  </div>
                  <div class="tages">
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
                  <p class="hGrade">{{ item.hospital_description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 名医头条 -->
        <div class="goodDoctor">
          <div class="ty-title">
            <div class="rHospital">
              <span></span>
              <h1>名医头条</h1>
            </div>
            <div class="more">
              <a href="javascript:void(0)" @click="more(2)">
                更多
                <img src="@/assets/images/home/ic_more@2x.png" alt />
              </a>
            </div>
          </div>
          <!-- 瀑布流 -->
          <div class="waterfall">
            <ul class="waterfall-left">
              <li
                v-for="(item, index) in leftWaterfall"
                :key="index"
                @click="goArticle(item.article_id)"
              >
                <img alt="" v-lazy="item.article_img" />
                <div class="waterfallBox">
                  <h2>{{ item.article_title }}</h2>
                  <span class="wHosipital">{{ item.article_description }}</span>
                  <div class="successStories">
                    <span
                      class="w-success"
                      v-show="item.article_keywords.length != 0"
                      >{{ item.article_keywords[0].name }}</span
                    >
                    <div>
                      <span class="year">{{ item.create_time }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="waterfall-right">
              <li
                v-for="(item, index) in rightWaterfall"
                :key="index"
                @click="goArticle(item.article_id)"
              >
                <img alt="" v-lazy="item.article_img" />
                <div class="waterfallBox">
                  <h2>{{ item.article_title }}</h2>
                  <span class="wHosipital">{{ item.article_description }}</span>
                  <div class="successStories">
                    <span
                      class="w-success"
                      v-show="item.article_keywords.length != 0"
                      >{{ item.article_keywords[0].name }}
                    </span>
                    <div>
                      <span class="year">{{ item.create_time }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 结束 -->
      </div>
    </div>
  </mescroll-vue>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { formatDate } from "../libs/date";
import { Swipe, SwipeItem } from "vant";
import { Rate } from "vant";
import { location } from "../libs/locationUtil";
export default {
  name: "home",
  components: {
    MescrollVue,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Rate.name]: Rate
  },
  data() {
    return {
      // 首页数据
      homeData: {},
      //地理定位
      latitude: "",
      longitude: "",
      //分页
      page: 1,
      pageSize: 10,
      //文章列表数据
      listData: [],
      //瀑布流
      leftWaterfall: [],
      rightWaterfall: [],
      //上拉加载的配置
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
    this.$store.commit("changeFbTitle", { name: "星孕纷宝", tState: "1" });
    this.$store.commit("changeFbFoot", 0);
    // 获取用户jskd
    this.$wxInit();
    this.page = 1;
    // 获取定位
    wx.ready(data => {
      wx.getLocation({
        type: "wgs84",
        success: res => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          window.sessionStorage.setItem('latitude',res.latitude)
          window.sessionStorage.setItem('longitude',res.longitude)
          this.getIndexData();
        }
      });
    });
  },
  //回到顶部
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave();
    next();
  },
  methods: {
    //获取首页数据
    getIndexData() {
      this.$request
        .getIndexData({
          latitude: this.latitude,
          longitude: this.longitude
        })
        .then(data => {
          this.homeData = data.data;
          console.log(this.homeData);
        });
    },
    //上啦加载
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.$request
        .getArticleList({
          page: page.num,
          pageSize: this.pageSize,
          categoty_id: 1
        })
        .then(data => {
          let arr = data.data.data;
          // 处理时间戳问题
          arr.forEach(v => {
            let newTime = formatDate(
              new Date(v.create_time * 1000),
              "yyyy.MM.dd"
            );
            v.create_time = newTime;
          });
          let newLeftWaterfall = [];
          let newReftWaterfall = [];
          for (let index = 0; index < arr.length; index++) {
            if (index % 2 == 0) {
              newLeftWaterfall.push(arr[index]);
            } else {
              newReftWaterfall.push(arr[index]);
            }
          }
          // 手动清楚第一页的数据
          if (page.num === 1) {
            this.leftWaterfall = [];
            this.rightWaterfall = [];
          }
          this.leftWaterfall = this.leftWaterfall.concat(newLeftWaterfall);
          this.rightWaterfall = this.rightWaterfall.concat(newReftWaterfall);
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
    //预览轮播图图片
    lookSwiperImg(e) {
      const urls = [];
      urls.push(this.homeData.ad[e].ad_img);
      wx.previewImage({
        urls
      });
    },
    // 导航栏
    goNav(e) {
      let url = "";
      switch (e) {
        case 0:
          url = "/moreList?is_hot=" + 1;
          break;
        case 1:
          url = "/articleList";
          break;
        case 2:
          url = "/article?category_id=" + 3;
          break;
        case 3:
          url = "/aboutMe";
          break;
      }
      this.$router.replace({ path: url });
    },

    // 前往医院详情
    goHospitalInfo(e) {
      this.$store.commit("changeUrl", "/hIntroduction");
      this.$router.replace({
        path: "/hIntroduction",
        name: "hIntroduction",
        params: {
          hospital_id: e
        }
      });
    },
    // 点击更多
    more(e) {
      let url = "";
      if (e == 0) {
        if (!this.latitude || !this.longitude) {
          // 没有定位的时候
          url = "/moreList";
          this.$router.replace({ path: url });
          return;
        }
        url =
          "/moreList?latitude=" +
          this.latitude +
          "&longitude=" +
          this.longitude;
      } else if (e == 1) {
        url = "/moreList?is_hot=" + e;
      } else if (e == 2) {
        url = "/articleList";
      }
      this.$router.replace({ path: url });
    },
    // 名医头条去文章页
    goArticle(e) {
      this.$router.replace({
        path: "/article",
        name: "article",
        params: {
          article_id: e
        }
      });
    }
  }
};
</script>
<style lang="less">
// 通用title
.ty-title {
  margin-top: 70px;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  height: 40px;
  margin-bottom: 30px;
  .rHospital {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    span {
      width: 8px;
      height: 36px;
      background-color: #08d9d6;
      border-radius: 4px;
      opacity: 0.3;
      display: inline-block;
      margin-right: 10px;
    }
    h1 {
      width: 160px;
      height: 56px;
      font-size: 40px;
      font-weight: 500;
      color: #2a90ff;
      line-height: 56px;
      display: inline-block;
    }
  }
  .more {
    position: absolute;
    right: 0;

    a {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: 400;
      color: #bac5d2;
      line-height: 40px;
      img {
        vertical-align: middle;
        margin-left: 4px;
        width: 16px;
        height: 22px;
      }
    }
  }
}
.home {
  .page {
    display: flex;
    flex-direction: column;
    .transit {
      position: relative;
      width: 750px;
      height: 200px;
      background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
      .my-swipe {
        width: 690px;
        height: 232px;
        // background: #ffffff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        margin: 30px 30px 0 30px;
        .van-swipe__track {
          display: flex;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .container {
      padding: 0 30px 30px 30px;
      font-family: PingFangSC-Medium, PingFang SC;
      background-color: #f7f9fb;
      overflow: hidden;
      .navBox {
        margin-top: 87px;
        background: #ffffff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        width: 630px;
        padding: 40px 30px;
        display: flex;
        align-items: center;
        ul {
          li {
            float: left;
            margin-right: 60px;
            &:last-child {
              margin-right: 0;
            }
            img {
              width: 98px;
              height: 98px;
              display: flex;
              margin: 0 auto;
              margin-bottom: 20px;
            }

            h1 {
              font-size: 28px;
              font-weight: 500;
              color: #252a34;
              line-height: 40px;
            }
          }
        }
      }
      .recommend {
        width: 100%;
        overflow: hidden;
        .recommendBox {
          background: #ffffff;
          box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
          border-radius: 16px;
          padding: 20px;
          overflow: hidden;
          .recommendBox-li {
            margin-bottom: 30px;
            display: flex;
            .recommendBox-left {
              width: 240px;
              height: 180px;
              box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
              border-radius: 16px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 16px;
              }
            }
            .recommendBox-right {
              flex: 1;
              margin-left: 20px;
              h2 {
                font-size: 32px;
                font-weight: 500;
                color: #252a34;
                overflow: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
              }
              .starScore {
                margin-top: 5px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                p {
                  font-size: 24px;
                  font-weight: 500;
                  color: #f46950;
                  margin-left: 14px;
                  line-height: 34px;
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
                  font-size: 24px;
                }
              }
              .hGrade {
                font-size: 24px;
                font-weight: 500;
                color: #bac5d2;
                margin-top: 16px;
                overflow: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
              }
            }
          }
        }
      }
      .hotHospital {
        width: 100%;
        overflow: hidden;
        .hotHospitalBox-li {
          background: #ffffff;
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          margin-bottom: 20px;
          .hotImg {
            width: 100%;
            height: 388px;
            border-radius: 16px 16px 0px 0px;
          }
          .hotBox {
            padding: 20px;
            h2 {
              font-size: 32px;
              font-weight: 500;
              color: #252a34;
              line-height: 44px;
              overflow: hidden;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
            .starScore {
              display: flex;
              align-items: center;
              margin-top: 5px;
              margin-bottom: 10px;
              p {
                font-size: 24px;
                font-weight: 500;
                color: #f46950;
                line-height: 34px;
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
              }
            }
            .hGrade {
              font-size: 24px;
              font-weight: 500;
              color: #bac5d2;
              margin-top: 20px;
              overflow: hidden;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }
          }
        }
      }
      .goodDoctor {
        width: 100%;
        overflow: hidden;
        .waterfall {
          background-color: #f7f9fb;
          ul {
            li {
              background-color: #ffffff;
              margin-bottom: 14px;
              border-radius: 16px;
              img {
                border-radius: 16px 16px 0 0;
              }
            }
          }
          .waterfall-left {
            width: 338px;
            float: left;
            img {
              width: 100%;

              display: block;
            }
          }
          .waterfall-right {
            float: left;
            width: 338px;
            margin-left: 12px;
            img {
              width: 100%;
              display: block;
            }
          }
          .waterfallBox {
            padding: 12px 16px 20px 16px;
            h2 {
              font-size: 28px;
              font-weight: 500;
              color: #252a34;
              line-height: 40px;
              width: 306px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .wHosipital {
              padding: 6px 16px;
              background: #f7f9fb;
              border-radius: 0px 8px 8px 8px;
              font-weight: 500;
              color: #bac5d2;
              display: inline-block;
              font-size: 20px;
              margin: 16px 0;
            }
            .successStories {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .w-success {
                background-color: #ffeef3;
                border-radius: 0px 8px 8px 8px;
                font-weight: 500;
                color: #ff5a88;
                line-height: 28px;
                padding: 6px 16px;
                display: block;
                font-size: 20px;
              }
              div {
                font-weight: 500;
                color: #bac5d2;
                line-height: 28px;
                .year {
                  margin-left: 7px;
                  font-size: 20px;
                }
              }
            }
          }
        }
      }
      .loading {
        margin-top: 50px;
      }
    }
  }
}

// vant的样式
/*以fixed的方式固定mescroll的高度*/

.home .mescroll-upwarp {
  background-color: #f7f9fb;
  padding-bottom: 130px;
}
</style>
