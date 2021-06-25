import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true, // 쿠키 서로 공유하려면 세번째 자리에 withCredentials 필수
      })
      .then(() => {
        revalidate();
      });
  }, []);
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
