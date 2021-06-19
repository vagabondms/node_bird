import { all, fork, takeLatest, put, throttle, call } from 'redux-saga/effects';
import axios from 'axios';

import {
	UPLOAD_IMAGES_REQUEST,
	UPLOAD_IMAGES_FAILURE,
	UPLOAD_IMAGES_SUCCESS,
	LIKE_POST_REQUEST,
	LIKE_POST_FAILURE,
	LIKE_POST_SUCCESS,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
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
} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function uploadImagesAPI(payload) {
	return axios.post(`/post/images`, payload); // formData는 그대로 넣어줘야함.
}

function* uploadImages(action) {
	try {
		const result = yield call(uploadImagesAPI, action.payload);
		yield put({
			type: UPLOAD_IMAGES_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: UPLOAD_IMAGES_FAILURE,
			payload: err.response.payload,
		});
	}
}

function likePostAPI(payload) {
	return axios.patch(`/post/${payload}/like`, payload);
}

function* likePost(action) {
	try {
		const result = yield call(likePostAPI, action.payload);
		yield put({
			type: LIKE_POST_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LIKE_POST_FAILURE,
		});
	}
}

function unlikePostAPI(payload) {
	return axios.delete(`/post/${payload}/like`);
}

function* unlikePost(action) {
	try {
		const result = yield call(unlikePostAPI, action.payload);
		yield put({
			type: UNLIKE_POST_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: UNLIKE_POST_FAILURE,
		});
	}
}

function loadPostsAPI(payload) {
	return axios.post('/posts', payload);
}

function* loadPosts(action) {
	try {
		const result = yield call(loadPostsAPI, action.payload);
		yield put({
			type: LOAD_POSTS_SUCCESS,
			payload: result.data,
		});
	} catch (err) {
		yield put({
			type: LOAD_POSTS_FAILURE,
		});
	}
}

function addPostAPI(payload) {
	return axios.post('/post', payload);
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

function removePostAPI(payload) {
	return axios.delete(`/post/${payload}`);
}

function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.payload.postId);
		yield put({
			type: REMOVE_POST_SUCCESS,
			payload: result.data,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			payload: result.data,
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

function* watchUploadImages() {
	yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadPostsRequest() {
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
		fork(watchUploadImages),
		fork(watchLikePost),
		fork(watchUnlikePost),
		fork(watchLoadPostsRequest),
		fork(watchAddPost),
		fork(watchAddComment),
		fork(watchRemovePost),
	]);
}
