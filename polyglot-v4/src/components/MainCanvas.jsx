import React, { useState } from 'react';
import { Flex, View, Text, Heading, ActionButton } from '@adobe/react-spectrum';
import Move from '@spectrum-icons/workflow/Move';

const DropContainer = ({ id, children, index, moveContainer }) => {
  return (
    <View
      backgroundColor="gray-50"
      borderColor="blue-500"
      borderWidth="thin"
      borderRadius="medium"
      padding="size-100"
      height="size-3000"
      width="size-3000"
      marginX="size-100"
    >
      <Flex direction="column" gap="size-100">
        <Flex alignItems="center" gap="size-100">
          <Heading level={3}>Container {id}</Heading>
          <ActionButton onPress={() => moveContainer(index, index - 1)} isQuiet><Move /></ActionButton>
          <ActionButton onPress={() => moveContainer(index, index + 1)} isQuiet><Move /></ActionButton>
        </Flex>
        {children}
      </Flex>
    </View>
  );
};

const MainCanvas = () => {
  const [containers, setContainers] = useState([
    { id: 1, content: 'Container 1' },
    { id: 2, content: 'Container 2' },
    { id: 3, content: 'Container 3' },
  ]);

  const moveContainer = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= containers.length) return;
    setContainers(prev => {
      const newContainers = [...prev];
      const [movedContainer] = newContainers.splice(fromIndex, 1);
      newContainers.splice(toIndex, 0, movedContainer);
      return newContainers;
    });
  };

  return (
    <Flex direction="row" height="100%" wrap>
      {containers.map((container, index) => (
        <DropContainer
          key={container.id}
          id={container.id}
          index={index}
          moveContainer={moveContainer}
        >
          <Text>{container.content}</Text>
        </DropContainer>
      ))}
    </Flex>
  );
};

export default MainCanvas;
