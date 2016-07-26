import React, {Component} from 'react';
import Document from './Document';

import './app.scss';

class App extends Component {
	constructor() {
		super();
		this.state = { document: 'We expect our candidates to be action-oriented, aggressive and have creative ideas for' +
		' our team. You will deliver new technology and groundbreaking designs. We do not cross the street for anybody!' +
		' We have new technology stuff!' };
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	handleTextChange(event) {
		this.setState({ document: event.target.value });
	}

	render() {
		return (
			<div className="App">
				<textarea value={this.state.document} onChange={this.handleTextChange}></textarea>
				<Document value={this.state.document}/>
			</div>
		);
	}
}

export default App;
