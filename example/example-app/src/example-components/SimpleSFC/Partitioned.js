import PropTypes from 'prop-types';
import { sfc } from '../../index.jsx';

import { Loading, Error, Loaded } from './BaseComponents';

const hasError = (props) => Boolean(props.errorStr);

const DataLoading = sfc([
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
]);

DataLoading.propTypes = {
  isLoading: PropTypes.bool,
  errorStr: PropTypes.string
};

export default DataLoading;
