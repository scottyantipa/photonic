import React from 'react';

const getDisplayName = (Comp) => {
  if (!Comp) return 'UndefinedComp';

  return Comp.displayName
    || Comp.name
    || 'Unknown'
};

const render = (node, position) => {
  const { withProps, show } = node;
  const props = typeof withProps === 'function' ?
    withProps(position) : (withProps || {});
  const Comp = show;
  return <Comp {...props} />;
}

const evalNode = (node, position) => {
  if (Array.isArray(node.show)) {
    return reduce(node.show, position)
  } else {
    return render(node, position);
  }
};

const isActive = (node, position) => {
  const { when } = node;
  const isFunc = typeof when === 'function';
  return isFunc ? when(position) : when;
}

const firstActive = (tree, position) => {
  for (const node of tree) {
    if (isActive(node, position)) {
      return node;
    }
  }
  return undefined;
}

const allActive = (tree, position) => {
  return tree.filter(p => isActive(p, position));
}

const reduce = (tree, position) => {
  const reducer = process.env.NODE_ENV === 'production' ? reduceProd : reduceDev;
  return reducer(tree, position);
}

const reduceProd = (tree, position) => {
  const active = firstActive(tree, position);
  return active ? evalNode(active, position) : null;
}

const reduceDev = (tree, position) => {
  const all = allActive(tree, position)

  if (all.length === 0) {
    console.warn('Could not find node for position: ', position);
  } else if (all.length > 1) {
    console.group();
    console.warn("More than one 'when' function returned true. Defaulting to the first.");
    all.forEach((node, i) => {
      const Comp = node.show;
      console.log(`${i} ${getDisplayName(Comp)}`);
    });
    console.groupEnd();
  }

  const active = all[0];
  return active ? evalNode(active, position) : null;
}

const stateful = (instance, tree) => {
  return () => reduce(tree, { props: instance.props, state: instance.state, self: instance })
}

const sfc = (tree, name) => {
  const PhotonicSFC = (props) => reduce(tree, { props });
  if (name) {
    PhotonicSFC.displayName = name;
  }
  return PhotonicSFC;
}

export { reduce, sfc, stateful };
