import React from 'react';

// import EnumClassic from './example-components/Enum/EnumClassic';
import EnumPartitioned from './example-components/Enum/EnumPartitioned';

// import SFCPartitioned from './example-components/SimpleSFC/Partitioned';

const App = () =>
  <div className="application">
    <Card>
      <EnumPartitioned />
    </Card>
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
