import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [sagaMiddleware];
	const enhancer =
		process.env.NODE_ENV === 'production'
			? applyMiddleware(...middlewares)
			: composeWithDevTools(applyMiddleware(...middlewares));
	const store = createStore(rootReducer, enhancer);
	store.sagaTask = sagaMiddleware.run(rootSaga);
	return store;
};

const wrapper = createWrapper(configureStore, {
	debug: process.env.Node_ENV === 'development',
});

export default wrapper;
