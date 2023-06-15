import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from '@Layout/layout';

const App = () => (
	<div className="container">
		<Layout />
	</div>
);
ReactDOM.render(<App />, document.getElementById('app'));
