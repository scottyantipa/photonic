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

const firstActive = (partitions, position) => {
  for (const partition of partitions) {
    if (isActive(partition, position)) {
      return partition;
    }
  }
  return undefined;
}

const allActive = (partitions, position) => {
  return partitions.filter(p => isActive(p, position));
}

const reduce = (partitions, position) => {
  const reducer = process.env.NODE_ENV === 'production' ? reduceProd : reduceDev;
  return reducer(partitions, position);
}

const reduceProd = (partitions, position) => {
  const active = firstActive(partitions, position);
  return active ? render(active, position) : null;
}

const reduceDev = (partitions, position) => {
  const all = allActive(partitions, position)

  if (all.length === 0) {
    console.warn('Could not find partition for position: ', position);
  } else if (all.length > 1) {
    console.group();
    console.warn("More than one 'when' function returned true. Defaulting to the first.");
    all.forEach((partition, i) => {
      const Comp = partition.show;
      console.log(`${i} ${getDisplayName(Comp)}`);
    });
    console.groupEnd();
  }

  const active = all[0];
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
