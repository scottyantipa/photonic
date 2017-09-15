import React from 'react';
import PropTypes from 'prop-types';

const Loading = () => <span>Loading...</span>;
const Loaded = () => <span>Loaded!</span>;

const DataLoading = (props) => {
  const { isLoading } = props;
  if (isLoading) {
    return <Loading />
  } else {
    return <Loaded />;
  }
};

DataLoading.propTypes = { isLoading: PropTypes.bool };

export default DataLoading;
