# react-partition

Partition your React components based on the props and state required to render each piece.

Benefits:
* Quickly see the possible states your component can be rendered in
* See what pieces of props & state each of these states needs to render
* No more if/else or switch control statements.  Instead, declaratively define the states of your component and how it looks in each.
* Get console warnings when your component gets in an unintended state

Without react-partition
```jsx
import React from 'react';

import { Negative, Zero, Even, Odd, Controls } from 'some/magical/place';

class EnumClassic extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    }
  }

  render() {
    const { a, b } = this.state;
    let label;

    if (a + b < 0) {
      label = <Negative value={a + b} />;
    } else if (a + b === 0) {
      label = <Zero />
    } else if ((a + b) % 2 === 0) {
      label = <Even />;
    } else {
      label = <Odd />;
    }

    const bumpA = (int) => () => this.setState({ a: this.state.a + int });
    const bumpB = (int) => () => this.setState({ b: this.state.b + int });

    return (
      <div>
        {label}
        <Controls bumpA={bumpA} bumpB={bumpB} />
      </div>
    )
  }
}

```

With react-partition
```jsx
import React from 'react';
import partitionOn from 'react-partition';

import { Negative, Zero, Even, Odd, Controls } from 'some/magical/place';

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

const buttonsPartition = {
  show: Controls,
  withProps: ({ state, self }) => {
    const bumpA = (int) => () => self.setState({ a: state.a + int });
    const bumpB = (int) => () => self.setState({ b: state.b + int });
    return { bumpA, bumpB };
  },
  when: () => true // always render it
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
```
