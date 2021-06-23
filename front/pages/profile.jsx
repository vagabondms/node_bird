import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';
import FollowList from '../components/followList';
import wrapper from '../store/configureStore';
import NicknameEditForm from '../components/NicknameEditForm';
import AppLayout from '../components/AppLayout';
import {
	LOAD_MY_INFO_REQUEST,
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWINGS_REQUEST,
} from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const Profile = () => {
	const { me } = useSelector(state => state.user);
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({
			type: LOAD_FOLLOWERS_REQUEST,
		});
		dispatch({
			type: LOAD_FOLLOWINGS_REQUEST,
		});
	}, []);

	useEffect(() => {
		if (!me) {
			router.replace('/');
		}
	}, [me]);

	return (
		<>
			<Head>
				<title>profile</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header="팔로잉" data={me?.Followings} />
				<FollowList header="팔로워" data={me?.Followers} />
			</AppLayout>
		</>
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

export default Profile;
