import React from 'react';

const getDisplayName = (Comp) => {
  if (!Comp) return 'UndefinedComp';

  return Comp.displayName
    || Comp.name
    || 'Unknown'
};

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

const reduce = (partitions, position) => {
  const indices = allActive(partitions, position);
  const active = indices.length > 0 ? partitions[indices[0]] : undefined;

  if (indices.length === 0) {
    console.warn('Could not find partition for position: ', position);
  } else if (indices.length > 1) {
    console.group();
    console.warn("More than one 'when' function returned true. Defaulting to the first.");
    indices.forEach((i) => {
      const Comp = partitions[i].show;
      console.log(`${i} ${getDisplayName(Comp)}`);
    });
    console.groupEnd();
  }

  return active ? render(active, position) : null;
}

const stateful = (instance, partitions) => {
  return () => reduce(partitions, { props: instance.props, state: instance.state, self: instance })
}

const sfc = (partitions, name) => {
  const PhotonicSFC = (props) => reduce(partitions, { props });
  if (name) {
    PhotonicSFC.displayName = name;
  }
  return PhotonicSFC;
}

export { reduce, sfc, stateful };
