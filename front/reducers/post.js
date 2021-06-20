import produce from 'immer';

const initialState = {
	mainPosts: [],
	imagePaths: [],
	hasMorePosts: true, // 남은 데이터가 있는 지 확인
	retweetLoading: false,
	retweetDone: false,
	retweetError: null,
	likePostLoading: false,
	likePostDone: false,
	likePostError: null,
	unlikePostLoading: false,
	unlikePostDone: false,
	unlikePostError: null,
	loadPostLoading: false,
	loadPostDone: false,
	loadPostError: null,
	addPostLoading: false,
	addPostDone: false,
	addPostError: null,
	addCommentLoading: false,
	addCommentDone: false,
	addCommentError: null,
	removePostLoading: false,
	removePostDone: false,
	removePostError: null,
	uploadImagesLoading: false,
	uploadImagesDone: false,
	uploadImagesError: null,
};

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMME NT_FAILURE';

export const addPostRequest = payload => ({
	type: ADD_POST_REQUEST,
	payload,
});
export const removePostRequest = payload => ({
	type: REMOVE_POST_REQUEST,
	payload,
});

export const addCommentRequest = payload => ({
	type: ADD_COMMENT_REQUEST,
	payload,
});

const reducer = (state = initialState, action) =>
	produce(state, draft => {
		switch (action.type) {
			case REMOVE_IMAGE:
				draft.imagePaths.splice(action.payload, 1);
				break;

			case RETWEET_REQUEST:
				draft.retweetLoading = true;
				draft.retweetDone = false;
				draft.retweetError = null;
				break;

			case RETWEET_SUCCESS: {
				draft.retweetLoading = false;
				draft.retweetDone = true;
				draft.mainPosts.unshift(action.payload);
				break;
			}

			case RETWEET_FAILURE:
				draft.retweetLoading = false;
				draft.retweetError = action.payload;
				break;

			case UPLOAD_IMAGES_REQUEST:
				draft.uploadImagesLoading = true;
				draft.uploadImagesDone = false;
				draft.uploadImagesError = null;
				break;

			case UPLOAD_IMAGES_SUCCESS: {
				draft.uploadImagesLoading = false;
				draft.uploadImagesDone = true;
				draft.imagePaths = action.payload;
				break;
			}

			case UPLOAD_IMAGES_FAILURE:
				draft.uploadImagesLoading = false;
				draft.uploadImagesError = action.payload;
				break;

			case LIKE_POST_REQUEST:
				draft.likePostLoading = true;
				draft.likePostDone = false;
				draft.likePostError = null;
				break;

			case LIKE_POST_SUCCESS: {
				draft.likePostLoading = false;
				draft.likePostDone = true;
				const post = draft.mainPosts.find(el => el.id === action.payload.PostId);
				post.Likers.push({ id: action.payload.UserId });
				break;
			}

			case LIKE_POST_FAILURE:
				draft.likePostLoading = false;
				draft.likePostError = action.payload;
				break;

			case UNLIKE_POST_REQUEST:
				draft.unlikePostLoading = true;
				draft.unlikePostDone = false;
				draft.unlikePostError = null;
				break;

			case UNLIKE_POST_SUCCESS: {
				draft.unlikePostLoading = false;
				draft.unlikePostDone = true;
				const post = draft.mainPosts.find(el => el.id === action.payload.PostId);
				post.Likers = post.Likers.filter(el => el.id !== action.payload.UserId);
				break;
			}

			case UNLIKE_POST_FAILURE:
				draft.unlikePostLoading = false;
				draft.unlikePostError = action.payload;
				break;

			case LOAD_POSTS_REQUEST:
				draft.loadPostLoading = true;
				draft.loadPostDone = false;
				draft.loadPostError = null;
				break;

			case LOAD_POSTS_SUCCESS:
				draft.loadPostLoading = false;
				draft.loadPostDone = true;
				draft.mainPosts = draft.mainPosts.concat(action.payload);
				draft.hasMorePosts = draft.mainPosts.length < 50;
				break;

			case LOAD_POSTS_FAILURE:
				draft.loadPostLoading = false;
				draft.loadPostError = action.payload;
				break;

			case ADD_POST_REQUEST:
				draft.addPostLoading = true;
				draft.addPostDone = false;
				draft.addPostError = null;
				break;

			case ADD_POST_SUCCESS:
				draft.addPostLoading = false;
				draft.addPostDone = true;
				draft.mainPosts.unshift(action.payload);
				draft.imagePaths = [];
				break;

			case ADD_POST_FAILURE:
				draft.addPostLoading = false;
				draft.addPostError = action.payload;
				break;

			case REMOVE_POST_REQUEST:
				draft.removePostLoading = true;
				draft.removePostDone = false;
				draft.removePostError = null;
				break;

			case REMOVE_POST_SUCCESS:
				draft.mainPosts = state.mainPosts.filter(el => el.id !== action.payload.PostId);
				draft.removePostLoading = false;
				draft.removePostDone = true;
				break;

			case REMOVE_POST_FAILURE:
				draft.removePostLoading = false;
				draft.removePostError = action.payload;
				break;

			case ADD_COMMENT_REQUEST:
				draft.addCommentLoading = true;
				draft.addCommentDone = false;
				draft.addCommentError = null;
				break;

			case ADD_COMMENT_SUCCESS: {
				const { PostId } = action.payload;
				const post = draft.mainPosts.find(v => v.id === PostId);
				post.Comments.unshift(action.payload);
				draft.addCommentLoading = false;
				draft.addCommentDone = true;
				break;
			}

			case ADD_COMMENT_FAILURE:
				draft.addCommentLoading = false;
				draft.addCommentError = action.payload;
				break;

			default:
				break;
		}
	});

export default reducer;
