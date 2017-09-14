import React from 'react';
import partitionOn from '../../react-partition';

const Loading = () => <span>Loading...</span>;
const Loaded = () => <span>Loaded!</span>;

const partitions = [
  {
    test: ({ props }) => Boolean(props.isLoading),
    reduce: ({ props }) => ({}),
    Comp: Loading
  },
  {
    test: ({ props }) => !Boolean(props.isLoading),
    reduce: ({ props }) => ({}),
    Comp: Loaded
  }
];

const DataLoading = (props) => {
  return partitionOn(props)(partitions);
};

export default DataLoading;
