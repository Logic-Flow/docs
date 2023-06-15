<template>
  <div class="page-tip" v-if="text">
    <i class="el-icon-info tip-icon" ></i>
  {{ text }}</div>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="less" scoped>
 .page-tip {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #666;
  }
  .tip-icon {
    margin-right: 2px;
  }
</style>