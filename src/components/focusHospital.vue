<template>
  <mescroll-vue
    ref="mescroll"
    :up="mescrollUp"
    @init="mescrollInit"
    class="scrollView focusHospital"
  >
    <div class="container">
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

                <span class="follow">{{ item.interest }}人关注</span>
              </div>
              <p class="hGrade">{{ item.hospital_description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 没有关注医院的界面 -->
      <van-empty
        :image='vantImgSrc'
        description="亲，您还没有关注医院呢"
        v-if="listData.length == 0"
      />
    </div>
  </mescroll-vue>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Rate } from "vant";
import { Search } from "vant";
import { Empty } from "vant";
export default {
  name: "focusHospital",
  components: {
    MescrollVue,
    [Rate.name]: Rate,
    [Search.name]: Search,
    [Empty.name]: Empty
  },
  data() {
    return {
      // 医院列表数组
      listData: [],
      vantImgSrc:require('@/assets/images/home/custom.png'),
      //页数
      page: 1,
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
  created(){
    this.$store.commit('changeFbTitle',{name:"关注医院",tState:'0'})
    this.$store.commit("changeFbFoot", 0);
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
      this.$request
        .getInterestHospital({
          page: page.num,
          pageSize: 10
        })
        .then(res => {
          // 请求的列表数据
          let arr = res.data.data;
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
        })
        .catch(e => {
          mescroll.endErr();
        });
    },
    // 跳转去到医院详情业
    goHospitalInfo(e) {
      this.$router.replace({
        path:'/hIntroduction',
        name:'hIntroduction',
        params:{
          hospital_id:e.hospital_id
        }
      })
    }
  }
};
</script>
<style lang="less">
.focusHospital {
  .container {
    padding: 0 30px;
    background-color: #ffffff;
    // justify-content: start;
    .seachBox {
      padding: 20px 0;
      .seach {
        width: 690px;
        height: 69px;
        background: #f2f3f5;
        border-radius: 34px;
        font-size: 28px;
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          margin: 0 20px;
        }
        input {
          flex: 1;
          font-size: 28px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #bac5d2;
          line-height: 40px;
        }
      }
    }

    .hospitalList {
      padding: 30px 0px 0px 20px;
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
          flex: 1;
          margin-left: 20px;
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
              height: 34px;
              font-size: 24px;
              font-weight: 500;
              color: #f46950;
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
              background-color: #e9f3ff;
              color: #2a90ff;
              margin-right: 0;
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
    .van-empty{
      .van-empty__image{
        width: 320px;
        height: 320px;
      }
      .van-empty__description{
        font-size: 28px;
      }
    }
  }
}
</style>
