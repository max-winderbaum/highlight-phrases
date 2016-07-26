import phrases from './phrases';
import _ from 'lodash';

class PhraseState {
	constructor(initialDocument) {
		this.listeners = [];
		this.setDocument(initialDocument);
	}

	setDocument(newDocument) {
		this.document = newDocument;
		this.computeState();
	}

	computeState() {
		const words = this.getWords();
		const phraseMatches = this.getMatches();
		const decoratedWords = this.decorate(words, phraseMatches);

		this.state = {
			words: decoratedWords,
			actions: {
				handleMouseOver: this.handleMouseOver.bind(this),
				handleMouseOut: this.handleMouseOut.bind(this),
			},
			document: this.document,
		};

		this.notifyListeners();
	}

	getState() {
		return this.state;
	}

	onChange(callback) {
		this.listeners.push(callback);
	}

	notifyListeners() {
		this.listeners.forEach((callback) => {
			callback(this.state);
		});
	}

	focusWord(wordIndex) {
		this.focusedWordIndex = wordIndex;
		this.computeState();
	}

	unfocus() {
		this.focusedWordIndex = undefined;
		this.computeState();
	}

	getWords() {
		const words = [];

		// One or more non-space characters followed by any number of space characters
		const wordBeginningRegex = /[^\s]+\s*/g;
		let match = wordBeginningRegex.exec(this.document);
		while (match != null) {
			words.push({

				// Replace all but last space with non-breaking space, dash with non-breaking dash
				value: match[0].replace(/\s(?=\s)/g, '\u00a0').replace(' ', '').replace('-', '‑'),
				characterIndex: match.index,
			});
			match = wordBeginningRegex.exec(this.document);
		}

		return words;
	}

	getMatches() {
		let matches = [];
		for (const color in phrases) {
			if (phrases.hasOwnProperty(color)) {
				for (let i = 0; i < phrases[color].length; i++) {
					const phrase = phrases[color][i];
					const occurrences = this.getPhraseMatches(phrase, color);
					if (occurrences) {
						matches = matches.concat(occurrences);
					}
				}
			}
		}

		return matches;
	}

	getPhraseMatches(phrase, color) {

		// Not a sentence ending with spaces
		const midWordRegex = '[^\\w\\s.!?]*[\\s]+';

		// Any number of non-word, non-space characters as long as there's a space or line ending after
		const afterPhraseRegex = '[^\\w\\s]*(?=$|\\s)+';
		const phraseRegex = new RegExp(phrase.split(' ').join(midWordRegex) + afterPhraseRegex, 'gi');
		const matches = [];
		let match = phraseRegex.exec(this.document);

		while (match != null) {
			match.color = color;
			match.value = match[0];
			match.characterIndex = match.index;
			matches.push(match);
			match = phraseRegex.exec(this.document);
		}

		return matches;
	}

	decorate(words, phraseMatches) {
		let decoratedWords = _.cloneDeep(words);

		// Initialize word decorations
		decoratedWords.forEach((word, index) => {
			word.id = index;
			word.classMap = {};
			word.classes = [];
		});

		// Decorate each phrase
		words.forEach((word, index) => {
			phraseMatches.forEach((phraseMatch) => {

				// The matched phrase starts at this word
				if (phraseMatch.characterIndex === word.characterIndex) {
					decoratedWords = this.decoratePhrase(decoratedWords, index, phraseMatch);
				}
			});
		});

		// Determine extra-right and extra-left
		decoratedWords.forEach((word, index) => {
			const prevWord = decoratedWords[index - 1];
			const nextWord = decoratedWords[index + 1];

			if (!word.classMap.right &&
				word.classMap.highlight &&
				(nextWord && nextWord.classMap.left)
			) {
				word.classMap['extra-right'] = true;
			}

			if (!word.classMap.left &&
				word.classMap.highlight &&
				(prevWord && prevWord.classMap.right)
			) {
				word.classMap['extra-left'] = true;
			}

		});

		// Fill in classes array from classMap
		decoratedWords.forEach((word) => {
			for (const key in word.classMap) {
				if (word.classMap.hasOwnProperty(key)) {
					word.classes.push(key);
				}
			}
		});

		return decoratedWords;
	}

	decoratePhrase(words, startIndex, phraseMatch) {
		const decoratedWords = _.cloneDeep(words);
		const phraseLength = phraseMatch.value.split(/\s+/g).length;
		const endIndex = startIndex + phraseLength + (-1);

		const isPhraseFocused = this.focusedWordIndex >= startIndex &&
			this.focusedWordIndex <= endIndex;

		for (let index = startIndex; index <= endIndex; index++) {
			const currentWord = decoratedWords[index];

			currentWord.classMap['highlight'] = true;

			let isStartOrEnd = false;

			if (index === startIndex) {
				isStartOrEnd = true;
				if (isPhraseFocused) {
					currentWord.classMap[phraseMatch.color + '-left-active'] = true;
				}
				currentWord.classMap[phraseMatch.color + '-left'] = true;
				currentWord.classMap['left'] = true;
			}

			if (index === endIndex) {
				isStartOrEnd = true;
				if (isPhraseFocused) {
					currentWord.classMap[phraseMatch.color + '-right-active'] = true;
				}
				currentWord.classMap[phraseMatch.color + '-right'] = true;
				currentWord.classMap['right'] = true;
			}

			if (!isStartOrEnd) {
				if (isPhraseFocused) {
					currentWord.classMap[phraseMatch.color + '-mid-active'] = true;
				}
				currentWord.classMap[phraseMatch.color + '-mid'] = true;
				currentWord.classMap['mid'] = true;
			}
		}

		return decoratedWords;
	}

	handleMouseOver(event, notUsed, reactEvent, wordIndex) {
		this.focusWord(wordIndex);
	}

	handleMouseOut(event, notUsed, reactEvent, wordIndex) {
		this.unfocus();
	}
}

export default PhraseState;
