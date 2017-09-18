import React from 'react';
import PropTypes from 'prop-types';
import partitionOn from '../../index.jsx';

const Loading = () => <span>Loading...</span>;
const Loaded = () => <span>Loaded!</span>;

const part = partitionOn([
  {
    show: Loading,
    withProps: ({ props }) => ({}),
    when: ({ props }) => props.isLoading
  },
  {
    show: Loaded,
    withProps: ({ props }) => ({}),
    when: ({ props }) => !props.isLoading
  }
]);

const DataLoading = (props) => {
  return part({ props });
};

DataLoading.propTypes = { isLoading: PropTypes.bool };

export default DataLoading;
