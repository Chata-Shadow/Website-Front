<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="light" active-name="wallmanage" @on-select="clike">
          <MenuItem name="wallmanage">
            <Icon type="ios-navigate"></Icon>翻墙管理
          </MenuItem>
          <MenuItem name="notfound">
            <Icon type="ios-keypad"></Icon>待定
          </MenuItem>
          <MenuItem name="notfound">
            <Icon type="ios-analytics"></Icon>待定
          </MenuItem>
          <MenuItem name="notfound">
            <Icon type="ios-paper"></Icon>待定
          </MenuItem>
        </Menu>
      </Header>
      <Content :style="{padding: '0 50px'}">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </Content>
      <Footer class="layout-footer-center">2011-2020 &copy; WUY</Footer>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    clike(name) {
      this.$router.push(`/${name}`);
    }
  }
};
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #eee;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-footer-center {
  text-align: center;
}

.ivu-layout-content {
  margin-top: 30px;
}

.ivu-menu {
  width: 400px;
}

.ivu-layout-header {
  background: #ffffff;
}
</style>
