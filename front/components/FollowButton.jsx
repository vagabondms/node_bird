import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

function FollowButton({ post }) {
	const dispatch = useDispatch();
	const { me, followLoading, unfollowLoading } = useSelector(state => state.user);
	const isFollowing = me?.Followings.find(v => v.id === post.User.id);
	const onClickButton = useCallback(() => {
		if (isFollowing) {
			dispatch({
				type: UNFOLLOW_REQUEST,
				payload: post.User.id,
			});
		} else {
			dispatch({
				type: FOLLOW_REQUEST,
				payload: post.User.id,
			});
		}
	});

	return (
		<Button onClick={onClickButton} loading={followLoading || unfollowLoading}>
			{isFollowing ? '언팔로우' : '팔로우'}
		</Button>
	);
}

FollowButton.propTypes = {
	post: PropTypes.object.isRequired,
};

export default FollowButton;
