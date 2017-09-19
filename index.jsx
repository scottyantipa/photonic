import React from 'react';

const render = (partition, position) => {
  const { withProps, show: Comp } = partition;
  const props = typeof withProps === 'function' ?
    withProps(position) : (withProps || {});
  return <Comp {...props} />;
};

const isActive = (partition, position) => {
  const { when } = partition;
  const isFunc = typeof when === 'function';
  return isFunc ? when(position) : when;
}

const allActive = (partitions, position) => {
  return partitions.map((_p, i) => i)
                   .filter(i => isActive(partitions[i], position));
}

const renderActive = (partitions, position) => {
  const indices = allActive(partitions, position);
  const renderFirst = () => render(partitions[indices[0]], position);
  switch (indices.length) {
    case 0:
      console.warn('Could not find partition for this state.')
      return null;
    case 1:
      return renderFirst();
    default:
      console.warn("Multiple indices active. Defaulting to first. ", indices);
      return renderFirst();
  }
}

const partitionOn = (partitions) => {
  return (position) => {
    return renderActive(partitions, position);
  };
};

export default partitionOn;
