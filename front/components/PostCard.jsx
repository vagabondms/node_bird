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
import FollowButton from './FollowButton';

import {
	removePostRequest,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST,
	RETWEET_REQUEST,
} from '../reducers/post';

function PostCard({ post }) {
	const [commentFormOpened, setCommentFormOpened] = useState(false);
	const dispatch = useDispatch();
	const id = useSelector(state => state.user.me?.id);
	const { removePostLoading } = useSelector(state => state.post);

	const onLike = useCallback(() => {
		if (!id) {
			return alert('로그인 해주세요');
		}
		return dispatch({ type: LIKE_POST_REQUEST, payload: post.id });
	}, [id]);

	const onUnlike = useCallback(() => {
		if (!id) {
			return alert('로그인 해주세요');
		}
		return dispatch({ type: UNLIKE_POST_REQUEST, payload: post.id });
	}, [id]);

	const onClickComment = useCallback(() => {
		if (!id) {
			return alert('로그인 해주세요');
		}
		return setCommentFormOpened(state => !state);
	}, [setCommentFormOpened, id]);

	const onClickDelete = useCallback(() => {
		if (!id) {
			return alert('로그인 해주세요');
		}
		dispatch(removePostRequest({ postId: post.id }));
	}, [dispatch, post, id]);

	const onRetweet = useCallback(() => {
		if (!id) {
			return alert('로그인 해주세요');
		}
		return dispatch({
			type: RETWEET_REQUEST,
			payload: post.id,
		});
	}, [id]);

	return (
		<div>
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
					<RetweetOutlined key="retweet" onClick={onRetweet} />,
					post.Likers.find(el => el.id === id) ? (
						<HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
					) : (
						<HeartOutlined key="heart" onClick={onLike} />
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
				title={post.Retweet ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null}
				extra={id && post.UserId !== id && <FollowButton post={post} />}
			>
				{post.RetweetId && post.Retweet ? (
					<Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
						<Card.Meta
							avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
							title={post.Retweet.User.nickname}
							description={<PostCardContent postData={post.Retweet.content} />}
						/>
					</Card>
				) : (
					<Card.Meta
						avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
						title={post.User.nickname}
						description={<PostCardContent postData={post.content} />}
					/>
				)}
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
		</div>
	);
}

PostCard.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number,
		User: PropTypes.object,
		UserId: PropTypes.number,
		content: PropTypes.string,
		createdAt: PropTypes.string,
		Comments: PropTypes.arrayOf(PropTypes.object),
		Images: PropTypes.arrayOf(PropTypes.object),
		Likers: PropTypes.array,
		RetweetId: PropTypes.number,
		Retweet: PropTypes.objectOf(PropTypes.any),
	}).isRequired,
};

export default PostCard;
