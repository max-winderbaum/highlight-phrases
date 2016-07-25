import React, {Component} from 'react';
import PhraseState from './PhraseState';
import _ from 'lodash';

import './document.scss';

class Document extends Component {
	constructor(props) {
		super(props);
		this.phraseState = new PhraseState(props.value);
		this.state = this.phraseState.getState();
	}

	componentWillReceiveProps(props) {
		this.phraseState.setDocument(props.value);
		this.setState(this.phraseState.getState());
	}

	render() {
		const wordElements = [];
		const words = this.state.words;
		const actions = this.state.actions;
		words.forEach(function (word, index) {
			const handleMouseOver = _.curryRight(actions.handleMouseOver)(index);
			const handleMouseOut = _.curryRight(actions.handleMouseOut)(index);
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