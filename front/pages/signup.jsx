import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { END } from 'redux-saga';
import axios from 'axios';
import wrapper from '../store/configureStore';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const ErrorMessage = styled.div`
	color: red;
`;

const Signup = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { signUploading, signUpDone, signUpError, me } = useSelector(state => state.user);

	const [input, onChangeInput] = useInput({
		email: '',
		password: '',
		nickname: '',
	});

	const [passwordCheck, setPasswordCheck] = useState('');
	const [isValid, setIsValid] = useState(true);
	const [term, setTerm] = useState(false);
	const [termValid, setTermValid] = useState(true);

	useEffect(() => {
		if (me) {
			router.replace('/');
		}
	}, [me]);

	useEffect(() => {
		if (signUpDone) {
			router.push('/');
		}
	}, [signUpDone]);

	useEffect(() => {
		if (signUpError) {
			alert(signUpError);
		}
	}, [signUpError]);
	const onChangeTerm = e => {
		setTerm(e.target.checked);
		setTermValid(!term);
	};
	const onChangePassword = useCallback(
		e => {
			setPasswordCheck(e.target.value);
			setIsValid(e.target.value === input.password);
		},
		[input],
	);

	const onSubmit = useCallback(() => {
		if (!term) {
			return setTermValid(false);
		}
		if (input.password !== passwordCheck) {
			return setIsValid(false);
		}
		dispatch({
			type: SIGN_UP_REQUEST,
			payload: input,
		});
		return null;
	}, [term, input, passwordCheck, dispatch]);

	return (
		<>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<AppLayout>
				<Form onFinish={onSubmit}>
					<div>
						<label htmlFor="nickname">닉네임</label>
						<br />
						<Input name="nickname" value={input.nickname} required onChange={onChangeInput} />
					</div>
					<div>
						<label htmlFor="email">이메일</label>
						<br />
						<Input
							name="email"
							type="email"
							value={input.eamil}
							required
							onChange={onChangeInput}
						/>
					</div>
					<div>
						<label htmlFor="password">비밀번호</label>
						<Input
							name="password"
							type="password"
							value={input.password}
							required
							onChange={onChangeInput}
						/>
					</div>
					<div>
						<label htmlFor="passwordCheck">비밀번호 체크</label>
						<Input
							name="passwordCheck"
							type="password"
							value={passwordCheck}
							required
							onChange={onChangePassword}
						/>
						{!isValid && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
					</div>
					<div>
						<Checkbox checked={term} onChange={onChangeTerm} />
						{!termValid && <ErrorMessage> 약관에 동의하셔야 합니다.</ErrorMessage>}
					</div>
					<div style={{ marginTop: 10 }}>
						<Button type="primary" htmlType="submit" laoding={signUploading}>
							가입하기
						</Button>
					</div>
				</Form>
			</AppLayout>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {
	const cookie = req?.headers.cookie;
	axios.defaults.headers.Cookie = ''; // 요청이 들어올 때마다 초기화 시켜주는 것이다. 여기는 클라이언트 서버에서 실행되므로 이전 요청이 남아있을 수 있기 때문이다
	if (req && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}
	store.dispatch({
		type: LOAD_MY_INFO_REQUEST,
	});
	store.dispatch({
		type: LOAD_POSTS_REQUEST,
	});
	store.dispatch(END);
	await store.sagaTask.toPromise();
});

export default Signup;
