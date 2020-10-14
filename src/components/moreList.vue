<template>
  <mescroll-vue
    ref="mescroll"
    :up="mescrollUp"
    @init="mescrollInit"
    class="scrollView moreList"
  >
    <div class="container">
      <!-- 搜索框 -->
      <form action="/" class="seachBox">
        <van-search
          v-model="keywords"
          placeholder="搜索医院、医生、地址"
          @search="onSearch"
          left-icon="https://mykjminiapp.ivfhome.com/static/images/search.png"
        />
      </form>
      <!-- 医院列表 -->
      <div class="hospitalList">
        <ul>
          <li
            class="hospitalList-li"
            v-for="(item, index) in listData"
            :key="index"
            @click="goHospitalInfo(item)"
          >
            <div class="hospitalList-left">
              <img :src="item.hospital_img" alt="" mode="aspectFill" />
            </div>
            <div class="hospitalList-right">
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
                <span class="follow" v-if="item.interest != 0"
                  >{{ item.interest }}人关注</span
                >
              </div>
              <p class="hGrade">{{ item.hospital_description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 搜索无内容 -->
      <van-empty
        image="search"
        description="抱歉，找不到你搜索的信息"
        v-if="showSearch == 1"
      />
    </div>
  </mescroll-vue>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Search } from "vant";
import { Rate } from "vant";
export default {
  name: "moreList",
  components: {
    MescrollVue,
    [Rate.name]: Rate,
    [Search.name]: Search
  },
  data() {
    return {
      // 医院列表数组
      listData: [],
      // 搜索的关键词
      keywords: "",
      // 加载
      isLoding: false,
      // 跳转过来的参数
      newData: {
        page: 1,
        pageSize: 10
      },
      //搜索无内容
      showSearch: 0,
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
    this.showSearch = 0;
    this.keywords = "";
    //热门 or 推荐
    this.$store.commit("changeFbFoot", 0);
    if (this.$route.query.is_hot) {
      this.newData.is_hot = this.$route.query.is_hot;
      delete this.newData.latitude;
      delete this.newData.longitude;
      //热门医院
      this.$store.commit("changeFbTitle", { name: "热门医院", tState: "0" });
    } else {
      this.newData.latitude = this.$route.query.latitude;
      this.newData.longitude = this.$route.query.longitude;
      this.$store.commit("changeFbTitle", { name: "附近医院", tState: "0" });
      //推荐医院
    }
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
    //上啦加载
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.newData.page = page.num;
      if (this.keywords) {
        this.newData.keywords = this.keywords;
        if (this.newData.latitude || this.newData.longitude) {
          delete this.newData.latitude;
          delete this.newData.longitude;
        } else if (this.newData.is_hot) {
          delete this.newData.is_hot;
        }
      }
      this.$request.getHospitalList(this.newData).then(data => {
        // 请求的列表数据
        let arr = data.data.data;
        // 如果是第一页需手动置空列表
        if (page.num === 1) this.listData = [];
        // 把请求到的数据添加到列表
        this.listData = this.listData.concat(arr);
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length);
          if (arr.length == 0) {
            this.$toast("亲，请休息下暂无更多内容啦");
          }
        });
      });
    },
    // 搜索
    onSearch() {
      // 需要把page复原
      let page = 1;
      let data = { page: this.page, pageSize: 10, keywords: this.keywords };
      this.$request.getHospitalList(data).then(res => {
        this.listData = res.data.data;
        if (this.listData.length == 0) {
          this.showSearch = 1;
        } else {
          this.showSearch = 0;
        }
      });
    },
    // 跳转去到医院详情业
    goHospitalInfo(e) {
      this.$router.replace({
        path: "/hIntroduction",
        name: "hIntroduction",
        params: {
          hospital_id: e.hospital_id
        }
      });
    }
  }
};
</script>
<style lang="less">
.moreList {
  .container {
    padding: 0 30px;
    background-color: #ffffff;
    // justify-content: start;
    .seachBox {
      padding: 20px 0;
      .van-search {
        width: 690px;
        height: 69px;
        background: #f7f9fb;
        border-radius: 34px;
        font-size: 28px;
        display: flex;
        align-items: center;
        .van-cell {
          display: flex;
          align-items: center;
          .van-field__left-icon {
            width: 32px;
            height: 32px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .van-field__body {
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #bac5d2;
            line-height: 40px;
            margin-left: 20px;
          }
        }
      }
    }

    .hospitalList {
      padding: 30px 0px 0px 0px;
      width: 690px;
      .hospitalList-li {
        margin-bottom: 30px;
        display: flex;
        justify-content: start;
        .hospitalList-left {
          width: 240px;
          height: 180px;
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 16px;
          }
        }
        .hospitalList-right {
          margin-left: 20px;
          flex: 1;
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
            margin-top: 5px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            p {
              margin-left: 16px;
              font-size: 24px;
              font-weight: 500;
              color: #f46950;
              line-height: 34px;
            }
          }
          .tages {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            span {
              display: block;
              padding: 5px 15px;
              border-radius: 4px;
              font-size: 24px;
              margin-right: 20px;
              font-weight: 500;
              // line-height: 34px;
            }
            .follow {
              margin-right: 0;
              background-color: #e9f3ff;
              color: #2a90ff;
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
    .loading {
      margin-top: 50px;
    }
    .baseline {
      font-size: 24px;
      color: #bac5d2;
      margin-top: 80px;
      margin-bottom: 50px;
    }
  }
}
</style>
