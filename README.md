## Setup
 This project doesn't require a web-server to run. You simply open up the `index.html` file in Google Chrome (recommended browser).

## Testing
  To run the tests open the `app_test.html` file in Chrome.

## Tech Stack
  Most of the application is written in pure javascript. I used bootstrap.css for styling and lodash to make one function more readable. For testing, I decided to run mocha and chai on the front-end. I copied the application's basic html structure on the test page in order to test the DOM manipulation. In a real-life application, testing would have required a headless browser like phantomJS. My tests would have been written using node.js and would run from the command-line and used more advanced tools such as Angular's dependency injection and sinonJS for mocking and stubbing. This seemed like a simpler approach considering the scope of the application.
