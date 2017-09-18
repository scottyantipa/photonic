import React from 'react';

const getDisplayName = (reactComponent) => {
  return reactComponent.displayName || reactComponent.name || 'Component';
};

const render = (partition, position) => {
  const { withProps, show } = partition;
  const Comp = show;
  const props = withProps(position);
  return <Comp {...props} />;
};

const processEnum = (partitions, position) => {
  for (let idx in partitions) {
    const partition = partitions[idx];
    if (partition.when(position)) {
      return partition;
    }
  }
  return undefined;
}

const activePartition = (oneOrEnum, position) => {
  let partition;

  if (Array.isArray(oneOrEnum)) {
    partition = processEnum(oneOrEnum, position);
    if (!partition) console.warn('Could not find partition in set: ', oneOrEnum, ' for: ', position);
  } else {
    if (oneOrEnum.when(position)) {
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
    return partition ? render(partition, position) : undefined;
  };
};

export { log };
export default partitionOn;
