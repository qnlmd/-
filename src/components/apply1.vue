<template>
  <div class="apply1">
    <div class="container">
      <!-- 步骤 -->
      <div class="head">
        <div>
          <ul>
            <li class="active">
              <i></i>
              <p>个人信息</p>
            </li>
            <li>
              <i></i>
              <p>实名认证</p>
            </li>
            <li>
              <i></i>
              <p>体检报告</p>
            </li>
          </ul>
          <!-- 分割线 -->
          <div class="line">
            <span class="lineL"></span>
            <span class="lineR"></span>
          </div>
        </div>
      </div>
      <!-- 表单验证 -->
      <div class="verification">
        <form>
          <div class="name">
            <p>姓名:</p>
            <input
              type="text"
              v-model.lazy="form.name"
              placeholder="填写您的真实姓名"
              placeholder-class="input-placeholder"
            />
          </div>
          <div class="phone">
            <p>手机号码:</p>
            <!-- 填写 or 授权 -->
            <input
              type="text"
              v-model.lazy="form.phone"
              placeholder="请输入您的手机号"
              placeholder-class="input-placeholder"
            />
          </div>
          <div class="identity">
            <p>身份证号:</p>
            <input
              type="text"
              v-model.lazy="form.id_number"
              placeholder="请输入"
              placeholder-class="input-placeholder"
            />
          </div>
          <div class="address">
            <p>家庭住址:</p>
            <input
              type="text"
              v-model.lazy="form.address"
              placeholder="请输入"
              placeholder-class="input-placeholder"
            />
            <!-- <textarea v-model.lazy="form.address" placeholder="请输入" ></textarea> -->
          </div>
          <div class="contacts">
            <p>紧急联系人:</p>
            <input
              type="text"
              v-model.lazy="form.emergency_contact"
              placeholder="方便我们联系您"
              placeholder-class="input-placeholder"
            />
          </div>
          <div class="sContacts">
            <p>联系人电话:</p>
            <input
              type="text"
              v-model.lazy="form.emergency_contact_phone"
              placeholder="11位手机号"
              placeholder-class="input-placeholder"
            />
          </div>
          <button class="next" @click="addBaseInfo(form)" type="button">完成创建</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import WxValidate from "@/libs/WxValidate";
export default {
  name: "apply1",
  data() {
    return {
      // 表单
      form: {
        name: "",
        phone: "",
        id_number: "",
        address: "",
        emergency_contact: "",
        emergency_contact_phone: ""
      },
      // 填写 or 授权
      isFill: 1
    };
  },
  created() {
    this.$store.commit('changeFbTitle',{name:"填写申请表",tState:'0'})
    this.$store.commit("changeFbFoot", 1);
    this.form = {};
    this.isFill = 1;
    console.log(this.$route);
    if (this.$route.params.name || this.$route.params.phone) {
      this.form.name = this.$route.params.name;
      this.form.phone = this.$route.params.phone;
      this.form.user_info_id = this.$route.params.user_info_id;
      this.isFill = 0;
    }
    // 表单验证
    const rules = {
      name: {
        required: true,
        rangelength: [2, 4]
      },
      phone: {
        required: true,
        tel: true
      },
      id_number: {
        required: true,
        idcard: true
      },
      address: {
        required: true,
        minlength: 5
      },
      emergency_contact: {
        required: true,
        rangelength: [2, 4]
      },
      emergency_contact_phone: {
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
      },
      id_number: {
        required: "请填写身份证号码",
        tel: "请填写正确的身份证号码"
      },
      address: {
        required: "请填写家庭住址",
        minlength: "请填写详细的家庭住址"
      },
      emergency_contact: {
        required: "请填写紧急联系人",
        rangelength: "请输入正确紧急联系人"
      },
      emergency_contact_phone: {
        required: "请填写手机号码",
        tel: "请填写正确联系号码"
      }
    };
    this.WxValidate = new WxValidate(rules, messages);
  },
  methods: {
    //提交基础信息
    addBaseInfo(form) {
      if (!this.WxValidate.checkForm(this.form)) {
        const erro = this.WxValidate.errorList[0];
        this.$toast.fail({
          message: erro.msg
        });
        return;
      }
      if (form.name == form.emergency_contact) {
        this.$toast("紧急联系人不能填写本人");
        return;
      }
      if (form.phone == form.emergency_contact_phone) {
        this.$toast("辅助联系人号码不能与本人相同");
        return;
      }
      console.log(123)
      let formStr = JSON.stringify(form);
      // 添加基础信息
      this.$request.addBaseInfo(this.form).then(data => {
        if (data.msg == "提交成功") {
          //创建成功
          this.$toast.success({
            message: "创建成功",
            onClose: () => {
              this.$router.replace({
                path: "/me"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
.apply1 {
  height: 100%;
  background: #f7f9fb;
  margin-top: 86px;
  .container {
    height: 100%;
    padding: 0 30px;
    width: 690px;
    display: block;
    .head {
      width: 690px;
      padding-top: 80px;
      padding-bottom: 60px;
      position: relative;
      ul {
        display: flex;
        justify-content: space-around;
        align-items: center;

        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          i {
            width: 12px;
            height: 12px;
            background: #c3dffc;
            margin-bottom: 42px;
            border-radius: 50%;
            z-index: 9998;
          }
          p {
            font-size: 24px;
            font-weight: 500;
            color: #bac5d2;
            line-height: 34px;
          }
        }
        .active {
          position: relative;
          i {
            background-color: #ffffff;
            z-index: 9999;
          }
          &::before {
            content: "";
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #2a90ff;
            position: absolute;
            left: 50%;
            margin-left: -18px;
            top: -11px;
            z-index: 999;
          }
        }
      }
      .line {
        .lineL {
          position: absolute;
          width: 214px;
          height: 4px;
          background: #eef1f4;
          top: 85px;
          left: 133px;
        }
        .lineR {
          position: absolute;
          width: 214px;
          height: 4px;
          background: #eef1f4;
          top: 85px;
          right: 122px;
        }
      }
    }
    .verification {
      padding: 20px 30px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(186, 197, 210, 0.1);
      border-radius: 16px;
      div {
        display: flex;
        align-items: center;
        height: 100px;
        color: #6b6b6b;
        p {
          width: 220px;
          height: 40px;
          font-size: 28px;
          font-weight: 400;
          color: #464e5e;
          line-height: 40px;
        }
        input {
          font-size: 28px;
          font-weight: 400;
          color: #bac5d2;
          line-height: 40px;
          flex: 1;
        }
        .input-placeholder {
          color: #bac5d2;
        }
        textarea {
          width: 410px;
          height: 40px;
          max-height: 60px;
          font-size: 28px;
          font-weight: 400;
          line-height: 40px;
          rows: 1;
          resize: none;
        }
        .getPhone {
          padding: 0;
          border: 0;
          margin: 0;
          font-size: 28px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #2a90ff;
          line-height: 40px;
          background: #ffffff;
          &::after {
            width: 0;
            height: 0;
          }
        }
      }
      .next {
        width: 690px;
        height: 80px;
        background: #2a90ff;
        border-radius: 44px;
        font-size: 32px;
        font-weight: 500;
        color: #ffffff;
        line-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 60px;
        left: 30px;
      }
    }
  }
}
</style>
