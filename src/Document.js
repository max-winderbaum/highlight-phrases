import React, {Component} from 'react';
import './document.scss';

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
				<span className="blue-left">Lorem</span>
				<span className="blue-mid">ipsum</span>
				<span className="blue-mid green-left">dolor</span>
				<span className="blue-right green-mid">sit</span>
				<span className="green-mid">amet,</span>
				<span className="green-mid">consectetur</span>
				<span className="green-right">adipiscing</span>
				<span className="">elit.</span>
				<span className="">In</span>

				<span className="green-left green-left-active">lobortis</span>
				<span className="green-right red-left green-right-active">velit</span>
				<span className="green red-mid">ac</span>
				<span className="red-mid ">neque</span>
				<span className="red-right">ornare</span>
				<span className="">aliquet.</span>
				<span className="">Fusce</span>
				<span className="">a</span>
				<span className="blue-left">arcu</span>
				<span className="blue-mid red-left">pharetra,</span>
				<span className="blue-right red-mid">euismod</span>
				<span className="red-mid green-left">arcu</span>
				<span className="red-right green-mid">eget,</span>
				<span className="green-mid">finibus</span>
				<span className="green-right">est.</span>
			</div>
		);
	}
}

Document.propTypes = {
	document: React.PropTypes.string,
};

export default Document;