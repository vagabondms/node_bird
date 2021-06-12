import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST } from '../reducers/user';

const ErrorMessage = styled.div`
	color: red;
`;

const Signup = () => {
	const dispatch = useDispatch();
	const { signUploading } = useSelector(state => state.user);

	const [input, onChangeInput] = useInput({
		email: '',
		password: '',
		nickname: '',
	});

	const [passwordCheck, setPasswordCheck] = useState('');
	const [isValid, setIsValid] = useState(true);
	const [term, setTerm] = useState(false);
	const [termValid, setTermValid] = useState(true);

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
			data: input,
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

export default Signup;
