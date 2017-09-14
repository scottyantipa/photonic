# react-partition

Partition your React components based on the props and state required to render each piece.

Benefits:
* Quickly see the possible states your component can be rendered in
* See what pieces of props & state each of these states needs to render
* No more if/else or switch control statements.  Instead, declaratively define the states of your component and how it looks in each.
* Get console warnings when your component gets in an unintended state

Without react-partition
```
import React from 'react';

const Negative = ({ value }) => <p>NEGATIVE ({value})</p>;
const Zero = () => <p>ZERO</p>;
const Even = () => <p>EVEN</p>;
const Odd = () => <p>ODD</p>;

class EnumClassic extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    }
  }

  render() {
    const bumpA = (int) => () => this.setState({ a: this.state.a + int });
    const bumpB = (int) => () => this.setState({ b: this.state.b + int });

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

    return (
      <div>
        {label}
        <div>
          <button onClick={bumpA(1)}>a++</button>
          <button onClick={bumpB(1)}>b++</button>
          <button onClick={bumpA(-1)}>a--</button>
          <button onClick={bumpB(-1)}>b--</button>
        </div>
      </div>
    )
  }
}

```

With react-partition
```
import React from 'react';
import partitionOn from 'react-partition';

const Negative = ({ value }) => <p>NEGATIVE ({value})</p>;
const Zero = () => <p>ZERO</p>;
const Even = () => <p>EVEN</p>;
const Odd = () => <p>ODD</p>;

const partitions = [
  {
    test: ({ state }) => (state.a + state.b < 0),
    reduce: ({ state }) => ({ value: state.a + state.b }),
    Comp: Negative
  },

  {
    test: ({ state }) => {
      const { a, b } = state;
      return a + b === 0;
    },
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


class EnumPartitioned extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 0,
      b: 0
    };
  }

  render() {
    const bumpA = (int) => () => this.setState({ a: this.state.a + int });
    const bumpB = (int) => () => this.setState({ b: this.state.b + int });

    return (
      <div>
        {partitionOn(this)(partitions)}
        <div>
          <button onClick={bumpA(1)}>a++</button>
          <button onClick={bumpB(1)}>b++</button>
          <button onClick={bumpA(-1)}>a--</button>
          <button onClick={bumpB(-1)}>b--</button>
        </div>
      </div>
    );
  }
}
```
