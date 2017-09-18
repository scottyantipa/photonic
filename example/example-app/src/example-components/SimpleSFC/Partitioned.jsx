import PropTypes from 'prop-types';
import partitionOn from '../../index.jsx';

import { Loading, Error, Loaded } from './BaseComponents';

const hasError = (props) => Boolean(props.errorStr);

const part = partitionOn([
  {
    show: Loading,
    withProps: ({ props }) => ({}),
    when: ({ props }) => props.isLoading
  },
  {
    show: Loaded,
    withProps: ({ props }) => ({}),
    when: ({ props }) => !props.isLoading && !hasError(props)
  },
  {
    show: Error,
    withProps: ({ props }) => ({ str: props.errorStr}),
    when: ({ props }) => hasError(props)
  }
]);

const DataLoading = (props) => {
  return part({ props });
};

DataLoading.propTypes = {
  isLoading: PropTypes.bool,
  errorStr: PropTypes.string
};

export default DataLoading;
