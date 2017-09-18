import React from 'react';
import PropTypes from 'prop-types';

import { Loading, Error, Loaded } from './BaseComponents';

const DataLoading = (props) => {
  const { isLoading } = props;
  if (isLoading) {
    return <Loading />;
  } else if (props.errorStr) {
    return <Error str={props.errorStr} />;
  } else {
    return <Loaded />;
  }
};

DataLoading.propTypes = {
  isLoading: PropTypes.bool,
  errorStr: PropTypes.string
};

export default DataLoading;
