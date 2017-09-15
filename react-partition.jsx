import React from 'react';

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

const partitionOn = (position) => {
  return (oneOrEnum) => {
    const partition = activePartition(oneOrEnum, position);
    return partition ? render(partition, position) : undefined;
  };
};

export default partitionOn;
