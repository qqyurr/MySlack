import Workspace from '@layouts/Workspace';
import React, { FC, Props, useCallback } from 'react';
import { Container, Header, DragOver } from './styles';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const Channel: FC = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);
  return (
    <Container>
      <Header>헤더</Header>
      {/* <ChatList /> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 Workspace의 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
export default Channel;
