import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const LogIn = () => {
  const queryClient = useQueryClient();
  const { isLoading, isSuccess, status, isError, data, error } = useQuery('user', () =>
    fetcher({ queryKey: '/api/users' }),
  );
  // const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);
  const mutation = useMutation<IUser, AxiosError, { email: string; password: string }>(
    'user',
    (data) =>
      axios
        .post('/api/users/login', data, {
          withCredentials: true,
        })
        .then((response) => response.data),
    {
      onMutate() {
        setLogInError(false);
      },
      onSuccess() {
        queryClient.refetchQueries('user');
      },
      onError(error) {
        setLogInError(error.response?.data?.code === 401);
      },
    },
  );

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      mutation.mutate({ email, password });
    },
    [email, password, mutation],
  );

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (data) {
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
      </LinkContainer>
    </div>
  );
};

export default LogIn;
