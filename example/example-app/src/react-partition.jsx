import React from 'react';

const render = (partition, self) => {
  const { test, reduce, Comp } = partition;
  const { props, state } = self;
  if (test({ props, state, self })) {
    const subProps = reduce({ props, state, self });
    return <Comp {...subProps} />;
  } else {
    return undefined;
  }
};

const processEnum = (partitions, self) => {
  for (let idx in partitions) {
    const rendered = render(partitions[idx], self);
    if (rendered) return rendered;
  }
  console.warn('Did not find component to render from partition set: ', partitions);
  return undefined;
}

const partitionOn = (self) => {
  return (partition) => {
    return Array.isArray(partition) ?
      processEnum(partition, self)
      :
      render(partition, self);
  };
};

export default partitionOn;
