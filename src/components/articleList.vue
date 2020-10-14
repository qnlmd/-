<template>
  <mescroll-vue
    ref="mescroll"
    :up="mescrollUp"
    @init="mescrollInit"
    class="scrollView articleList"
  >
    <div class="container">
      <!-- 名医头条 -->
      <div class="goodDoctor">
        <!-- 瀑布流 -->
        <div class="waterfall">
          <ul class="waterfall-left">
            <li
              v-for="(item, index) in leftWaterfall"
              :key="index"
              @click="goArticle(item.article_id)"
            >
              <img :src="item.article_img" alt="" mode="widthFix" />
              <div class="waterfallBox">
                <h2>{{ item.article_title }}</h2>
                <span class="wHosipital">{{ item.article_description }}</span>
                <div class="successStories">
                  <span class="w-success">{{
                    item.article_keywords[0].name
                  }}</span>
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
              <img :src="item.article_img" alt="" mode="widthFix" />
              <div class="waterfallBox">
                <h2>{{ item.article_title }}</h2>
                <span class="wHosipital">{{ item.article_description }}</span>
                <div class="successStories">
                  <span class="w-success">{{
                    item.article_keywords[0].name
                  }}</span>
                  <div>
                    <span class="year">{{ item.create_time }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </mescroll-vue>
</template>
<script>
import { formatDate } from "../libs/date";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "articleList",
  components: {
    MescrollVue
  },
  created(){
    this.$store.commit('changeFbTitle',{name:"名医头条",tState:'0'})
    this.$store.commit("changeFbFoot", 0);
  },
  data() {
    return {
      //页数
      page: 1,
      pageSize: 10,
      //文章页数据
      articleData: {},
      // 瀑布流数组
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
    //去文章页
    goArticle(e) {
      this.$router.replace({
        path:'/article',
        name:'article',
        params:{
          article_id:e,
        }
      })
    }
  }
};
</script>
<style lang="less">
.articleList{
  .container {
  padding: 32px 30px;
  background: #f7f9fb;
  // justify-content: start;
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
        }
        .wHosipital {
          padding: 6px 16px;
          background: #f7f9fb;
          border-radius: 0px 8px 8px 8px;
          font-size: 20px;
          font-weight: 500;
          color: #bac5d2;
          display: inline-block;
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
            font-size: 20px;
            color: #ff5a88;
            line-height: 28px;
            padding: 6px 16px;
            display: block;
          }
          div {
            font-size: 20px;
            font-weight: 500;
            color: #bac5d2;
            line-height: 28px;
            .time {
              margin-left: 7px;
            }
          }
        }
      }
    }
  }

}

// vant的样式
/*以fixed的方式固定mescroll的高度*/

.mescroll-upwarp {
  background-color: #f7f9fb;
  padding-bottom: 130px;
}
}

</style>
