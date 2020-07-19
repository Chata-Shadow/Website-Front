<template>
  <div>
    <div :style="{margin: '20px 0' }">欢迎使用翻墙管理，首先请输入您的用户名和密码，并选择服务商</div>
    <Card style="height:700px;">
      <Row>
        <Col span="10">
          <Card style="display: flex;justify-content: flex-start;">
            <div class="title">账户信息</div>
            <div class="labelDiv">API KEY：</div>
            <Input v-model="APIKEY" placeholder="API KEY" class="inputBox" />
            <div class="labelDiv">SUBID：</div>
            <Input v-model="SUBID" placeholder="SUBID" class="inputBox" />
            <div class="labelDiv">SCRIPTID：</div>
            <!-- <Input v-model="value" placeholder="SCRIPTID" class="inputBox" /> -->

            <div class="title">购买</div>
            <div class="labelDiv">地区：</div>
            <!-- <Select v-model="location" class="inputBox">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <div class="labelDiv">金额：</div>
            <Select v-model="money" class="inputBox">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select> -->
            <Button type="success" long style="margin:10px;">一键生成翻墙服务器</Button>
            <Row>
              <Col span="12">
                <Button
                  type="primary"
                  icon="ios-search"
                  style="margin-right:50px"
                  @click="searchServer(APIKEY,status)"
                >刷新服务器状态</Button>
              </Col>
              <Col span="12">
                <Button type="error" style="margin-left:100px">删除所有服务器</Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span="12" style="margin-left:50px">
          <Input v-model="status" placeholder="SCRIPTID" class="inputBox" />
          {{status}}
          <Card style="width=100%;height=100%;" v-for="(index,item) in status" :key="index">
              {{item}}
          </Card>
          
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "wallmanage",
  data() {
    return {
      status: "123",
      APIKEY: "",
      SUBID: "",
      location: "",
      money: ""
    };
  },
  methods: {
    searchServer: (APIKEY,status) => {
      var _this = this;
      console.log(status);
      this.status="456";
      console.log(this);
      _this.$forceUpdate();
      console.log(status);
      if (typeof APIKEY == "undefined" || APIKEY == null || APIKEY == "") {
        alert("请输入APIKEY");
      } else {
        axios({
          url: "/api/server/list",
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "API-Key": APIKEY
          }
        }).then(res => {
          alert(res.data);
          _this.status = res.data;
          console.log(_this);
          console.log(_this.status);
        });
      }
    }
  }
};
</script>

<style scoped>
.title {
  left: 16px;
  font-size: 25px;
  text-align: left;
  margin: 0px, 5px;
}

.labelDiv {
  text-align: left;
  margin-left: 10px;
}

.inputBox {
  width: 300px;
  margin-left: 10px;
}
</style>
