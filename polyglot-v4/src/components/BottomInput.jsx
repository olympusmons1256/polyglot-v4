import React from 'react';
import { Flex, TextField, Button } from '@adobe/react-spectrum';

const BottomInput = () => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = () => {
    console.log('Submitted:', inputValue);
    setInputValue('');
  };

  return (
    <Flex direction="row" gap="size-100" alignItems="end">
      <TextField
        flex
        label="User Input"
        value={inputValue}
        onChange={setInputValue}
      />
      <Button variant="cta" onPress={handleSubmit}>Submit</Button>
    </Flex>
  );
};

export default BottomInput;
