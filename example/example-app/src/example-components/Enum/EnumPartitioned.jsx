import React from 'react';
import partitionOn from '../../react-partition';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

const labelPartitions = [
  {
    test: ({ state }) => (state.a + state.b < 0),
    reduce: ({ state }) => ({ value: state.a + state.b }),
    Comp: Negative
  },

  {
    test: ({ state }) => (state.a + state.b) === 0,
    reduce: () => ({}),
    Comp: Zero,
  },

  {
    test: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 0);
    },
    reduce: () => ({}),
    Comp: Even,
  },

  {
    test: ({ state }) => {
      const { a, b } = state;
      return (a + b > 0) && ((a + b) % 2 === 1);
    },
    reduce: () => ({}),
    Comp: Odd
  }
];

const buttonsPartition = {
  test: () => true,
  reduce: ({ state, self }) => {
    const bumpA = (int) => () => self.setState({ a: state.a + int });
    const bumpB = (int) => () => self.setState({ b: state.b + int });
    return { bumpA, bumpB };
  },
  Comp: Controls
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
    const $p = partitionOn(props, state, this);

    return (
      <div>
        {$p(labelPartitions)}
        {$p(buttonsPartition)}
      </div>
    );
  }
}

export default EnumPartitioned;
