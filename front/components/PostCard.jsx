import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Popover, Avatar, List, Comment } from 'antd';
import {
	MessageOutlined,
	RetweetOutlined,
	HeartOutlined,
	EllipsisOutlined,
	HeartTwoTone,
} from '@ant-design/icons';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';

import { removePostRequest } from '../reducers/post';

function PostCard({ post }) {
	const [liked, setLiked] = useState(false);
	const [commentFormOpened, setCommentFormOpened] = useState(false);

	const dispatch = useDispatch();
	const id = useSelector(state => state.user.me?.id);
	const { removePostLoading } = useSelector(state => state.post.removePostLoading);
	const onClickHeart = useCallback(() => {
		setLiked(state => !state);
	}, [setLiked]);

	const onClickComment = useCallback(() => {
		setCommentFormOpened(state => !state);
	}, [setCommentFormOpened]);

	const onClickDelete = useCallback(() => {
		dispatch(removePostRequest({ userId: id, postId: post.id }));
	}, [dispatch, post, id]);

	return (
		<div>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key="retweet" />,
					liked ? (
						<HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onClickHeart} />
					) : (
						<HeartOutlined key="heart" onClick={onClickHeart} />
					),
					<MessageOutlined key="comment" onClick={onClickComment} />,
					<Popover
						key="more"
						content={
							<Button.Group>
								{id && post.User.id === id ? (
									<>
										<Button>수정</Button>
										<Button onClick={onClickDelete} loading={removePostLoading} type="danger">
											삭제
										</Button>
									</>
								) : (
									<Button>신고</Button>
								)}
							</Button.Group>
						}
					>
						<EllipsisOutlined />
					</Popover>,
				]}
			>
				<Card.Meta
					avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
					title={post.User.nickname}
					description={<PostCardContent postData={post.content} />}
				/>
			</Card>
			{commentFormOpened && (
				<div>
					<CommentForm post={post} />
					<List
						header={`${post.Comments.length}개의 댓글`}
						itemLayout="horizontal"
						dataSource={post.Comments}
						renderItem={item => (
							<li>
								<Comment
									author={item.User.nickname}
									avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
									content={item.content}
								/>
							</li>
						)}
					/>
				</div>
			)}
			{/* <CommentForm /> */}
			{/* <Comments /> */}
		</div>
	);
}

PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.string,
		User: PropTypes.object,
		content: PropTypes.string,
		createdAt: PropTypes.object,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default PostCard;
