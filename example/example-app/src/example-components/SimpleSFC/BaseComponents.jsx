import React from 'react';

const Loading = () => <span>Loading...</span>;
const Error = ({ str }) =>(
  <div>
    <div><h5>Error!</h5></div>
    <div><span>{str}</span></div>
  </div>
);
const Loaded = () => <span>Loaded!</span>;

export { Loading, Error, Loaded };
