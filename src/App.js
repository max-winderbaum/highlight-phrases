import React, {Component} from 'react';
import Document from './Document';

class App extends Component {
	constructor() {
		super();
		this.state = { document: 'abc' };
		this.setDocument = this.setDocument.bind(this);
	}

	setDocument(event) {
		this.setState({ document: event.target.value });
	}

	render() {
		return (
			<div className="App">
				<textarea value={this.state.document} onChange={this.setDocument}></textarea>
				<Document value={this.state.document}/>
			</div>
		);
	}
}

export default App;
