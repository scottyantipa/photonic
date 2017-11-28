import React from 'react';
import { stateful } from '../../index.jsx';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

const tree = [
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
    when: ({ state }) => (state.a + state.b > 0),
    show: [
      {
        show: Even,
        when: ({ state }) => (state.a + state.b) % 2 === 0
      },
      {
        show: Odd,
        when: ({ state }) => (state.a + state.b) % 2 === 1
      }
    ]
  }
];

class Enum extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    };
  }

  render() {
    return (
      <div>
        {stateful(this, tree)()}
        <Controls
          bumpA={(int) => () => this.setState({ a: this.state.a + int })}
          bumpB={(int) => () => this.setState({ b: this.state.b + int })}
        />
      </div>
    );
  }
}

export default Enum;
