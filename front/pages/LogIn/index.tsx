import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  // SWR
  // revalidate : 내가 원할떄 SWR 함수를 호출하게 하는 함수
  // dedupingInterval 기본은 2초로 되어있어서 2초에 한번씩 서버에 요청 보낸다. 설정한 기간 내라면 서버에 요청을 보내지 않고 캐시에서 가져온다. 빈번하면 서버에 무리가 많이 갑니다.
  // errorRetryInterval 에러가 났을 때 retry 하는 간격
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          revalidate();
          // mutate(response.data, false);
          // shouldRevalidate(두번쨰 인자가 true면)Optimistic UI - 서버 요청이 성공할 거라고 예상하고 행동하는 것, 서버 요청이 실패하면 행동을 취소한다.
          // mutate : 이미 내가 가지고 있는 데이터로 데이터를 바꾸는거
          // revalidate(); -> 서버에 요청을 다시 보내서 정보를 가져오는거
          // useSWR 함수가 다시 실행되고 data에 내 정보가 들어있으면 리렌더링 밑의 if(data)에서 Redirect
          // revalidate해서 data나 error의 데이터가 바뀌면 알아서 이 컴포넌트가 리렌더링된다.
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );
  console.log('data1', userData);
  // 로딩중
  if (userData === undefined) {
    return <div>로딩중...</div>;
  }

  if (userData) {
    //data에 내 정보가 담기면 redirect
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }
  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
        {/* a href -> 새로고침을 한다. Link to는 새로고침없이 화면전환 */}
      </LinkContainer>
    </div>
  );
};

export default LogIn;
