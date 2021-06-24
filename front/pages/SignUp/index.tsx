import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Form, Label, Input, LinkContainer, Button, Header, Error, Success } from './styles';
import axios from 'axios';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  //비동기요청에서 then이나 catch에서 setState를 해서 state를 변경하는 경우 그 전에 초기화를 한 번 해주는게 좋습니다.
  // 요청보내기직전
  // 요청을 연달아 날릴 때 , 첫번째 요청때 남아있던 결과가 두번쨰 요청에도 남아있는 경우가 있기 때문에
  // 요청 별로 다른 결과를 보여주려면 , 초기화를 시켜주면 좋습니다.
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      if (!mismatchError) {
        console.log('서버로 회원가입하기');
        //로딩
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post('/api/users', { email, nickname, password }) // localhost 3095가 3095에게 보내는거
          // 3090에서 3095로 보내면 CORS 때문에 요청이 두번 갔다. 이렇게 바꾸면 같은 도메인끼리 요청한거라서 options 요청을 안보낸것
          // 백엔드 서버도 localhost 내 서버도 localhost일때 편하게 이렇게 proxy해서 CORS 에러 피해갈수있다.
          .then((response) => {
            //success
            console.log(response);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            //failure
            console.log(err.response);
            setSignUpError(err.response.data);
          })
          .finally(() => {}); //성공을하든 실패를 하든 이 코드는 실행
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
