const template = `
<div class="uml-wrapper">
  <div class="uml-head">Head</div>
  <div class="uml-body">
    <div><button @click="addOne">+</button> <button @click="deleteOne">-</button>    {{properties.name}}</div>
    <div>{{properties.body}}</div>
  </div>
  <div class="uml-footer">
    <div>setHead(Head $head)</div>
    <div>setBody(Body $body)</div>
  </div>
</div>
`;

export default Vue.component('call', {
  template,
  props: {
    properties: Object,
    model: Object,
    graphModel: Object,
  },
  methods: {
    addOne() {
      this.graphModel.eventCenter.emit("custom:add-one", this.model);
    },
    deleteOne() {
      this.graphModel.eventCenter.emit("custom:delete-one", this.model);
    }
  },
});
