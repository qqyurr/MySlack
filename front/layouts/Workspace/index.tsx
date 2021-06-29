import {
  Header,
  ProfileImg,
  ProfileModal,
  RightMenu,
  LogOutButton,
  WorkspaceButton,
  WorkspaceName,
  WorkspaceModal,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  Chats,
  MenuScroll,
} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, //2초, 캐시의 유지기간
    // dedupingInterval 기간 안에는 아무리 요청을 많이해도 서버로 요청가지 않고 첫번쨰 요청했을 때 들어온 response를 사용한다.
  });
  // SWR이 컴포넌트를 넘나들면서 전역 스토리지가 된다.

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true, // 쿠키 서로 공유하려면 세번째 자리에 withCredentials 필수
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname}></ProfileImg>
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
