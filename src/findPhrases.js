import phrases from './phrases';
import _ from 'lodash';

function findPhrases(document) {
	const words = getWords(document);
	const phraseMatches = getMatches(document);
	const decoratedWords = decorate(words, phraseMatches);

	return {
		words: decoratedWords,
		actions: {
			handleMouseOver: function() {},
			handleMouseOut: function() {},
		},
	};
}

function getWords(document) {
	const words = [];
	const wordBeginningRegex = /[^\s]+\s*/g;
	let match = wordBeginningRegex.exec(document);
	while (match != null) {
		words.push({
			value: match[0].replace(/\s*$/, '').replace('-', '‑'), // Remove ending spaces
			index: match.index,
		});
		match = wordBeginningRegex.exec(document);
	}

	return words;
}

function getMatches(document) {
	let matches = [];
	for (const color in phrases) {
		if (phrases.hasOwnProperty(color)) {
			for(let i=0; i<phrases[color].length; i++) {
				const phrase = phrases[color][i];
				const occurrences = getPhraseMatches(document, phrase, color);
				if (occurrences) {
					matches = matches.concat(occurrences);
				}
			}
		}
	}

	return matches;
}

function getPhraseMatches(document, phrase, color) {
	const midWordRegex = '[^\\w\\s.!?]*[\\s]+[\\W]*';
	const afterPhraseRegex = '[^\\s\\w]*(?=\\s)';
	if( phrase === 'action-oriented') {
		console.log(phrase.split(' ').join(midWordRegex) + afterPhraseRegex);
	}
	const phraseRegex = new RegExp(phrase.split(' ').join(midWordRegex) + afterPhraseRegex, 'gi');
	const matches = [];
	let match = phraseRegex.exec(document);

	while (match != null) {
		match.color = color;
		match.value = match[0];
		matches.push(match);
		match = phraseRegex.exec(document);
	}

	return matches;
}

function decorate(words, phraseMatches) {
	let decoratedWords = _.cloneDeep(words);

	decoratedWords.forEach((word, index) => {
		word.id = index;
		word.classMap = {};
		word.classes = ['highlight'];
		word.phraseWords = [];
	});

	decoratedWords.forEach((word, index) => {
		phraseMatches.forEach((phraseMatch) => {
			if (phraseMatch.index === word.index) {
				decoratedWords = decoratePhrase(decoratedWords, index, phraseMatch);
			}
		});

		// The classmap for the word is filled in completely. Let's convert it to an array!
		for(const key in decoratedWords[index].classMap) {
			if (decoratedWords[index].classMap.hasOwnProperty(key)) {
				decoratedWords[index].classes.push(key);
			}
		}
	});

	return decoratedWords;
}

function decoratePhrase(words, startIndex, phraseMatch) {
	const decoratedWords = _.cloneDeep(words);
	const phraseLength = phraseMatch.value.split(/\s+/g).length;
	const endIndex = startIndex + phraseLength + (-1);

	for(let i=startIndex; i<=endIndex; i++) {
		const currentWord = decoratedWords[i];

		let isEnd = false;

		if (i === startIndex) {
			isEnd = true;
			currentWord.classMap[phraseMatch.color + '-left'] = true;
			currentWord.classMap['left'] = true;
		}

		if (i === endIndex) {
			isEnd = true;
			currentWord.classMap[phraseMatch.color + '-right'] = true;
			currentWord.classMap['right'] = true;
		}

		if (!isEnd) {
			currentWord.classMap[phraseMatch.color + '-mid'] = true;
		}

		currentWord.phraseIndexes = _.range(startIndex, endIndex);
	}

	return decoratedWords;
}

export default findPhrases;
