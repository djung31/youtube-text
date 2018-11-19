const express = require('express')
const puppeteer = require('puppeteer')
const axios = require('axios')
const app = express()
const PORT = process.env.PORT || 8080

if (process.env.NODE_ENV !== 'production') require('./secrets')

const generateScreenshot = async url => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.goto(url)
    await page.setViewport({width: 1920, height: 1080})
    const video = await page.$('.html5-video-player')
    await page.evaluate(() => {
      let dom = document.querySelector('.ytp-chrome-bottom')
      dom.style.display = 'none'
    })
    await page.keyboard.press('Space')
    let image = await video.screenshot({encoding: 'base64'})
    browser.close()
    return image
  } catch (err) {
    console.error(err.response)
  }
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const getText = async (screenshot) => {
  const requestBody = {
    requests: [{
      image: { content: screenshot},
      features: [{
        type: 'DOCUMENT_TEXT_DETECTION',
        maxResults: 100
      }]
    }]
  }
  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
    requestBody
  )
  return response.data
}

app.get('/api', async (req, res, next) => {
  try {
    if (req.query.videoId === undefined || req.query.t === undefined) {
      res.send('Invalid videoId: ' + req.query.videoId + '&t=' + req.query.t)
      return
    }
    const {videoId, t} = req.query
    const url = `https://www.youtube.com/watch?v=${videoId}&t=${t}s`
    let screenshot = await generateScreenshot(url);
    let text = await getText(screenshot)
    let response = text.responses[0].textAnnotations[0].description
    res.send(response)
  } catch (err) {
    console.error(err)
}
});
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
