import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FollowList from '../components/followList';

import NicknameEditForm from '../components/NicknameEditForm';
import AppLayout from '../components/AppLayout';

import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';

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

export default Profile;
