import React from 'react';

import { Negative, Zero, Even, Odd } from './BaseComponents';

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

export default EnumClassic;
