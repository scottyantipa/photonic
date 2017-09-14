import React from 'react';

import { Negative, Zero, Even, Odd, Controls } from './BaseComponents';

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
        <Controls bumpA={bumpA} bumpB={bumpB} />
      </div>
    )
  }
}

export default EnumClassic;
