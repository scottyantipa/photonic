import React from 'react';
import { reduce } from '../../index.jsx';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

const partitions = [
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

const controlPartition = [
  {
    when: true, // always show it
    show: Controls,
    withProps: ({ state, self }) => {
      const bumpA = (int) => () => self.setState({ a: state.a + int });
      const bumpB = (int) => () => self.setState({ b: state.b + int });
      return { bumpA, bumpB };
    }
  }
];

class EnumPartitioned extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    };
  }

  render() {
    const position = { props: this.props, state: this.state, self: this };

    return (
      <div>
        {reduce(partitions, position)}
        {reduce(controlPartition, position)}
      </div>
    );
  }
}

export default EnumPartitioned;
