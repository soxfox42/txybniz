# TXYBNIZ

This project is a web app combining two awesome creative coding systems - [tixy.land](https://tixy.land/) and [IBNIZ](http://viznut.fi/ibniz/).

The IBNIZ VM is not yet complete, and can basically only evaluate simple expressions right now.

## Documentation

IBNIZ is a stack based language, and this explanation assumes some familiarity with this type of language. It uses 16.16 fixed point numbers as the only data type, and most operations are a single character.

Every frame, for each dot, your IBNIZ program will be run. The stack is reset for each run, unlike the original IBNIZ VM. Three values are pushed to the stack for each run - the current time, the y position of the current dot, and the x position of the current dot. Time is given in seconds, and positions are given in the range -1 to 1. The value you leave at the top of the stack will be used as the value for the current dot, in the range -1 to 1.

### Operations

The only operation that is more than one character is the immediate value operation. A sequence of uppercase hex characters, possibly including a radix point (.) will be interpreted as a hexadecimal 16.16 fixed point number, and pushed directly to the stack.

Character | Operation    | Notes
--------- | -----------  | -----
`+`       | Add          |
`-`       | Subtract     |
`*`       | Multiply     |
`/`       | Divide       | If second input is 0, result is 0.
`%`       | Modulo       | If second input is 0, result is 0.
`q`       | Square Root  | If input is negative, result is 0.
&nbsp; |
`&`       | And          |
`\|`      | Or           |
`^`       | Xor          |
`r`       | Right Rotate |
`l`       | Left Shift   |
`~`       | Not          |
&nbsp; |
`s`       | Sin          | sin(a * 2PI)
`a`       | Atan2        | atan2(a, b) / 2PI
&nbsp; |
`<`       | Is Negative  | If input is positive, result is 0, otherwise input.
`>`       | Is Positive  | If input is negative, result is 0, otherwise input.
`=`       | Is Zero      | If input is 0, result is 1, otherwise 0.
&nbsp; |
`d`       | Duplicate    |
`p`       | Pop          |
`x`       | Exchange     |
`v`       | Rotate       | Move third element to top of stack
`)`       | Pick         | Copy value from position on stack
`(`       | Bury         | Overwrite position on stack with value

## Running

Use the web version at [soxfox.me/txybniz](https://soxfox.me/txybniz).

Alternatively, clone the repo and run:
```sh
npm install
npm start
```
Then open a browser to `localhost:1234`.
