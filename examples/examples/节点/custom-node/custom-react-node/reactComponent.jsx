function Hello(props) {
  const addOne = () => {
    props.graphModel.eventCenter.emit("custom:add-one", props.model);
  }

  const deleteOne = () => {
    props.graphModel.eventCenter.emit("custom:delete-one", props.model);
  }

  return (
    <div className="uml-wrapper">
      <div className="uml-head">Head</div>
      <div className="uml-body">
        <div><button onClick={() => addOne()}>+</button> <button onClick={() => deleteOne()}>-</button>    {props.name}</div>
        <div>{props.body}</div>
      </div>
      <div className="uml-footer">
        <div>setHead(Head $head)</div>
        <div>setBody(Body $body)</div>
      </div>
    </div>
  )
}

export default Hello;
