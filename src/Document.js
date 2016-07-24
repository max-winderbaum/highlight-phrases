import React, {Component} from 'react';

class Document extends Component {
	constructor(props) {
		super(props);
		this.state = {
			document: props.value,
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			document: props.value,
		});
	}

	render() {
		return (
			<div className="Document">
				<span>{this.state.document}</span>
			</div>
		);
	}
}

Document.propTypes = {
	document: React.PropTypes.string,
};

export default Document;