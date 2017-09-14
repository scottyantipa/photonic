import React from 'react';

import partitionOn from '../react-partition'

const Ack = ({ onClick }) => <button onClick={onClick}>Ack</button>;

const Text = ({ showText, onClick }) => {
  const text = showText ? 'Hide Text' : 'Show Text';

  return (
    <div>
      <button onClick={onClick}>
        {text}
      </button>
      <span>{showText ? 'This is the text' : undefined}</span>
    </div>
  );
};

const partitions = [
  {
    test: ({ state }) => !state.hasAcked,
    reduce: ({ state, self }) => ({
      onClick: () => self.setState({ hasAcked: true })
    }),
    Comp: Ack
  },
  {
    test: ({ state }) => state.hasAcked,
    reduce: ({ state, self }) => ({
      showText: state.showText,
      onClick: () => self.setState({ showText: !state.showText })
    }),
    Comp: Text
  }
]

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

    return partitionOn(props, state, this)(partitions);
  }
}

export default NestedStates;
