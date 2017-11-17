# Photonic

##### Declarative conditional rendering for React.

## Install
```
npm install --save photonic
```

## Example

A stateful component called UserPage that fetches and renders data about a user.
```js
import React from 'react';
import { stateful } from 'photonic';

// Define a component for each possible state of the UserPage.
const User        = ({ user }) => <div>{user.name}</div>;
const Fetching    = () => <div>Fetching...</div>;
const FetchFailed = ({ errorStr }) => <div>{errorStr}</div>;

/*
  On each render, Photonic will find the currently active partition
  and render it. For example, the first partition below
  says that when state.user is truthy, render User
  with the props { user: state.user }.
*/
const partitions = [
  {
    show: User,
    withProps: ({ state }) => ({ user: state.user }),
    when: ({ state }) => Boolean(state.user)
  },
  {
    show: Fetching,
    when: ({ state }) => !state.user && state.fetching
  }
  {
    show: FetchFailed,
    withProps: ({ props }) => ({ errorStr: props.errorStr }),
    when: ({ state }) => !state.loading && state.fetchFailed
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
      .then(user => this.setState({ user, fetchFailed: false, fetching: false }))
      .fail(() => this.setState({ fetchFailed: true, fetching: false }));
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

Photonic uses *order independent* matching to determine which partition is active. This means that you cannot assume that the first partition returned false when you are writing the condition for the second partition. I.e. each `when` condition must independently determine if the partition is active. This helps you to identify when states are actually independent or if they can be combined into a single state.
```js
const partitions = [
  {
    show: Foo,
    when: ({ state }) => state.a
  },
  {
    show: Bar,
    when: ({ state }) => {
      // This condition cannot assume that it is run after the
      // `when` condition from Foo just because it comes after it in this array.
      // e.g. it cannot assume that `state.a` is false.
      return !state.a;
    }
  }
]
```

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
