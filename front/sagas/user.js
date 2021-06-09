// import axios from "axios";
import { all, fork, delay, put, takeLatest } from 'redux-saga/effects';

import {
	LOG_IN_FAILURE,
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	SIGN_UP_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
} from '../reducers/user';
// import axios from "axios";

// function logInAPI(data) {
//   return axios.post("/api/login", data);
// }

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

function* signUp() {
	try {
		yield delay(1000);
		// const result = yield call(logOutAPI);
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
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)]);
}
