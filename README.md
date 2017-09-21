# Photonic

Reduce the potential energy of your React components.
Write your state logic declaratively to better reason about how a component behaves in different states.

# Example

Here's an example of a component that uses Photonic and has, conceptually, 5 different states.
```js
import React from 'react';
import { reduce } from 'photonic';

import { Negative, Zero, Even, Odd, Controls } from 'some/magical/place';

/*
Define your partitions.

A partition is an object that inspects the current props/state and determines if it should render.
{
  show:      A React component
  withProps: The props to pass to `show`.  This can be undefined or an object or a function of props/state that returns an object
  when:      Boolean or Function returning a Boolean.  
}

If `when` is truthy, then `show` will be rendered with the results of `withProps`.
In dev mode, if multiple partitions are truthy then Photonic will throw a warning. In production it uses the first match to save on perf.

Partitions are order *independent*.  I.e. each `when` must independently determine if the partition is active.
*/
const partitions = [
  {
    show: Negative,
    withProps: ({ state }) => ({ value: state.a + state.b }), // only depends on state to render
    when: ({ state }) => (state.a + state.b < 0) // only needs state to determine if it is active
  },
  {
    show: Zero,
    when: ({ state }) => (state.a + state.b) === 0
    withProps: ({ props }) => ({ message: props.zeroMessage }) // only requires props to render
  },
  {
    // Even doesn't require props to render so we leave withProps undefined
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

class EnumPartitioned extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 0
    };
  }

  // Call `reduce` with the current component props & state and let Photonic determine which partition to render.
  // Note that this does not need jsx to render
  render() {
    const position = { props: this.props, state: this.state, self: this };
    return reduce(partitions, position);
  }
}
```

# Why?
A big render function, with if/elses and switches, is hard to reason about. It also causes your program to have high "potential energy" -- all of the possible things that your program can do before it completes.  Photonic helps you to reduce this complexity by jumping your program's execution from the top of the render function directly into a single partition. Declaring states in a data structure, rather than with control statements, will reduce bugs and better express the intent of the component.

# Detecting overlapping partitions
```js
// If you accidentally write overlapping partitions (i.e. multiple return true for some state)
// Then Photonic will throw a warning in the console (in dev mode only);
// For example, both Foo and Bar will be active if state.a < 10.
const partitions = [
  {
    show: Foo,
    when: {{ state }} => state.a < 5,
  },
  {
    show: Bar,
    when: ({ state }) => state.a < 10
  }
]
```

Benefits:
* Quickly see the possible states your component can be rendered in.
* See what pieces of props abd state are required to render each state.
* Stop using if/else or switch control statements.  Instead, declaratively write how to handle each state of your component.
* Automaticly detect and handle bad states.

Cons
* You must explicitly write your states, which may take more code.
