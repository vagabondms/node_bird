import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';

import wrapper from '../store/configureStore';
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

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {
	const cookie = req?.headers.cookie;
	axios.defaults.headers.Cookie = ''; // 요청이 들어올 때마다 초기화 시켜주는 것이다. 여기는 클라이언트 서버에서 실행되므로 이전 요청이 남아있을 수 있기 때문이다
	if (req && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}
	store.dispatch({
		type: LOAD_MY_INFO_REQUEST,
	});
	store.dispatch({
		type: LOAD_POSTS_REQUEST,
	});
	store.dispatch(END);
	await store.sagaTask.toPromise();
});

export default Home;
