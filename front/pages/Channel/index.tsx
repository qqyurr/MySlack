import Workspace from '@layouts/Workspace';
import React, { FC, Props } from 'react';
import { Container, Header, DragOver } from './styles';

const Channel: FC = () => {
  return (
    <Container>
      <Header>헤더</Header>
    </Container>
  );
};
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 Workspace의 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
export default Channel;
