import { useState, useCallback } from 'react';

const useInput = initialInput => {
	const [input, setInput] = useState(initialInput);

	const onChangeInput = useCallback(e => {
		const { name, value } = e.target;

		setInput(prev => ({
			...prev,
			[name]: value,
		}));
	}, []);

	return [input, onChangeInput, setInput];
};

export default useInput;
