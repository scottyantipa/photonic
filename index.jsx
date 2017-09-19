import React from 'react';

const render = (partition, position) => {
  const { withProps, show: Comp } = partition;
  const props = typeof withProps === 'function' ?
    withProps(position) : (withProps || {});
  return <Comp {...props} />;
};

const findActive = (partitions, position) => {
  for (let idx in partitions) {
    const partition = partitions[idx];
    const when = partition.when;
    const isFunc = typeof when === 'function';
    if (isFunc ? when(position) : when) {
      return partition;
    }
  }
  return undefined;
}

const partitionOn = (partitions) => {
  return (position) => {
    const partition = findActive(partitions, position);
    if (partition) {
      return render(partition, position);
    } else {
      console.warn('Could not find partition for this state.')
      return null;
    }
  };
};

export default partitionOn;
