import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white', 
      fontSize: '24px',
      textAlign: 'center',
      margin: '20px',
      borderRadius: '8px'
    }}>
      TEST COMPONENT - IF YOU CAN SEE THIS, REACT IS WORKING
    </div>
  );
};

export default TestComponent; 