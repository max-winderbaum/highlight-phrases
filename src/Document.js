import React, {Component} from 'react';
import findPhrases from './findPhrases';

import './document.scss';

class Document extends Component {
	constructor(props) {
		super(props);
		const phrases = findPhrases(props.value);
		const words = phrases.words;
		const actions = phrases.actions;

		this.state = {
			words,
			actions,
			document: props.value,
		};
	}

	componentWillReceiveProps(props) {
		const phrases = findPhrases(props.value);
		const words = phrases.words;
		const actions = phrases.actions;

		this.setState({
			words,
			actions,
			document: props.value,
		});
	}

	render() {
		const wordElements = [];
		const words = this.state.words;
		const actions = this.state.actions;
		words.forEach(function (word, index) {
			wordElements.push(
				<span
					key={word.id}
					className={word.classes.join(' ')}
					onMouseOver={actions.handleMouseOver(index)}
					onMouseOut={actions.handleMouseOut(index)}>
					{word.value}
				</span>
			);
		});
		return (
			<div className="Document">
				{wordElements}
			</div>
		);
	}
}

Document.propTypes = {
	document: React.PropTypes.string,
};

export default Document;