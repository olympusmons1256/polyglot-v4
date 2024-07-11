import React, { useState, useMemo } from 'react';
import { Flex, View, Text, Heading, ListView, Item, ActionButton } from '@adobe/react-spectrum';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import { useDragAndDrop } from '@react-spectrum/dnd';

const MenuSection = ({ title, items, onItemSelected }) => {
  const [dragState, setDragState] = useState([]);

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map(key => ({ 'text/plain': items[key].text })),
    onReorder: (e) => {
      const newItems = [...items];
      const draggedItem = newItems.splice(e.draggedKeys[0], 1)[0];
      newItems.splice(e.insertIndex, 0, draggedItem);
      setDragState(newItems);
    },
  });

  const displayedItems = dragState.length > 0 ? dragState : items;

  return (
    <View marginY="size-200">
      <Heading level={3}>{title}</Heading>
      <ListView
        items={displayedItems}
              aria-label={`${title} menu items`}
        dragAndDropHooks={dragAndDropHooks}
        selectionMode="none"
      >
        {(item) => (
          <Item key={item.id} textValue={item.text}>
            <Flex alignItems="center" gap="size-100">
              <DragHandle aria-label="Drag handle" />
              <View backgroundColor="gray-200" padding="size-50" borderRadius="small">
                <Text>{item.type}</Text>
              </View>
              <Text flex>{item.text}</Text>
              <ActionButton
                isQuiet
                onPress={() => onItemSelected(item.id)}
                aria-label={item.selected ? "Remove from canvas" : "Add to canvas"}
              >
                <CheckmarkCircle color={item.selected ? "green-500" : "gray-500"} />
              </ActionButton>
            </Flex>
          </Item>
        )}
      </ListView>
    </View>
  );
};

const LeftMenu = () => {
  const [sections, setSections] = useState({
    Entity: [
      { id: 'e1', text: 'Customers', type: 'entity', selected: false },
      { id: 'e2', text: 'Products', type: 'entity', selected: false },
      { id: 'e3', text: 'Orders', type: 'entity', selected: false },
    ],
    Layout: [
      { id: 'l1', text: 'Grid', type: 'layout', selected: false },
      { id: 'l2', text: 'List', type: 'layout', selected: false },
      { id: 'l3', text: 'Card', type: 'layout', selected: false },
    ],
    People: [
      { id: 'p1', text: 'Users', type: 'people', selected: false },
      { id: 'p2', text: 'Groups', type: 'people', selected: false },
      { id: 'p3', text: 'Roles', type: 'people', selected: false },
    ],
  });

  const handleItemSelected = (sectionTitle, itemId) => {
    setSections(prev => ({
      ...prev,
      [sectionTitle]: prev[sectionTitle].map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    }));
  };

  return (
    <Flex direction="column" height="100%">
      {Object.entries(sections).map(([title, items]) => (
        <MenuSection 
          key={title} 
          title={title} 
          items={items} 
          onItemSelected={(itemId) => handleItemSelected(title, itemId)} 
        />
      ))}
    </Flex>
  );
};

export default LeftMenu;


