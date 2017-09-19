import React from 'react';

// import SFCClassic from './example-components/SimpleSFC/Classic';
// import SFCPartitioned from './example-components/SimpleSFC/Partitioned';

import EnumClassic from './example-components/Enum/EnumClassic';
import EnumPartitioned from './example-components/Enum/EnumPartitioned';

const App = () =>
  <div className="application">
    <div>
      <h5>Partitioned</h5>
      <Card>
        <EnumPartitioned />
      </Card>
    </div>
    <div>
      <h5>Classic</h5>
      <Card>
        <EnumClassic />
      </Card>
    </div>
  </div>;

const Card = ({ children }) => {
  return (
    <div
      style={{
        margin: 20,
        padding: 20,
        border: '1px solid lightgray',
        borderRadius: 5
      }}
    >
      {children}
    </div>
  );
};

export default App;
