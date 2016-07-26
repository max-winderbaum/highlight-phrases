# Highlight Phrases
Highlight various phrase groups with different colors - http://textio.maxwinderbaum.com/

## Quickstart
Node.js is the only global dependency for this project. Please install node >= 6.3 with npm.

    npm install
    npm start

## The Problem
Write a reusable control that, given an empty div and the categorized lists of phrases below, can render text passed in programmatically such that any examples of the phrases are highlighted like so:

![example1](https://cloud.githubusercontent.com/assets/9463867/17086526/5a9b5e32-51a9-11e6-9d10-4e3bb140cb5c.png)

The control does not need to directly handle user input. It should have a method that accepts a string containing plain text. When called, this method should erase the previous render, then render out the new text with highlights. It is not necessary to handle any additional formatting or markup.

This control should work in your choice of browser. Extra credit given for a solution that works in current versions of Chrome, Firefox, Safari (desktop and mobile) as well as IE11 and Edge.

This control should also meet the following additional requirements:

- It should be possible to have more than one instance of the control showing different text in a page at the same time.
- The control should be able to accept text repeatedly, replacing what was previously rendered with the new text.
- Hovering over a highlight should produce an effect where the color slightly darkens and the text switches from black to white.
- The control should be able to handle cases where the highlights overlap (including containment, where one phrase sits inside another). The color lists below have a priority. In general, when items overlap, the higher priority color should “win” for normal display. In the following examples, “will deliver new” is a grey phrase, while “new technology” is a green phrase. Green phrases take priority, so that would render like this:

![example2](https://cloud.githubusercontent.com/assets/9463867/17086525/5a9b5216-51a9-11e6-9893-896c2358b55e.png)

- When hovering over a portion of an overlapping highlight, that entire phrase should (temporarily) be shown by itself in the corresponding hover color, regardless of priority. If in our example, you hover over the “will deliver” part of the phrase, then that part of the highlight should stand alone during the hover, like so:

![example3](https://cloud.githubusercontent.com/assets/9463867/17086527/5a9e37b0-51a9-11e6-9a12-24e21c4e9179.png)

### Word Lists
(colors listed in descending order of priority)

#### Red List:

    action-oriented
    alarming
    candidates
    leave
    do not want

#### Green List:

    adorable
    creative
    love
    new technology

#### Blue List:

    an adorable puppy
    aggressive
    arm
    very unlikely

#### Purple List:

    do not cross
    log file
    our team
    radio

#### Grey list:

    very unlikely to leave
    will deliver new

## The Solution
This was an interesting problem because of how HTML works around the idea of two elements overlapping - you can't nest elements in a staggered way as intuition would call for - something like

```html
<span>Phrase one <span2> here </span1> comes trouble </span2>
```

I briefly considered trying to layer multiple spans on top of each other, but lining up text in floating elements seemed like a nightmare. I was left with one option: I'd need to write a lot of JavaScript and CSS that would let me wrap each word in an element and classes that would create a highlight effect.

I had an early idea of using React to create a functional component for the document, with a textarea to make live changes to the document. This proved to be very successful - rendering and state calculations happen seamlessly as the document changes. I used the new create-react-app cli to scaffold the initial application.

### Components

#### App
This is the top level of the application. A Document component and a textarea live here, with the textarea feeding a string into the Document.

#### Document
This is the component that does the rendering of the elements. It relies on PhraseState as a state machine.

#### PhraseState
This is an observable state machine that creates an array of what I call "decorated" words - objects with all the metadata needed to build their respective word elements in the DOM. PhraseState has actions that are called when the document changes, on mouse over, and on mouse out. These actions modify the internal state and then notify all observers. This makes PhraseState flexible - not only can there be multiple PhraseStates going at one time, but multiple components can be notified when a single instance's state changes.

##### Steps to Compute the State
State computation is triggered when the document changes, a word is focused, or a word is unfocused.

1. Call getWords() to split the document into an array of words, maintaining the starting character index of each word.
2. Call getMatches() which uses regexp to find all occurrences of each phrase in the document, maintaining the color and starting character index of each phrase.
3. Call decorate() which uses the words and phrase matches to create an array of decorated words. Decorated words contain information about which classes each word should contain.
4. Set the decorated words in the state and notify all observers of the new state via callbacks.

Given more time I'd probably break this machine into several modules, centered around getWords, getMatches, and decorate.

#### document.scss
This is the core of the sass necessary to make the classes come to life. There are some clever tricks involved here - including implicitly declaring the order of color specificity through the order of the $colors list.


### TODO
- PhraseState.js needs a lot of tests - I just didn't have the time to test properly. If I were shipping this product I would make sure that part in particular was well under test.

### Limitations
##### Sentence Endings
Without great NLP I would not be able to detect true sentence endings, which would break phrases. Instead I just chose to omit a phrase if it was broken by one of the characters (.!?) in the middle.

##### Odd Containment Issues
With the interactions I've chosen to support, there isn't support for showing a lower priority phrase that is contained within a higher-priority phrase. Additionally, There's no visual difference when one phrase contains another of the same color.
