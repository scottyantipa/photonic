import PropTypes from 'prop-types';
import { reduce } from '../../index.jsx';

import { Loading, Error, Loaded } from './BaseComponents';

const hasError = (props) => Boolean(props.errorStr);

const partitions = [
  {
    show: Loading,
    when: ({ props }) => props.isLoading
  },
  {
    show: Loaded,
    when: ({ props }) => !props.isLoading && !hasError(props)
  },
  {
    show: Error,
    withProps: ({ props }) => ({ str: props.errorStr}),
    when: ({ props }) => hasError(props)
  }
];

const DataLoading = (props) => {
  return reduce(partitions, { props });
};

DataLoading.propTypes = {
  isLoading: PropTypes.bool,
  errorStr: PropTypes.string
};

export default DataLoading;
