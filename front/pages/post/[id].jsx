import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

import wrapper from '../../store/configureStore';

import { LOAD_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Post = () => {
	const { singlePost } = useSelector(state => state.post);
	const router = useRouter();
	const { id } = router.query;

	return (
		<AppLayout>
			<Head>
				<title>
					{singlePost.User.nickname}
					님의 글
				</title>
				<meta name="description" content={singlePost.content} />
				<meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
				<meta property="og:description" content={singlePost.content} />
				<meta
					property="og:image"
					content={
						singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'
					}
				/>
				<meta property="og:url" content={`https://nodebird.com/post/${id}`} />
			</Head>

			<PostCard post={singlePost} />
		</AppLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, params }) => {
	const cookie = req?.headers.cookie;
	axios.defaults.headers.Cookie = ''; // 요청이 들어올 때마다 초기화 시켜주는 것이다. 여기는 클라이언트 서버에서 실행되므로 이전 요청이 남아있을 수 있기 때문이다
	if (req && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}

	store.dispatch({
		type: LOAD_MY_INFO_REQUEST,
	});
	store.dispatch({
		type: LOAD_POST_REQUEST,
		id: params.id,
	});
	store.dispatch(END);
	await store.sagaTask.toPromise();
});

export default Post;
