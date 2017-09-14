import React from 'react';
import partitionOn from '../../react-partition';

const Loading = () => <span>Loading...</span>;
const Loaded = () => <span>Loaded!</span>;

const partitions = [
  {
    show: Loading,
    withProps: ({ props }) => ({}),
    when: ({ props }) => Boolean(props.isLoading)
  },
  {
    show: Loaded,
    withProps: ({ props }) => ({}),
    when: ({ props }) => !Boolean(props.isLoading)
  }
];

const DataLoading = (props) => {
  return partitionOn(props)(partitions);
};

export default DataLoading;
