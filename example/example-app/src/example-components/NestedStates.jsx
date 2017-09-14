import React from 'react';

import partitionOn from '../react-partition'

const Ack = ({ onClick }) => {
  return (
    <button onClick={onClick} >
      Ack
    </button>
  );
}

const AckPartition = {
  test: ({ state }) => !state.hasAcked,
  reduce: ({ state, self }) => ({
    onClick: () => self.setState({ hasAcked: true })
  }),
  Comp: Ack
}

const Text = ({ showText, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>
        { showText ? 'Hide Text' : 'Show Text'}
      </button>
      <span>{showText ? 'This is the text' : undefined}</span>
    </div>
  );
};

const TextPartition = {
  test: ({ state }) => state.hasAcked,
  reduce: ({ state, self }) => ({
    showText: state.showText,
    onClick: () => self.setState({ showText: !state.showText })
  }),
  Comp: Text
}

/*
  Normally this component would look like:
  render() {
    if (!this.state.hasAcked) {
      return <Ack onClick= {()=> self.setState({ hasAcked: true })} />;
    }

    return (
      <Text
        showText={this.state.showText}
        onClick={() => self.setState({ showText: !state.showText })}
      />
    );
  }
}
*/
class NestedStates extends React.Component {
  constructor() {
    super();
    this.state = {
      hasAcked: false,
      showText: false
    }
  }

  render() {
    const { props, state } = this;
    const $p = partitionOn(props, state, this);

    return $p([
      AckPartition,
      TextPartition
    ]);
  }
}

export default NestedStates;
