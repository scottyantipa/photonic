import React from 'react';

const render = (partition, props, state, self) => {
  const { when, withProps, show } = partition;
  const Comp = show;

  const isActive = when({ props, state, self });
  if (isActive) {
    const subProps = withProps({ props, state, self });
    return <Comp {...subProps} />;
  } else {
    return undefined;
  }
};

const processEnum = (partitions, props, state, self) => {
  for (let idx in partitions) {
    const rendered = render(partitions[idx], props, state, self);
    if (rendered) return rendered;
  }
  console.warn('Did not find component to render from partition set: ', partitions);
  return undefined;
}

const partitionOn = (props, state, self) => {
  return (partition) => {
    return Array.isArray(partition) ?
      processEnum(partition, props, state, self)
      :
      render(partition, props, state, self);
  };
};

export default partitionOn;
