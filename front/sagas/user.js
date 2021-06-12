// import axios from "axios";
import axios from 'axios';
import { all, fork, delay, put, takeLatest, call } from 'redux-saga/effects';

import {
	FOLLOW_FAILURE,
	FOLLOW_REQUEST,
	FOLLOW_SUCCESS,
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
// import axios from "axios";

// function logInAPI(data) {
//   return axios.post("/api/login", data);
// }

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

function* logIn(action) {
	try {
		// const result = yield call(logInAPI, action.data);
		yield delay(1000);

		yield put({ type: LOG_IN_SUCCESS, payload: action.data });
	} catch (err) {
		yield put({
			type: LOG_IN_FAILURE,
			error: err.response.data,
		});
	}
}

// function logOutAPI() {
//   return axios.post("/api/logout");
// }

function* logOut() {
	try {
		yield delay(1000);
		// const result = yield call(logOutAPI);
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

// function signUpAPI() {
//   return axios.post("/api/logout:")
// }
function signUpAPI(payload) {
	return axios.post('http://localhost:4000/user', payload);
}
function* signUp(action) {
	try {
		console.log(action);
		const result = yield call(signUpAPI, action.payload);

		yield put({
			type: SIGN_UP_SUCCESS,
		});
	} catch (err) {
		console.log(err);
		// yield put({
		// 	type: SIGN_UP_FAILURE,
		// 	error: err.response.data,
		// });
	}
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
		fork(watchLogIn),
		fork(watchLogOut),
		fork(watchSignUp),
		fork(watchFollow),
		fork(watchUnfollow),
	]);
}
