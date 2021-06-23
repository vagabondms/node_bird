import { HYDRATE } from 'next-redux-wrapper';

import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const rootReducer = (state, action) => {
	switch (action.type) {
		case HYDRATE:
			return action.payload; // store 전체를 바꾸더라.
		default: {
			const combinedReducer = combineReducers({
				user,
				post,
			});
			return combinedReducer(state, action);
		}
	}
};

export default rootReducer;
