<template>
  <div class="apply0">
    <div class="container">
      <div class="title">
        <img src="@/assets/images/applys/ic_pic_doctor.png" alt="" />
      </div>
      <!-- 表单验证 -->
      <div class="verification">
        <form>
          <div class="formBox">
            <div class="name">
              <p>姓名:</p>
              <input
                type="text"
                v-model.lazy="form.name"
                placeholder="填写您的真实姓名"
              />
            </div>
            <div class="phone">
              <p>联系方式:</p>
              <input
                type="text"
                v-model.lazy="form.phone"
                placeholder="请输入手机号"
              />
            </div>
            <div class="vCode">
              <p>验证码:</p>
              <input type="text" v-model.lazy="form.vCode" />
              <span @click="getVcode()" v-show="codeShow">发送验证码</span>
              <span v-show="!codeShow">{{ count }}s重新获取</span>
            </div>
          </div>
          <p class="next" @click="addBaseInfo(form)">立即申请</p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import WxValidate from "@/libs/WxValidate";
// const app = getApp();
export default {
  name: "apply0",
  data() {
    return {
      // 表单
      form: {
        name: "",
        phone: ""
      },
      // 用户信息
      userInfo: {},
      userStatus: 0,
      // 验证码&倒计时
      codeShow: true,
      count: "",
      timer: null
    };
  },
  created() {
    this.$store.commit('changeFbTitle',{name:"填写申请表",tState:'0'})
    this.$store.commit("changeFbFoot", 1);
    // 表单验证
    const rules = {
      name: {
        required: true,
        rangelength: [2, 4]
      },
      phone: {
        required: true,
        tel: true
      }
    };
    const messages = {
      name: {
        required: "请填写姓名",
        rangelength: "请输入正确的名称"
      },
      phone: {
        required: "请填写手机号码",
        tel: "请填写正确手机号码"
      }
    };
    this.WxValidate = new WxValidate(rules, messages);
    this.userInfo = this.$route.params;
    console.log(this.userInfo)
  },
  methods: {
    //提交基础信息
    addBaseInfo(form) {
      if (!this.WxValidate.checkForm(this.form)) {
        const erro = this.WxValidate.errorList[0];
        this.$toast(erro.msg);
        return;
      }
      let formStr = JSON.stringify(form);
      // 添加基础信息
      this.$request.createInfo(this.form).then(data => {
        //创建成功
        if (data.msg == "添加成功") {
          this.$toast.success({
            message: "创建成功",
            forbidClick: true,
            onClose: () => {
              // 成功后生成订单
              this.addOrder(data.data.user_info_id);
            }
          });
        }
      });
    },
    // 提交订单
    addOrder(user_info_id) {      
      this.userInfo.user_info_id = user_info_id;
      console.log(this.userInfo.user_info_id )
      console.log(this.userInfo)
      this.$request.addOrder(this.userInfo).then(data => {
        if (data.code == 1) {
          //去申请提交成功页面
           this.$router.replace({
            path: "/infoCard",
            name: "infoCard",
            params: {
              userStatus: this.userStatus,
              user_info_id: user_info_id,
              userName: this.form.name,
              userPhone: this.form.phone
            }
          });
        }
      });
    },
    // 获取验证码&倒计时
    getVcode() {
      this.$toast("短信发送成功");
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.codeShow = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.codeShow = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }
};
</script>
<style lang="less">
.apply0 {
  width: 750px;
  margin-top: 86px;
  flex: 1;
  background: #f7f9fb;
  .container {
    padding: 60px 30px 0 30px;
    display: block;
    .title {
      display: flex;
      justify-content: center;
      margin-bottom: 60px;
      img {
        width: 582px;
        height: 400px;
      }
    }
    .verification {
      form {
        .formBox {
          background: #ffffff;
          box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
          border-radius: 16px;
          height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 30px 0 30px;
          margin-bottom: 40px;
          div {
            height: 100px;
            display: flex;
            align-items: center;

            p {
              width: 220px;
            }
            input {
              font-size: 32px;
            }
          }
          .name {
            display: flex;
          }
          .phone {
            display: flex;
            button {
              &::after {
                width: 0;
                height: 0;
              }
            }
            .getPhone {
              width: 430px;
              height: 80px;
              background: #e4f8dc;
              border-radius: 40px;
              border: 1px solid #7ed877;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 48px;
                height: 44px;
                display: block;
                margin-right: 20px;
              }
              span {
                font-size: 28px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #3bb431;
                line-height: 40px;
              }
            }
          }
          .vCode {
            display: flex;
            justify-content: space-between;
            input{
              width: 248px;
            }
            span {
              font-size: 28px;
              font-weight: 500;
              color: #2a90ff;
            }
          }
        }
      }
      .next {
        height: 110px;
        background: #2a90ff;
        box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 44px;
        width: 100%;
      }
    }
  }
}
</style>
