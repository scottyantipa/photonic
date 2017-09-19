import React from 'react';

const getDisplayName = (reactComponent) => {
  return reactComponent.displayName || reactComponent.name || 'Component';
};

const render = (partition, position) => {
  const { withProps, show: Comp } = partition;
  const props = typeof withProps === 'function' ?
    withProps(position) : (withProps || {});
  return <Comp {...props} />;
};

const processEnum = (partitions, position) => {
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

const activePartition = (oneOrEnum, position) => {
  let partition;

  if (Array.isArray(oneOrEnum)) {
    partition = processEnum(oneOrEnum, position);
    if (!partition) console.warn('Could not find partition for this state.');
  } else {
    const when = oneOrEnum.when;
    const isFunc = typeof when === 'function';
    if (isFunc ? when(position) : when) {
      partition = oneOrEnum;
    }
  }

  return partition;
}

const log = (partition, position0, position1) => {
  const active0 = activePartition(partition, position0);
  const active1 = activePartition(partition, position1);

  const name = 'an empty state';
  const name0 = active0 ? getDisplayName(active0.show) : name;
  const name1 = active1 ? getDisplayName(active1.show) : name;

  console.log(`${name0} --> ${name1}`);
}

const partitionOn = (oneOrEnum) => {
  return (position) => {
    const partition = activePartition(oneOrEnum, position);
    return partition ? render(partition, position) : null;
  };
};

export { log };
export default partitionOn;
