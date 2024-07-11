import React from 'react';
import { Flex, View, Grid, useProvider } from '@adobe/react-spectrum';
import { Outlet } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import BottomInput from './BottomInput';
import MainCanvas from './MainCanvas';

const BasicLayout = () => {
  const { direction } = useProvider();
  y
  return (
    <Grid
      areas={['header header', 'leftMenu mainContent', 'bottomInput bottomInput']}
      columns={['size-3000', 'auto']}
      rows={['size-1000', 'auto', 'size-1000']}
      height="100vh"
      gap="size-100"
    >
      <View gridArea="header" backgroundColor="gray-200" padding="size-100">
        {/* Header content */}
      </View>
      <View gridArea="leftMenu" backgroundColor="gray-100">
        <LeftMenu />
      </View>
      <View gridArea="mainContent" backgroundColor="gray-50" padding="size-100">
        <MainCanvas />
        <Outlet />
      </View>y
      <View gridArea="bottomInput" backgroundColor="gray-200" padding="size-100">
        <BottomInput />
      </View>
    </Grid>
  );
};

export default BasicLayout;
