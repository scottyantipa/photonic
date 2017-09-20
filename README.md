# photonic

Reduce the potential energy of your React components. Write your state logic declaratively to better reason about how a component behaves with different combinations of props and state.

With photonic
```jsx
import React from 'react';
import { reduce } from 'photonic';

import { Negative, Zero, Even, Odd, Controls } from 'some/magical/place';

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
```

Without photonic
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

Benefits:
* Quickly see the possible states your component can be rendered in.
* See what pieces of props abd state are required to render each state.
* Stop using if/else or switch control statements.  Instead, declaratively write how to handle each state of your component.
* Automaticly detect and handle bad states.

Cons
* You must explicitly write your states, which may take more code.
