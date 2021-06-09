import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';
import { addCommentRequest } from '../reducers/post';

function CommentForm({ post }) {
	const dispatch = useDispatch();
	const userId = useSelector(state => state.user.me?.id);
	const { addCommentLoading, addCommentDone } = useSelector(state => state.post);
	const [input, onChangeInput, setInput] = useInput({
		commentText: '',
	});

	useEffect(() => {
		if (addCommentDone) {
			setInput({
				commentText: '',
			});
		}
	}, [addCommentDone, setInput]);

	const onSubmitComment = useCallback(() => {
		dispatch(addCommentRequest({ content: input.commentText, postId: post.id, userId }));
	}, [userId, input, post, dispatch]);
	return (
		<Form onFinish={onSubmitComment}>
			<Form.Item style={{ position: 'relative', margin: 0 }}>
				<Input.TextArea
					value={input.commentText}
					name="commentText"
					onChange={onChangeInput}
					rows={4}
				/>
				<Button
					loading={addCommentLoading}
					style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
					type="primary"
					htmlType="submit"
				>
					삐약
				</Button>
			</Form.Item>
		</Form>
	);
}

CommentForm.propTypes = {
	post: PropTypes.object.isRequired,
};

export default CommentForm;
