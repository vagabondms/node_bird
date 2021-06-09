import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';

import { addPostRequest } from '../reducers/post';

const PostForm = () => {
	const dispatch = useDispatch();
	const { addPostDone, addPostLoading } = useSelector(state => state.post);
	const imageInput = useRef();
	const imagePaths = useSelector(state => state.post.imagePaths);
	const [input, onChangeInput, setInput] = useInput({
		content: '',
	});

	useEffect(() => {
		if (addPostDone) {
			setInput({
				content: '',
			});
		}
	}, [setInput, addPostDone]);

	const onSubmit = useCallback(() => {
		dispatch(addPostRequest(input.content));
	}, [dispatch, input]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);
	return (
		<Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
			<Input.TextArea
				name="content"
				value={input.content}
				onChange={onChangeInput}
				maxLength={140}
				placeholder="어떤 신기한 일이 있었나요?"
			/>
			<div>
				<input type="file" multiple hidden ref={imageInput} />
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				<Button
					loading={addPostLoading}
					type="primary"
					style={{ float: 'right' }}
					htmlType="submit"
				>
					쨱짹
				</Button>
			</div>
			<div>
				{imagePaths.map(x => (
					<div key={x} style={{ display: 'inline-block' }}>
						<img src={x} style={{ width: '200px' }} alt={x} />
						<div>
							<Button>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
