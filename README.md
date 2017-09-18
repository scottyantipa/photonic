# photonic

Partition your React components based on the props and state required to render each piece.

Benefits:
* Quickly see the possible states your component can be rendered in
* See what pieces of props & state each of these states needs to render
* No more if/else or switch control statements.  Instead, declaratively define the states of your component and how it looks in each.
* Get console warnings when your component gets in an unintended state

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

With photonic
```jsx
import React from 'react';
import partitionOn from 'photonic';

import { Negative, Zero, Even, Odd, Controls } from 'some/magical/place';

const partLabel = partitionOn([
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
]);

const partControl = partitionOn({
  show: Controls,
  withProps: ({ state, self }) => {
    const bumpA = (int) => () => self.setState({ a: state.a + int });
    const bumpB = (int) => () => self.setState({ b: state.b + int });
    return { bumpA, bumpB };
  },
  when: () => true
});

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
        {partLabel(position)}
        {partControl(position)}
      </div>
    );
  }
}
```

Log state transitions for class based components:
```jsx
import React from 'react';
import { log }, partitionOn from 'photonic';

class MyComponent extends React.Component {
  shouldComponentUpdate(newProps, newState) {
    log(
      labelPartitions,
      { props: this.props, state: this.state, self: this },
      { props: newProps, state: newState, self: this }
    );
    return true;
  }
}
```
