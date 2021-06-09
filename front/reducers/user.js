import produce from 'immer';

const initialState = {
	logInLoading: false,
	logInDone: false,
	logInError: null,
	logOutDone: false,
	logOutLoading: false,
	logOutError: null,
	signUpLoading: false,
	signUpDone: false,
	signUpError: null,
	ChangeNicknameLoading: false, // 닉네임 변경 시도중
	ChangeNicknameDone: false,
	ChangeNicknameError: null,
	me: null,
	signUpData: {},
	loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const dummyUser = data => ({
	...data,
	id: 1,
	nickname: '김민석',
	Posts: [{ id: 1 }],
	Followings: [{ nickname: '뚜벅초' }, { nickname: '김민찬' }],
	Followers: [{ nickname: '뚜벅초' }, { nickname: '김민찬' }],
});

export const logInRequestAction = payload => ({
	type: LOG_IN_REQUEST,
	payload,
});

export const logOutRequestAction = payload => ({ type: LOG_OUT_REQUEST, payload });

const reducer = (state = initialState, action) =>
	produce(state, draft => {
		switch (action.type) {
			case LOG_IN_REQUEST:
				draft.logInLoading = true;
				draft.logInError = null;
				draft.logInDone = false;
				break;
			case LOG_IN_SUCCESS:
				draft.logInLoading = false;
				draft.me = dummyUser(action.data);
				draft.logInDone = true;
				break;
			case LOG_IN_FAILURE:
				draft.logInLoading = false;
				draft.logInError = action.error;
				break;
			case LOG_OUT_REQUEST:
				draft.logOutLoading = true;
				draft.logOutError = null;
				draft.logOutDone = false;
				break;
			case LOG_OUT_SUCCESS:
				draft.logOutLoading = false;
				draft.logOutDone = true;
				draft.me = null;
				break;
			case LOG_OUT_FAILURE:
				draft.logOutLoading = false;
				draft.logOutError = action.error;
				break;
			case SIGN_UP_REQUEST:
				draft.signUpLoading = true;
				draft.signUpError = null;
				draft.signUpDone = false;
				break;
			case SIGN_UP_SUCCESS:
				draft.signUpLoading = false;
				draft.signUpDone = true;
				break;
			case SIGN_UP_FAILURE:
				draft.signUpLoading = false;
				draft.signUpError = action.error;
				break;

			case CHANGE_NICKNAME_REQUEST:
				draft.changeNicknameLoading = true;
				draft.changeNicknameError = null;
				draft.changeNicknameDone = false;
				break;

			case CHANGE_NICKNAME_SUCCESS:
				draft.changeNicknameLoading = false;
				draft.changeNicknameDone = true;
				break;

			case CHANGE_NICKNAME_FAILURE:
				draft.changeNicknameLoading = false;
				draft.changeNicknameError = action.error;
				break;

			case ADD_POST_TO_ME:
				draft.me.Posts.unshift({ id: action.data });
				break;

			case REMOVE_POST_OF_ME:
				draft.me.Posts = draft.me.Posts.filter(v => v.id !== action.data);
				break;

			default:
				break;
		}
	});

export default reducer;