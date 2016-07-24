import React, {Component} from 'react';
import Document from './Document';

class App extends Component {
	constructor() {
		super();
		this.state = { document: 'abc' };
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
