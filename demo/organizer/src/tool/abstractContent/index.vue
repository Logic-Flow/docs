<template>
  <div class="content-wrap">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div v-if="content && content.length">
        <div class="item" v-for="(item, index) in content" :key="index">
          <img :src="item.type === 'event' ? eventIcon : reactionIcon" class="icon" />
          <span>{{ item.desc }}</span>
        </div>
      </div>
      <div v-else>暂未配置</div>
      <div class="button" @click="goConfig" v-if="showButton">去配置</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    content: Array,
    title: String,
    showButton: Boolean
  },
  data() {
    return {
      eventIcon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_event.png',
      reactionIcon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_reaction.png'
    }
  },
  methods: {
    goConfig() {
      this.$emit('config')
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrap {
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #303a51;
}
.item {
  padding: 0 4px;
  height: 25px;
  font-weight: 400;
  display: flex;
  align-items: center;
  .icon {
    margin-right: 4px;
    width: 12px;
    height: 12px;
  }
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.content {
  padding: 8px 0;
}
.title {
  line-height: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  padding-bottom: 4px;
  border-bottom: 1px solid #e4e7ed;
}
.button {
  width: 60px;
  height: 24px;
  margin-top: 8px;
  line-height: 24px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #2961ef;
  border-radius: 2px;
  color: #2961ef;
  float: right;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
