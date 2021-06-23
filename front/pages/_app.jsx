import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import wrapper from '../store/configureStore';

import 'antd/dist/antd.css';

const MyApp = ({ Component }) => (
	<>
		<Head>
			<title>NodeBird</title>
		</Head>
		<Component />
	</>
);

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(MyApp);
