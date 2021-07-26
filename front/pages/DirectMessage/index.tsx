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
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
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
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  // 40
  // 20 + 20 + 5 -> isEmpty 가 false
  // 더 이상 가져올 정보 없으므로 isReachingEnd 는 true
  const isEmpty = chatData?.[0]?.length === 0; // 데이터가 비어있다.
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // optimistic UI
      // 서버 쪽에 갔다오지 않았지만 성공해서 갔다온것처럼 미리 만들어놔야합니다.
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            // DM 객체
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat(''); // 채팅 등록된 이후 채팅창에 있던 글자 지우기
          scrollbarRef.current?.scrollToBottom(); // 채팅 치고 나서 제일 밑으로
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate(); // 채팅 받아온 다음에 채팅이 등록되게
          })
          .catch(console.error);
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );
  // 로딩시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  // 정보가 없다면
  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 Workspace의 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
export default DirectMessage;
