<template>
  <div>
    <div :style="{margin: '20px 0' }">欢迎使用翻墙管理，首先请输入您的用户名和密码，并选择服务商</div>
    <Card style="height:700px;">
      <Row>
        <Col span="8">
          <Card style="display: flex;justify-content: flex-start;">
            <div class="title">账户信息</div>
            <div class="labelDiv">API KEY：</div>
            <Input v-model="APIKEY" placeholder="API KEY" class="inputBox" />
            <!-- <div class="labelDiv">SUBID：</div>
            <Input v-model="SUBID" placeholder="SUBID" class="inputBox" />-->
            <!-- <div class="labelDiv">SCRIPTID：</div>
            <Input v-model="value" placeholder="SCRIPTID" class="inputBox" />-->

            <div class="title">购买</div>
            <div class="labelDiv">SCRIPT：</div>
            <Select v-model="scriptValue" class="inputBox">
              <Option v-for="(item,key) in script" :value="item.SCRIPTID" :key="key">{{item.name}}</Option>
            </Select>
            <div class="labelDiv">地区：</div>
            <Select v-model="localValue" class="inputBox">
              <Option v-for="(item,key) in location" :value="item.name" :key="key">{{item.name}}</Option>
            </Select>
            <div class="labelDiv">金额：</div>
            <Select v-model="moneyValue" class="inputBox">
              <Option
                v-for="(item,key) in money"
                :value="item.price_per_month"
                :key="key"
              >{{item.price_per_month}}</Option>
            </Select>
            <Button type="success" long style="margin:10px;" @click="generalByone(APIKEY)">一键生成翻墙服务器</Button>
            <Row>
              <Col span="12">
                <Button
                  type="primary"
                  icon="ios-search"
                  style="margin-right:50px"
                  @click="searchServer(APIKEY,status)"
                >刷新服务器状态</Button>
              </Col>
              <Col span="6">
                <Button type="success" @click="generalByMy(APIKEY)">我要自己生成</Button>
              </Col>
              <Col span="6">
                <Button type="error" @click="deleteAll(APIKEY)">删除选中的服务器</Button>
              </Col>
            </Row>
          </Card>
          <div style="text-align: left;color:red;">正在获取地区信息。。。</div>
        </Col>

        <Col span="14" style="margin-left:100px;">
          <CheckboxGroup v-model="deleteSelect">
            <Card class="statusclass" v-for="(item,index) in status" :key="index">
              <Row>
                <Col span="6">
                  <Icon type="ios-globe" size="50" color="green" style="margin-top:28px" />
                </Col>
                <Col span="12">
                  <div class="labelDiv" style="font-size:48px;width:500px">{{item.main_ip}}</div>
                  <div class="labelDiv" style="width:500px">
                    服务器当前状态：
                    <span style="color:green;">{{item.power_status}}</span>
                  </div>
                  <div class="labelDiv">服务器密码:{{item.default_password}}</div>
                </Col>
                <Col span="6">
                  <div style="width:100px;height:100px;margin-right:10px;margin-left:200px">
                    <Checkbox :label="item.SUBID">
                      <span></span>
                    </Checkbox>
                  </div>
                </Col>
              </Row>
            </Card>
          </CheckboxGroup>
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
      status: {},
      APIKEY: "",
      SUBID: "",
      location: "",
      money: "",
      localValue: "Los Angeles",
      moneyValue: "5.00",
      deleteSelect: [],
      script: "",
      scriptValue:""
    };
  },
  methods: {
    searchServer(APIKEY, status) {
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
          this.status = res.data;
        });
      }
    },
    getCountry() {
      axios({
        url: "/api/regions/list",
        method: "get"
      }).then(res => {
        this.location = res.data;
      });
    },
    getServerPlan() {
      axios({
        url: "/api/plans/list?type=vc2",
        method: "get"
      }).then(res => {
        this.money = res.data;
      });
    },
    generalByone(APIKEY) {
      var region = "6";
      var account = "202";
      axios({
        url: "/api/server/create",
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "API-Key": APIKEY
        },
        transformRequest: [
          function(data) {
            // Do whatever you want to transform the data
            let ret = "";
            for (let it in data) {
              // 如果要发送中文 编码
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        data: {
          DCID: region,
          VPSPLANID: account,
          OSID: "362",
          SCRIPTID:"733180"
        }
      }).then(
        res => {
          this.money = res.data;
        },
        res => {
          alert(res);
        }
      );
    },
    deleteAll(APIKEY) {
      var deleteSelect = this.deleteSelect;
      for (var item in this.deleteSelect) {
        axios({
          url: "/api/server/destroy",
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "API-Key": APIKEY
          },
          transformRequest: [
            function(data) {
              // Do whatever you want to transform the data
              let ret = "";
              for (let it in data) {
                // 如果要发送中文 编码
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            }
          ],
          data: {
            SUBID: deleteSelect[item]
          }
        }).then(
          res => {
            alert("服务器删除成功");
          },
          res => {
            alert("删除失败");
          }
        );
      }
    },
    getScript() {
      var APIKEY = this.APIKEY;
      console.log(this.APIKEY);
      axios({
        url: "/api/startupscript/list",
        method: "get",
        headers: {
          "API-Key": "ELKB2QVCJC4TBK2ABY44T2DTKV3OPT24HRGQ"
        }
      }).then(res => {
        this.script = res.data;
        let keys = Object.keys(this.script);
        this.scriptValue = this.script[keys[0]].SCRIPTID;
      });
    },
    generalByMy(){
      var region = "5";
      var account = "202";
      axios({
        url: "/api/server/create",
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "API-Key": APIKEY
        },
        transformRequest: [
          function(data) {
            // Do whatever you want to transform the data
            let ret = "";
            for (let it in data) {
              // 如果要发送中文 编码
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        data: {
          DCID: region,
          VPSPLANID: account,
          OSID: "362",
          SCRIPTID:"733180"
        }
      }).then(
        res => {
          this.money = res.data;
        },
        res => {
          alert(res);
        }
      );
    }
  },
  mounted() {
    this.getCountry();
    this.getServerPlan();
    this.getScript();
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
  word-wrap: break-word;
  width: 100%;
}

.inputBox {
  width: 300px;
  margin-left: 10px;
}

.statusclass {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.ivu-card-body {
  width: 100%;
}
</style>
