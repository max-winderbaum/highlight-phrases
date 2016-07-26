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
			callback();
		});
	}

	focusWord(wordIndex) {
		this.focusedWordIndex = wordIndex;
		const focusedWord = this.state.words[wordIndex];
		if (focusedWord.colors.length === 1) {
			this.focusedWordColor = focusedWord.colors[0];
		}

		this.computeState();
	}

	unfocus() {
		this.focusedWordIndex = undefined;
		this.focusedWordColor = undefined;
		this.computeState();
	}

	getWords() {
		const words = [];
		const wordBeginningRegex = /[^\s]+\s*/g;
		let match = wordBeginningRegex.exec(this.document);
		while (match != null) {
			words.push({
				value: match[0].replace(/\s*$/, '').replace('-', '‑'), // Remove ending spaces
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
		const midWordRegex = '[^\\w\\s.!?]*[\\s]+[\\W]*';
		const afterPhraseRegex = '[^\\s\\w]*(?=[\\s]*)';
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

		decoratedWords.forEach((word, index) => {
			word.id = index;
			word.classMap = {};
			word.colors = [];
			word.classes = [];
			word.phraseWords = [];
		});

		decoratedWords.forEach((word, index) => {
			phraseMatches.forEach((phraseMatch) => {
				if (phraseMatch.characterIndex === word.characterIndex) {
					decoratedWords = this.decoratePhrase(decoratedWords, index, phraseMatch);
				}
			});
		});

		for(let i=0; i<decoratedWords.length; i++) {
			const word = decoratedWords[i];

			const prevWord = decoratedWords[i-1];
			const nextWord = decoratedWords[i+1];

			if (!word.classMap.right && word.classMap.highlight && nextWord && nextWord.classMap.left) {
				word.classMap['extra-right'] = true;
			}

			if (!word.classMap.left && word.classMap.highlight && prevWord && prevWord.classMap.right) {
				word.classMap['extra-left'] = true;
			}

		};

		decoratedWords.forEach((word, index) => {
			for (const key in decoratedWords[index].classMap) {
				if (decoratedWords[index].classMap.hasOwnProperty(key)) {
					decoratedWords[index].classes.push(key);
				}
			}
		});

		return decoratedWords;
	}

	decoratePhrase(words, startIndex, phraseMatch) {
		const decoratedWords = _.cloneDeep(words);
		const phraseLength = phraseMatch.value.split(/\s+/g).length;
		const endIndex = startIndex + phraseLength + (-1);

		const isPhraseFocused = this.focusedWordIndex >= startIndex && this.focusedWordIndex <= endIndex;

		for (let i = startIndex; i <= endIndex; i++) {
			const currentWord = decoratedWords[i];

			currentWord.classMap['highlight'] = true;

			let isStartOrEnd = false;

			if (i === startIndex) {
				isStartOrEnd = true;
				if (isPhraseFocused) {
					currentWord.classMap[phraseMatch.color + '-left-active'] = true;
				}
				currentWord.classMap[phraseMatch.color + '-left'] = true;
				currentWord.classMap['left'] = true;
			}

			if (i === endIndex) {
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

			currentWord.colors.push(phraseMatch.color);
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
