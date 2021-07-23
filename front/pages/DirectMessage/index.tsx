import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/DirectMessage/styles';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
// import makeSection from '@utils/makeSection';
// import Scrollbars from 'react-custom-scrollbars';
// import useSocket from '@hooks/useSocket';
// import { DragOver } from '@pages/DirectMessage/styles';
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
  } = useSWR<IDM[]>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`, fetcher);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate(); // 채팅 받아온 다음에 채팅이 등록되게
            setChat('');
            // 채팅 등록된 이후 채팅창에 있던 글자 지우기
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  // 정보가 없다면
  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 Workspace의 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
export default DirectMessage;
