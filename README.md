# Highlight Phrases
Highlight various phrase groups with different colors

## The Problem
Write a reusable control that, given an empty div and the categorized lists of phrases below, can render text passed in programmatically such that any examples of the phrases are highlighted like so:

The control does not need to directly handle user input. It should have a method that accepts a string containing plain text. When called, this method should erase the previous render, then render out the new text with highlights. It is not necessary to handle any additional formatting or markup.

This control should work in your choice of browser. Extra credit given for a solution that works in current versions of Chrome, Firefox, Safari (desktop and mobile) as well as IE11 and Edge.

This control should also meet the following additional requirements:

- It should be possible to have more than one instance of the control showing different text in a page at the same time.
- The control should be able to accept text repeatedly, replacing what was previously rendered with the new text.
- Hovering over a highlight should produce an effect where the color slightly darkens and the text switches from black to white.
- The control should be able to handle cases where the highlights overlap (including containment, where one phrase sits inside another). The color lists below have a priority. In general, when items overlap, the higher priority color should “win” for normal display. In the following examples, “will deliver new” is a grey phrase, while “new technology” is a green phrase. Green phrases take priority, so that would render like this:
- When hovering over a portion of an overlapping highlight, that entire phrase should (temporarily) be shown by itself in the corresponding hover color, regardless of priority. If in our example, you hover over the “will deliver” part of the phrase, then that part of the highlight should stand alone during the hover, like so:

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
