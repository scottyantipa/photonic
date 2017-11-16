# Photonic

###### Declarative conditional rendering for React.
A complex component will render different things depending on its current state. Photonic lets you describe those states in a declarative way -- an array of rules. It then does the work of rendering the state that is currently active.

## Examples

A stateful UserPage that fetches and renders data about a user.
```js
import React from 'react';
import { stateful } from 'photonic';

// Define a component for each possible state of the UserPage.
const User        = ({ user }) => <div>{user.name}</div>;
const Fetching    = () => <div>Fetching...</div>;
const FetchFailed = ({ errorStr }) => <div>{errorStr}</div>;

// Photonic uses these partitions to determine which state to render.
const partitions = [
  {
    show: User,
    when: ({ state }) => Boolean(state.user),
    withProps: ({ state }) => ({ user: state.user })
  },
  {
    show: Fetching,
    when: ({ state }) => !state.user && state.fetching
  }
  {
    show: FetchFailed,
    when: ({ state }) => !state.loading && state.fetchFailed,
    withProps: ({ props }) => ({ errorStr: props.errorStr })
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

  // Call the function returned by `stateful`. It will determine which partition
  // is currently active and render it.
  render() {
    return stateful(this, partitions)();
  }
}
```

You can also define stateless functional components.
```js
import React from 'react';
import { sfc } from 'photonic';

export const FooOrBar = sfc([
  {
    show: Foo,
    when: ({ foo }) => foo === true
  },
  {
    show: Bar,
    when: ({ foo }) => !foo
  }
]);
```

## API

### partitions
A partition is an object that describes one particular state of your component.
```
{
  show:      a React component
  withProps: props to pass to `show`
  when:      condition
}
```
You can think of the keys as a little story: Render `show` with the props `withProps` if `when` is true.

These are the possible values for each key:
```
{
  show:      React component
  withProps: object | function returning object | undefined
  when:      boolean | function returning boolean
}
```

Photonic uses *order independent* matching to determine which partition is active. This means that you cannot assume that the first partition returned false when you are writing the condition for the second partition. I.e. each `when` must independently determine if the partition is active. This helps you to identify when states are actually independent or if they can be combined into a single state.

In development mode, if multiple partitions are truthy then Photonic will throw a warning. In production it uses the first match for better performance.

### stateful
Call this function with your component instance and its partitions. It will render the active partition.
```js
import { stateful } from 'photonic';
const partitions = [/*...*/];
class ImStateful extends React.Component {
  render() {
    return stateful(this, partitions);
  }
}
```

### sfc
Call this function to create an SFC
```js
import { sfc } from 'photonic';
const partitions = [/*...*/];
const MySFC = sfc(partitions);
```

## Why Photonic?
A big render function, with if/elses and switches, is hard to reason about. It also causes your program to have high "potential energy" -- all of the possible things that your program can do before it completes.  Photonic helps you to reduce this complexity by jumping your program's execution from the top of the render function directly into a single partition. Declaring states in a data structure, rather than with control statements, will reduce bugs and better express the intent of the component.

Benefits:
* Quickly see the possible states your component can be rendered in.
* Stop using if/else or switch control statements.  Instead, declaratively write how to handle each state of your component.
* See what parts of props and state are required to render each state.
* Automaticly detect and handle bad states.

## Detecting overlapping partitions
If you accidentally write overlapping partitions (i.e. multiple return true for some state) then Photonic will throw a warning in the console (in dev mode only). For example, both Foo and Bar will be active if state.a < 10.
```js
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
