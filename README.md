# youtube-text
A node app that scrapes text from a YouTube video

Read the tutorial at:
https://medium.com/@djung31/scraping-images-and-text-from-youtube-videos-with-node-js-puppeteer-and-google-cloud-vision-api-3096863f486e

## To install
Fork or clone this repo.
`npm install` to install the required modules.
Create a `secrets.js` file in the project root directory, with the following code:
`process.env.GOOGLE_API_KEY = 'YOUR_API_KEY'`.

## To use
`npm start` to run the app.
Find a YouTube video and pause at the frame you'd like to scrape the text from.
Navigate a browser (or use a tool like Postman) to http://localhost:8080/api?videoId=${videoId}&t=${timestampInSeconds}
