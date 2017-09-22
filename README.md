# Photonic

Conditionally render components in a declarative fashion.
Reduce the potential energy of your React components.

## Syntax

A partition is an object that inspects the current props/state and determines if it should render.
```
{
  show:      a React component
  withProps: the props to pass to `show`.  This can be undefined, an object, or a function of props/state that returns an object
  when:      boolean or or a function of props/state that returns a boolean
}
```

Photonic inspects an array of partitions and determines which one to render.
If `when` is truthy, then `show` will be rendered with the results of `withProps`.

In dev mode, if multiple partitions are truthy then Photonic will throw a warning. In production it uses the first match to save on perf.
This means that partitions are order *independent*.  I.e. each `when` must independently determine if the partition is active.  This helps you to identify when states are actually independent or if they can be combined into a single state.

## Example

```js
import React from 'react';
import { reduce } from 'photonic';

// The 3 states
const Error   = ({ errorStr }) => <div>{errorStr}</div>;
const Loading = () => <div>Loading...</div>;
const User    = ({ user }) => <div>{user.name}</div>;

// Define the partitions
const partitions = [
  {
    show: Error,
    when: ({ state }) => !state.loading && state.fetchFailed, // we can immediately see that this condition only depends on state
    withProps: ({ props }) => ({ errorStr: props.errorStr }) // and this partition only depends on props to render
  },
  {
    show: Loading, // if no props are needed you can omit withProps
    when: ({ state }) => !state.user && state.fetching
  },
  {
    show: User,
    when: ({ state }) => Boolean(state.user),
    withProps: ({ state }) => ({ user: state.user })
  }
];

class UserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: undefined,
      fetching: false,
      fetchFailed: false
    };
  }

  componentWillMount() {
    this.setState({ fetching: true });
    fetchUser()
      .then(user => this.setState({ user, fetchFailed: false }))
      .fail(() => this.setState({ fetchFailed: true }))
      .always(() => this.setState({ fetching: false }));
  }

  // Call `reduce` with the current props & state.  Photonic will render the correct partition.
  // Note that this does not need jsx to render
  render() {
    const { props, state } = this;
    const position = { props, state };
    return reduce(partitions, position);
  }
}
```

## Why?
A big render function, with if/elses and switches, is hard to reason about. It also causes your program to have high "potential energy" -- all of the possible things that your program can do before it completes.  Photonic helps you to reduce this complexity by jumping your program's execution from the top of the render function directly into a single partition. Declaring states in a data structure, rather than with control statements, will reduce bugs and better express the intent of the component.

## Detecting overlapping partitions
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

### Benefits:
* Quickly see the possible states your component can be rendered in.
* See what pieces of props abd state are required to render each state.
* Stop using if/else or switch control statements.  Instead, declaratively write how to handle each state of your component.
* Automaticly detect and handle bad states.

### Cons
* You must explicitly write your states, which may take more code.
