import React from 'react';
import { useGridList, useGridListItem } from '@react-aria/gridlist';
import { useListState } from '@react-stately/list';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import './LeftMenu.css';

const menuItems = [
  { id: '1', title: 'Dashboard', icon: '🏠' },
  { id: '2', title: 'Languages', icon: '🌐' },
  { id: '3', title: 'Practice', icon: '✏️' },
  { id: '4', title: 'Progress', icon: '📊' },
];

function GridListItem({ item, state }) {
  let ref = React.useRef();
  let { gridCellProps } = useGridListItem(
    { node: item },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      {...mergeProps(gridCellProps, focusProps)}
      ref={ref}
      className={`menu-item ${isFocusVisible ? 'focused-menu-item' : ''}`}
    >
      <span className="menu-item-icon" aria-hidden="true">{item.icon}</span>
      <span className="menu-item-text">{item.title}</span>
    </div>
  );
}

const LeftMenu = ({ navigation }) => {
  let state = useListState({
    items: menuItems,
    selectedKeys: new Set(['1']),
  });
  let listRef = React.useRef();
  let { gridProps } = useGridList({
    ...state,
    'aria-label': 'Menu',
    selectionMode: 'single',
    onSelectionChange: (keys) => {
      const selectedItem = menuItems.find(item => item.id === Array.from(keys)[0]);
      if (selectedItem) {
        navigation(selectedItem.title);
      }
    }
  }, state, listRef);

  return (
    <div className="left-menu-container">
      <h1 className="left-menu-title">Polyglot</h1>
      <div {...gridProps} ref={listRef} className="left-menu-grid">
        {[...state.collection].map((item) => (
          <GridListItem
            key={item.key}
            item={item}
            state={state}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftMenu;
