import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';

import { logInRequestAction } from '../reducers/user';
import useInput from '../hooks/useInput';

const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

const FormWrapper = styled(Form)`
	margin-top: 10px;
`;

const LoginForm = () => {
	const [inputs, onChangeInputs] = useInput({
		email: '',
		passowrd: '',
	});

	const dispatch = useDispatch();
	const { logInLoading } = useSelector(state => state.user);

	const onSubmitForm = useCallback(() => {
		// 이렇게 되면 input이 바뀔 때를 제외하고 나머지를
		dispatch(logInRequestAction({ email: inputs.email, password: inputs.password }));
	}, [inputs, dispatch]);

	return (
		<FormWrapper onFinish={onSubmitForm}>
			<div>
				<label htmlFor="email">이메일</label>
				<br />
				<Input name="email" value={inputs.email} onChange={onChangeInputs} required />
			</div>
			<div>
				<label htmlFor="password">비밀번호</label>
				<br />
				<Input
					name="password"
					type="password"
					value={inputs.password}
					onChange={onChangeInputs}
					required
				/>
			</div>
			<ButtonWrapper>
				<Button type="primary" htmlType="submit" loading={logInLoading}>
					로그인
				</Button>
				<Link href="/signup">
					<a>
						<Button>회원가입</Button>
					</a>
				</Link>
			</ButtonWrapper>
		</FormWrapper>
	);
};

export default LoginForm;
