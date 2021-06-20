import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';

import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
	const dispatch = useDispatch();
	const { me } = useSelector(state => state.user);
	const { mainPosts, hasMorePosts, loadPostLoading, retweetError } = useSelector(
		state => state.post,
	);

	useEffect(() => {
		if (retweetError) {
			alert(retweetError);
		}
	}, [retweetError]);

	useEffect(() => {
		dispatch({
			type: LOAD_MY_INFO_REQUEST,
		});
	}, []);

	useEffect(() => {
		dispatch({
			type: LOAD_POSTS_REQUEST,
		});
	}, [dispatch]);

	useEffect(() => {
		const onScroll = () => {
			if (
				Math.max(
					document.body.scrollHeight,
					document.documentElement.scrollHeight,
					document.body.offsetHeight,
					document.documentElement.offsetHeight,
					document.body.clientHeight,
					document.documentElement.clientHeight,
				) -
					300 <
				window.pageYOffset + document.documentElement.clientHeight
			) {
				if (hasMorePosts && !loadPostLoading) {
					const lastId = mainPosts[mainPosts.length - 1]?.id;
					dispatch({
						type: LOAD_POSTS_REQUEST,
						lastId,
					});
				}
			}
		};
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [hasMorePosts, loadPostLoading, mainPosts]);

	return (
		<AppLayout>
			{me && <PostForm />}
			{mainPosts.map(post => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

export default Home;
