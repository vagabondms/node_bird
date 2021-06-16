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
	const { mainPosts, hasMorePosts, loadPostLoading } = useSelector(state => state.post);
	// const timer = useRef();

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
					dispatch({
						type: LOAD_POSTS_REQUEST,
					});
				}
			}
		};
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [hasMorePosts, loadPostLoading]);

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
