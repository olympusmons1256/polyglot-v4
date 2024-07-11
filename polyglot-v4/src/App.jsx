import React from 'react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { DragAndDrop } from '@react-spectrum/dnd';
import BasicLayout from './components/BasicLayout';

const App = () => {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <DragAndDrop>
        <BasicLayout />
      </DragAndDrop>
    </Provider>
  );
};

export default App;
