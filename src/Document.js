import React, {Component} from 'react';
import PhraseState from './PhraseState';

import './document.scss';

class Document extends Component {
	constructor(props) {
		super(props);
		this.phraseState = new PhraseState(props.value);
		this.state = this.phraseState.getState();
		this.phraseState.onChange((newState) => {
			this.setState(newState);
		});
	}

	componentWillReceiveProps(props) {
		this.phraseState.setDocument(props.value);
	}

	render() {
		const wordElements = [];
		const words = this.state.words;
		const actions = this.state.actions;
		words.forEach(function (word, index) {
			const handleMouseOver = () => actions.handleMouseOver(index);
			const handleMouseOut = () => actions.handleMouseOut(index);
			wordElements.push(
				<span
					key={word.id}
					className={word.classes.join(' ')}
					onMouseOver={handleMouseOver}
					onMouseOut={handleMouseOut}>
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