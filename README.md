## Setup
 This project doesn't require a web-server to run. You simply open up the index.html file in Google Chrome (recommended browser).

## Testing
  To run the tests, simply type `scope.testModule();` in the browser console.
  The testing is quite a bit different from the way I usually test  applications. Because I didn't use a framework such as Angular and all its tools, namely dependency injection, I couldn't set-up the tests like I normally do.
  Also, the fact that I wanted to conserve the security of using a closure, and wanted my code to run in the front-end, it was hard/impossible to use regular testing libraries such as Mocha and sinonJS.
  As such a wrote a quick and short assertion function and inserted into the module, allowing me to test private methods and variables.
