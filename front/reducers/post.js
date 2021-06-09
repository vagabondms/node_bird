import shortId from 'shortid';
import produce from 'immer';
import faker from 'faker';

const initialState = {
	mainPosts: [],
	imagePaths: [],
	hasMorePosts: true, // 남은 데이터가 있는 지 확인
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
};

export const generateDummyPost = number =>
	Array(number)
		.fill()
		.map(() => ({
			id: shortId.generate(),
			User: {
				id: shortId.generate(),
				nickname: faker.name.findName(),
			},
			content: faker.lorem.paragraph(),
			Images: [
				{
					src: faker.image.image(),
				},
			],
			Comments: [
				{
					User: {
						id: shortId.generate(),
						nickname: faker.name.findName(),
					},
					content: faker.lorem.sentence(),
				},
			],
		}));

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

const dummyPost = payload => ({
	id: payload.id,
	content: payload.content,
	User: {
		id: 1,
		nickname: '김민석',
	},
	Images: [],
	Comments: [],
});

const dummyComment = payload => ({
	id: shortId.generate(),
	content: payload,
	User: {
		id: 1,
		nickname: '김민석',
	},
});

const reducer = (state = initialState, action) =>
	produce(state, draft => {
		switch (action.type) {
			case LOAD_POSTS_REQUEST:
				draft.loadPostLoading = true;
				draft.loadPostDone = false;
				draft.loadPostError = null;
				break;

			case LOAD_POSTS_SUCCESS:
				draft.loadPostLoading = false;
				draft.loadPostDone = true;
				draft.mainPosts = action.payload.concat(draft.mainPosts);
				draft.hasMorePosts = draft.mainPosts.length < 50;
				break;

			case LOAD_POSTS_FAILURE:
				draft.loadPostLading = false;
				draft.loadPostError = action.error;
				break;

			case ADD_POST_REQUEST:
				draft.addPostLoading = true;
				draft.addPostDone = false;
				draft.addPostError = null;
				break;

			case ADD_POST_SUCCESS:
				draft.addPostLoading = false;
				draft.addPostDone = true;
				draft.mainPosts.unshift(dummyPost(action.payload));
				break;

			case ADD_POST_FAILURE:
				draft.addPostLoading = false;
				draft.addPostError = action.error;
				break;

			case REMOVE_POST_REQUEST:
				draft.removePostLoading = true;
				draft.removePostDone = false;
				draft.removePostError = null;
				break;

			case REMOVE_POST_SUCCESS:
				draft.mainPosts = state.mainPosts.filter(el => el.id !== action.payload);
				draft.removePostLoading = false;
				draft.removePostDone = true;
				break;

			case REMOVE_POST_FAILURE:
				draft.removePostLoading = false;
				draft.removePostError = action.error;
				break;

			case ADD_COMMENT_REQUEST:
				draft.addCommentLoading = true;
				draft.addCommentDone = false;
				draft.addCommentError = null;
				break;

			case ADD_COMMENT_SUCCESS: {
				const { content, postId } = action.payload;
				const post = draft.mainPosts.find(v => v.id === postId);
				post.Comments.unshift(dummyComment(content));
				draft.addCommentLoading = false;
				draft.addCommentDone = true;
				break;
			}

			case ADD_COMMENT_FAILURE:
				draft.addCommentLoading = false;
				draft.addCommentError = action.error;
				break;

			default:
				break;
		}
	});

export default reducer;
