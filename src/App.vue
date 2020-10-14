<template>
  <div class="fBox">
    <!-- 头部 -->
    <div class="fBox-title">
      <div class="backBox" v-show="$store.state.tState == 0">
        <div class="back" @click="back">
          <img src="@/assets/images/home/ic_back.png" alt="" />
        </div>
        <p class="line"></p>
        <router-link to="/" class="homeBack" replace>
          <img src="@/assets/images/home/ic_homeback.png" alt="" />
        </router-link>
      </div>
      <div class="content">
        {{ $store.state.fbTitle }}
      </div>
    </div>
    <!-- 出口 -->
    <router-view></router-view>
    <!-- 底部 -->
    <van-tabbar
      v-model="active"
      route
      v-show="$store.state.fState != 1"
      class="footer"
      :style="{ paddingBottom: iphoneHeight }"
    >
      <van-tabbar-item replace to="/">
        <span>首页</span>
        <template #icon="props">
          <img :src="props.active ? icon.home.active : icon.home.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="search" replace to="/list">
        <span>医院列表</span>
        <template #icon="props">
          <img :src="props.active ? icon.list.active : icon.list.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o" replace to="/me">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? icon.my.active : icon.my.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { NavBar } from "vant";
import { Tabbar, TabbarItem } from "vant";
export default {
  name: "App",
  components: {
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      // 底部icon
      active: 0,
      icon: {
        home: {
          active: "/static/tabs/ic_home_select.png",
          inactive: "/static/tabs/ic_home_default.png"
        },
        list: {
          active: "/static/tabs/ic_list_select.png",
          inactive: "/static/tabs/ic_list_default.png"
        },
        my: {
          active: "/static/tabs/ic_my_select.png",
          inactive: "/static/tabs/ic_my_default.png"
        }
      },
      iphoneHeight: 0
    };
  },
  created() {
    // 获取用户token
    let tokenStr = location.search;
    var token = "";
    if (tokenStr) {
      token = tokenStr.split("&")[0].substr(7);
      window.localStorage.setItem("token", token);
      this.goHome();
    }
    // iphonex 适配
    if (
      /iphone/gi.test(navigator.userAgent) &&
      screen.height >= 812 &&
      screen.width >= 375
    ) {
      this.iphoneHeight = 1.062 + "rem";
    }
  },
  methods: {
    back() {
      let i = this.$routerHistory._history.length - 2;
      this.$router.goBack();
      let name = this.$routerHistory._history[i].substr(1)
      this.$router.replace({
        path: this.$routerHistory._history[i],
        name,
        params: this.$routerHistory._params
      });
    },
    goHome() {
      // window.location.href='http://mp.ivfhome.com/'
      this.$router.replace({
        path: "/home",
        name: "home"
      });
    }
  }
};
</script>

<style lang="less">
.fBox {
  display: flex;
  flex-direction: column;
  height: 100%;
  .fBox-title {
    position: fixed;
    width: 690px;
    height: 86px;
    background-color: #fff;
    top: 0; 
    z-index: 1;
    padding: 0 30px;
    .backBox {
      position: absolute;
      left: 30px;
      top: 10px;
      width: 174px;
      height: 64px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50px;
      border: 1px solid rgba(151, 151, 151, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        width: 1px;
        height: 37px;
        background: rgba(0, 0, 0, 0.2);
        margin: 0 24px;
      }
      .back {
        width: 18px;
        height: 32px;
      }
      .homeBack {
        width: 32px;
        height: 32px;
      }
    }
    .content {
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #252a34;
      line-height: 50px;
      width: 100%;
      text-align: center;
      height: 86px;
      line-height: 86px;
    }
  }
}

// vant样式
.van-hairline--top-bottom {
  height: 100px !important;
  .van-tabbar-item__icon {
    margin-bottom: 8px;
    img {
      width: 48px;
      height: 48px;
    }
  }
  .van-tabbar-item__text {
    font-size: 20px;
  }
}
</style>
