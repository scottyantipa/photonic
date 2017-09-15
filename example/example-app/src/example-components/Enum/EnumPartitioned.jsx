import React from 'react';
import partitionOn from '../../react-partition';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

const labelPartitions = [
  {
    show: Negative,
    withProps: ({ state }) => ({ value: state.a + state.b }),
    when: ({ state }) => (state.a + state.b < 0)
  },
  {
    show: Zero,
    withProps: () => ({}),
    when: ({ state }) => (state.a + state.b) === 0
  },
  {
    show: Even,
    withProps: () => ({}),
    when: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 0);
    }
  },
  {
    show: Odd,
    withProps: () => ({}),
    when: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 1);
    }
  }
];

const controlsPartion = {
  show: Controls,
  withProps: ({ state, self }) => {
    const bumpA = (int) => () => self.setState({ a: state.a + int });
    const bumpB = (int) => () => self.setState({ b: state.b + int });
    return { bumpA, bumpB };
  },
  when: () => true
}

class EnumPartitioned extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    };
  }

  render() {
    const { props, state } = this;
    const $p = partitionOn({ props, state, self: this });

    return (
      <div>
        {$p(labelPartitions)}
        {$p(controlsPartion)}
      </div>
    );
  }
}

export default EnumPartitioned;
