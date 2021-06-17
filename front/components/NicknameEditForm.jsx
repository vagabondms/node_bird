import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';

import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
	const dispatch = useDispatch();
	const { me } = useSelector(state => state.user);
	const [inputs, onChangeInput] = useInput({ nickname: me?.nickname || '' });

	const onSubmit = useCallback(() => {
		dispatch({
			type: CHANGE_NICKNAME_REQUEST,
			payload: inputs.nickname,
		});
	}, [inputs]);

	return (
		<>
			<Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
				<Input.Search
					value={inputs.nickname}
					onChange={onChangeInput}
					name="nickname"
					addonBefore="닉네임"
					enterButton="수정"
					onSearch={onSubmit}
				/>
			</Form>
		</>
	);
};

export default NicknameEditForm;
