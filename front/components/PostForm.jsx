import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';

import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
	const dispatch = useDispatch();
	const { addPostDone, addPostLoading, imagePaths } = useSelector(state => state.post);
	const imageInput = useRef();

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
		if (!input.content || !input.content.trim()) {
			return alert('게시글을 작성하세요.');
		}

		const formData = new FormData();
		imagePaths.forEach(el => {
			formData.append('image', el); /// 둘 다 text기 때문에 req.body.[...] 에 넣어주게 된다.
		});
		formData.append('content', input.content);
		return dispatch({
			type: ADD_POST_REQUEST,
			payload: formData,
		});
	}, [dispatch, input]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImages = useCallback(e => {
		const imageFormdata = new FormData();
		[].forEach.call(e.target.files, el => {
			imageFormdata.append('image', el);
		});
		dispatch({
			type: UPLOAD_IMAGES_REQUEST,
			payload: imageFormdata,
		});
	});

	const removeImage = useCallback(index => () => {
		dispatch({
			type: REMOVE_IMAGE,
			payload: index,
		});
	});

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
				<input
					type="file"
					name="image"
					multiple
					hidden
					ref={imageInput}
					onChange={onChangeImages}
				/>
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
				{imagePaths.map((x, i) => (
					<div key={x} style={{ display: 'inline-block' }}>
						<img src={`http://localhost:4000/${x}`} style={{ width: '200px' }} alt={x} />
						<div>
							<Button onClick={removeImage(i)}>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
