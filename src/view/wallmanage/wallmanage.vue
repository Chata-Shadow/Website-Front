<template>
  <div>
    <Card style="height:700px;">
      <Row :gutter="88">
        <Col :xxl="8" :xs="24">
          <Card style="display: flex;justify-content: flex-start;">
            <div class="title">账户信息</div>
            <div class="labelDiv">API KEY：</div>
            <Input v-model="APIKEY" placeholder="API KEY" class="inputBox" />
            <div class="title">购买</div>
            <div class="labelDiv">SCRIPT：</div>
            <Select v-model="scriptValue" class="inputBox" ref="selectScript">
              <Option
                v-for="item in script"
                :value="item.SCRIPTID"
                :key="item.SCRIPTID"
              >{{item.name}}</Option>
            </Select>
            <div class="labelDiv">地区：</div>
            <Select v-model="localValue" class="inputBox" ref="selectLocal">
              <Option v-for="item in location" :value="item.DCID" :key="item.DCID">{{item.name}}</Option>
            </Select>
            <div class="labelDiv">金额：</div>
            <Select v-model="moneyValue" class="inputBox" ref="selectMoney">
              <Option
                v-for="item in money"
                :value="item.VPSPLANID"
                :key="item.VPSPLANID"
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

        <Col :xxl="16" :xs="24">
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
      localValue: "",
      moneyValue: "",
      deleteSelect: [],
      script: "",
      scriptValue: "",
    };
  },
  methods: {
    searchServer() {
      if (
        typeof this.APIKEY == "undefined" ||
        this.APIKEY == null ||
        this.APIKEY == ""
      ) {
        alert("请输入APIKEY");
      } else {
        axios({
          url: "/api/server/list",
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "API-Key": this.APIKEY,
          },
        }).then((res) => {
          this.status = res.data;
        });
      }
    },
    getCountry() {
      axios({
        url: "/api/regions/list",
        method: "get",
      }).then((res) => {
        this.location = res.data;
        let keys = Object.keys(this.location);
        this.localValue = this.location[keys[0]].DCID;
      });
    },
    getServerPlan() {
      axios({
        url: "/api/plans/list?type=vc2",
        method: "get",
      }).then((res) => {
        this.money = res.data;
        let keys = Object.keys(this.money);
        this.moneyValue = this.money[keys[0]].VPSPLANID;
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
          "API-Key": APIKEY,
        },
        transformRequest: [
          function (data) {
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
          },
        ],
        data: {
          DCID: region,
          VPSPLANID: account,
          OSID: "362",
          SCRIPTID: "733180",
        },
      }).then(
        (res) => {
          localStorage.setItem("APIKEY", APIKEY);
          searchServer();
        },
        (res) => {
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
            "API-Key": APIKEY,
          },
          transformRequest: [
            function (data) {
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
            },
          ],
          data: {
            SUBID: deleteSelect[item],
          },
        }).then(
          (res) => {},
          (res) => {
            alert("删除失败");
          }
        );
      }
      searchServer();
    },
    getScript() {
      var APIKEY = this.APIKEY;
      console.log(this.APIKEY);
      axios({
        url: "/api/startupscript/list",
        method: "get",
        headers: {
          "API-Key": "ELKB2QVCJC4TBK2ABY44T2DTKV3OPT24HRGQ",
        },
      }).then((res) => {
        this.script = res.data;
        let keys = Object.keys(this.script);
        this.scriptValue = this.script[keys[0]].SCRIPTID;
      });
    },
    generalByMy() {
      axios({
        url: "/api/server/create",
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "API-Key": this.APIKEY,
        },
        transformRequest: [
          function (data) {
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
          },
        ],
        data: {
          DCID: this.localValue,
          VPSPLANID: this.moneyValue,
          OSID: "362",
          SCRIPTID: this.scriptValue,
        },
      }).then(
        (res) => {
          searchServer();
        },
        (res) => {
          alert(res);
        }
      );
    },
  },
  mounted() {
    this.APIKEY = localStorage.getItem("APIKEY");
    this.getCountry();
    this.getServerPlan();
    this.getScript();
  },
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
