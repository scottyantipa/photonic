import React from 'react';
import partitionOn, { log } from '../../index.jsx';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

const labelPartitions = [
  {
    show: Negative,
    withProps: ({ state }) => ({ value: state.a + state.b }),
    when: ({ state }) => (state.a + state.b < 0)
  },
  {
    show: Zero,
    when: ({ state }) => (state.a + state.b) === 0
  },
  {
    show: Even,
    when: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 0);
    }
  },
  {
    show: Odd,
    when: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 1);
    }
  }
];

const partLabel = partitionOn(labelPartitions);

const partControl = partitionOn({
  show: Controls,
  withProps: ({ state, self }) => {
    const bumpA = (int) => () => self.setState({ a: state.a + int });
    const bumpB = (int) => () => self.setState({ b: state.b + int });
    return { bumpA, bumpB };
  },
  when: true
});

class EnumPartitioned extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    };
  }

  shouldComponentUpdate(newProps, newState) {
    log(
      labelPartitions,
      { props: this.props, state: this.state, self: this },
      { props: newProps, state: newState, self: this }
    );
    return true;
  }

  render() {
    const position = { props: this.props, state: this.state, self: this };

    return (
      <div>
        {partLabel(position)}
        {partControl(position)}
      </div>
    );
  }
}

export default EnumPartitioned;
