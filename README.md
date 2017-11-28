# Photonic

##### Conditional rendering in React using decision trees

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
  On each render, Photonic will find the currently active node
  in the decision tree and render it. For example, the tree below
  has the following rules:
  - The first decision point has two branches: one for when state.user exists
    and one for when it is undefined.
  - When the user exists, just show the User component.
  - The undefined branch further splits into two branches:
    - Show 'Fetching' when there's no data and we're fetching the user from
      the server.
    - Show FetchFailed when there was an error fetching the data
*/
const tree = [
  {
    show: User,
    withProps: ({ state }) => ({ user: state.user }),
    when: ({ state }) => state.user !== undefined
  },
  {
    when: ({ state }) => state.user === undefined,
    show: [
      {
        show: Fetching,
        when: ({ state }) => state.fetching
      },
      {
        show: FetchFailed,
        withProps: ({ props }) => ({ errorStr: props.errorStr }),
        when: ({ state }) => !state.loading && state.fetchFailed
      }    
    ]
  }
];

class UserPage extends React.Component {
  componentWillMount() {
    this.setState({ fetching: true });
    fetchUser()
      .then(user => this.setState({ user, fetchFailed: false, fetching: false }))
      .fail(() => this.setState({ fetchFailed: true, fetching: false }));
  }

  render() {
    return stateful(this, tree)();
  }
}
```

## API

### nodes
A node is an object that describes a decision point in the decision tree.
```
{
  show:      a React component (for leaf nodes) or another tree
  withProps: props to pass to `show` (for leaf nodes)
  when:      boolean condition
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

In dev mode, Photonic will check the `when` condition for all branches out of a node. If multiple branches from one node are active then Photonic will throw a warning to let the developer know that the branches are not exclusive. In production, it picks the first active branch and returns for better performance..

### stateful
Call this function with your component instance and a decision tree. It will render the active node.
```js
import { stateful } from 'photonic';
const tree = [/*...*/];
class ImStateful extends React.Component {
  render() {
    return stateful(this, tree);
  }
}
```

### sfc
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

Photonic uses *order independent* matching to determine which node is active. This means that you cannot assume that the first branch returned false when you are writing the condition for the second branch for a given node. I.e. each `when` condition must independently determine if the branch is active. This helps you to identify when states are actually independent or if they can be combined into a single state.
```js
const tree = [
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

## Detecting overlapping branches
If you accidentally write overlapping branches (i.e. multiple return true for some state) then Photonic will throw a warning in the console (in dev mode only). For example, both Foo and Bar will be active if state.a < 10.
```js
const tree = [
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
