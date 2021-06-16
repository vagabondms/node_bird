import axios from 'axios';
import { all, fork, delay, put, takeLatest, call } from 'redux-saga/effects';

import {
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

function* follow(action) {
	try {
		// const result = yield call(logInAPI, action.data);
		yield delay(1000);

		yield put({ type: FOLLOW_SUCCESS, payload: action.payload });
	} catch (err) {
		yield put({
			type: FOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function* unfollow(action) {
	try {
		// const result = yield call(logInAPI, action.data);
		yield delay(1000);
		yield put({ type: UNFOLLOW_SUCCESS, payload: action.payload });
	} catch (err) {
		yield put({
			type: UNFOLLOW_FAILURE,
			error: err.response.data,
		});
	}
}

function logInAPI(payload) {
	console.log(payload);
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

export default function* userSaga() {
	yield all([
		fork(watchLoadUser),
		fork(watchLogIn),
		fork(watchLogOut),
		fork(watchSignUp),
		fork(watchFollow),
		fork(watchUnfollow),
	]);
}
