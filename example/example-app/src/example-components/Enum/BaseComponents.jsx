import React from 'react';

const Negative = ({ value }) => <p>NEGATIVE ({value})</p>;
const Zero = () => <p>ZERO</p>;
const Even = () => <p>EVEN</p>;
const Odd = () => <p>ODD</p>;

const Controls = ({ bumpA, bumpB }) =>
  <div>
    <button onClick={bumpA(1)}>a++</button>
    <button onClick={bumpB(1)}>b++</button>
    <button onClick={bumpA(-1)}>a--</button>
    <button onClick={bumpB(-1)}>b--</button>
  </div>;

export { Negative, Zero, Even, Odd, Controls };
