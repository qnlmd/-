<template>
  <mescroll-vue
    ref="mescroll"
    :up="mescrollUp"
    @init="mescrollInit"
    class="scrollView orderList"
  >
    <div class="container">
      <div class="orderBox">
        <ul>
          <li
            v-for="(item, index) in orderListData"
            :key="index"
            @click="goOrder(item)"
          >
            <div class="orderInfo">
              <p>{{ item.service_name }}</p>
              <div
                class="status"
                v-if="item.status == 0"
                style="color: #ff5a88"
              >
                待完善
              </div>
              <div
                class="status"
                v-else-if="item.status == 1"
                style="color: #17c9c6"
              >
                申请中
              </div>
              <div
                class="status"
                v-else-if="item.status == 2"
                style="color: #bac5d2"
              >
                已完成
              </div>
            </div>
            <p class="orderTime"><i>时间:</i>{{ item.create_time }}</p>
            <p class="orderHospital"><i>医院:</i>{{ item.hospital_name }}</p>
          </li>
        </ul>
      </div>
      <!-- 没有预购的界面 -->
      <van-empty
        :image="vantImgSrc"
        description="亲，您暂时还没有申请噢"
        v-if="orderListData.length == 0"
      />
    </div>
  </mescroll-vue>
</template>
<script>
import { Empty } from "vant";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "orderList",
  components: {
    MescrollVue,
    [Empty.name]: Empty
  },
  data() {
    return {
      //申请列表数据
      orderListData: [],
      vantImgSrc:require('@/assets/images/home/custom.png'),
      page: 1,
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
    this.$store.commit('changeFbTitle',{name:"订单列表",tState:'0'})
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
        .getOrderList({
          page: page.num,
          pageSize: 10
        })
        .then(res => {
          // 请求的列表数据
          let arr = res.data.data;
          // 如果是第一页需手动置空列表
          if (page.num === 1)  this.orderListData = [];
          // 把请求到的数据添加到列表
          this.orderListData =  this.orderListData.concat(arr);
           for (let index = 0; index < this.orderListData.length; index++) {
        this.orderListData[index].create_time = this.orderListData[
          index
        ].create_time.replace(/-/g, ".");
        this.orderListData[index].create_time = this.orderListData[
          index
        ].create_time.substring(0, 10);
      }
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
    // 前往申请详情
    goOrder(res) {
      console.log(res);
      this.$router.replace({
        url: "/order",
        name: "order",
        params: {
          orderId: res.order_id
        }
      });
    }
  }
};
</script>
<style lang="less">
.orderList {
  width: 100%;
  height: 100%;
  background: #f7f9fb;
  .container {
    padding: 0 30px 60px 30px;
    .orderBox {
      ul {
        li {
          margin-top: 30px;
          width: 630px;
          padding: 30px;
          background: #ffffff;
          box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
          border-radius: 16px;
          .orderInfo {
            display: flex;
            justify-content: space-between;
            p {
              width: 516px;
              font-size: 32px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #252a34;
              line-height: 44px;
            }
            .status {
              font-size: 28px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #17c9c6;
              line-height: 40px;
            }
          }
          & > p {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #bac5d2;
            line-height: 40px;
            display: flex;
            i {
              margin-right: 16px;
            }
          }
          .orderTime {
            margin: 30px 0 20px 0;
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
  // .data-v-18d21b78{
  //   width: 100%;
  //   display:flex;
  //   justify-content:center;
  // }
}
</style>
