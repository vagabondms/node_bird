import { all, fork, takeLatest, put, delay, throttle, call } from 'redux-saga/effects';
import axios from 'axios';

import {
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_FAILURE,
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,
	generateDummyPost,
} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// function addPostAPI(data) {
//   return axios.post("/api/addpost", data);
// }

function* loadPosts() {
	try {
		// yield delay(1000);
		yield put({
			type: LOAD_POSTS_SUCCESS,
			payload: generateDummyPost(10),
		});
	} catch (err) {
		yield put({
			type: LOAD_POSTS_FAILURE,
		});
	}
}

function addPostAPI(payload) {
	return axios.post('/post', { content: payload });
}

function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.payload);
		yield put({
			type: ADD_POST_SUCCESS,
			payload: result.data,
		});
		yield put({
			type: ADD_POST_TO_ME,
			payload: result.data.id,
		});
	} catch (err) {
		yield put({
			type: ADD_POST_FAILURE,
			payload: err.response.payload,
		});
	}
}

function* removePost(action) {
	try {
		yield delay(1000);
		// const result = yield call(addPostAPI, action.data);
		yield put({
			type: REMOVE_POST_SUCCESS,
			payload: action.payload.postId,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			payload: action.payload.postId,
		});
	} catch (err) {
		yield put({
			type: REMOVE_POST_FAILURE,
			payload: err.response.payload,
		});
	}
}

function addCommentAPI(payload) {
	return axios.post(`/post/${payload.postId}/comment`, payload);
}

function* addComment(action) {
	try {
		const result = yield call(addCommentAPI, action.payload);
		yield put({
			type: ADD_COMMENT_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: ADD_COMMENT_FAILURE,
			payload: err.response.payload,
		});
	}
}

function* loadPostsRequest() {
	yield throttle(500, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
	yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

export default function* postSaga() {
	yield all([
		fork(loadPostsRequest),
		fork(watchAddPost),
		fork(watchAddComment),
		fork(watchRemovePost),
	]);
}
