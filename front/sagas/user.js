import axios from 'axios';
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';

import {
	LOAD_FOLLOWERS_REQUEST,
	LOAD_FOLLOWERS_SUCCESS,
	LOAD_FOLLOWERS_FAILURE,
	LOAD_FOLLOWINGS_REQUEST,
	LOAD_FOLLOWINGS_SUCCESS,
	LOAD_FOLLOWINGS_FAILURE,
	CHANGE_NICKNAME_FAILURE,
	CHANGE_NICKNAME_REQUEST,
	CHANGE_NICKNAME_SUCCESS,
	FOLLOW_FAILURE,
	FOLLOW_REQUEST,
	FOLLOW_SUCCESS,
	LOAD_MY_INFO_FAILURE,
	LOAD_MY_INFO_REQUEST,
	LOAD_MY_INFO_SUCCESS,
	LOG_IN_FAILURE,
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	SIGN_UP_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	UNFOLLOW_FAILURE,
	UNFOLLOW_REQUEST,
	UNFOLLOW_SUCCESS,
	REMOVE_FOLLOWER_REQUEST,
	REMOVE_FOLLOWER_SUCCESS,
	REMOVE_FOLLOWER_FAILURE,
} from '../reducers/user';

function loadUserAPI() {
	return axios.get('/user');
}

function* loadUser(action) {
	try {
		const result = yield call(loadUserAPI, action.data);

		yield put({ type: LOAD_MY_INFO_SUCCESS, payload: result.data });
	} catch (err) {
		yield put({
			type: LOAD_MY_INFO_FAILURE,
			error: err.response.data,
		});
	}
}

function followAPI(payload) {
	return axios.patch(`/user/${payload}/follow`);
}

function* follow(action) {
	try {
		const result = yield call(followAPI, action.payload);

		yield put({ type: FOLLOW_SUCCESS, payload: result.data });
	} catch (err) {
		yield put({
			type: FOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function unfollowAPI(payload) {
	return axios.delete(`/user/${payload}/follow`);
}

function* unfollow(action) {
	try {
		const result = yield call(unfollowAPI, action.payload);

		yield put({ type: UNFOLLOW_SUCCESS, payload: result.data });
	} catch (err) {
		yield put({
			type: UNFOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function logInAPI(payload) {
	return axios.post('/user/login', payload);
}

function* logIn(action) {
	try {
		const result = yield call(logInAPI, action.payload);
		yield put({ type: LOG_IN_SUCCESS, payload: result.data });
	} catch (err) {
		yield put({
			type: LOG_IN_FAILURE,
			error: err.response.data,
		});
	}
}

function logOutAPI() {
	return axios.get('/user/logout');
}

function* logOut() {
	try {
		yield call(logOutAPI);
		yield put({
			type: LOG_OUT_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: LOG_OUT_FAILURE,
			error: err.response.data,
		});
	}
}

function signUpAPI(payload) {
	return axios.post('/user', payload);
}
function* signUp(action) {
	try {
		yield call(signUpAPI, action.payload);

		yield put({
			type: SIGN_UP_SUCCESS,
		});
	} catch (err) {
		yield put({
			type: SIGN_UP_FAILURE,
			error: err.response.data,
		});
	}
}

function changeNicknameAPI(payload) {
	return axios.patch('/user/nickname', { nickname: payload });
}
function* changeNickname(action) {
	try {
		const result = yield call(changeNicknameAPI, action.payload);
		yield put({
			type: CHANGE_NICKNAME_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: CHANGE_NICKNAME_FAILURE,
			error: err.response.data,
		});
	}
}

function loadFollowersAPI() {
	return axios.get('/user/followers');
}
function* loadFollowers() {
	try {
		const result = yield call(loadFollowersAPI);
		yield put({
			type: LOAD_FOLLOWERS_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_FOLLOWERS_FAILURE,
			error: err.response.data,
		});
	}
}

function loadFollowingsAPI() {
	return axios.get('/user/followings');
}
function* loadFollowings() {
	try {
		const result = yield call(loadFollowingsAPI);
		yield put({
			type: LOAD_FOLLOWINGS_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_FOLLOWINGS_FAILURE,
			error: err.response.data,
		});
	}
}

function removeFollowerAPI(payload) {
	return axios.delete(`/user/follower/${payload}`);
}
function* removeFollower(action) {
	try {
		const result = yield call(removeFollowerAPI, action.payload);
		yield put({
			type: REMOVE_FOLLOWER_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: REMOVE_FOLLOWER_FAILURE,
			error: err.response.data,
		});
	}
}

function* watchLoadUser() {
	yield takeLatest(LOAD_MY_INFO_REQUEST, loadUser);
}

function* watchFollow() {
	yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
	yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
	yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
	yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
	yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchChangeNickname() {
	yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowers() {
	yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
	yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchRemoveFollower() {
	yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
	yield all([
		fork(watchLoadUser),
		fork(watchLogIn),
		fork(watchLogOut),
		fork(watchSignUp),
		fork(watchFollow),
		fork(watchUnfollow),
		fork(watchChangeNickname),
		fork(watchLoadFollowings),
		fork(watchLoadFollowers),
		fork(watchRemoveFollower),
	]);
}
