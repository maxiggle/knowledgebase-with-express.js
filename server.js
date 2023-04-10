var express = require('express'),
partials = require('express-partials'),
axios = require('axios')
require( 'dotenv' ).config()

const app = express()

app.use(partials());
app.set('view engine', 'ejs')
app.use(express.static('public'))

const BASE_URL = 'https://api.buttercms.com'

app.get('/', async(req, res) => {
  try {
    const response = await axios(`${BASE_URL}/v2/content/kb_main_category/?auth_token=${process.env.BUTTERCMS_READ_URL}`)
    const data = response.data.data.kb_main_category

    res.render('index', {
      title: 'Dropbox Help Center',
      data
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.get('/search', async(req, res) => {
  try {
    const response = await axios(`${BASE_URL}/v2/pages/search/?query=${req.query.query}&page_type=kb_article&auth_token=${process.env.BUTTERCMS_READ_URL}`)
    const results = response.data.data

    res.render('search', {
      title: 'Search',
      searchValue: req.query.query,
      results
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.get('/:category', async(req, res) => {
  try { 
    const response = await axios(`${BASE_URL}/v2/pages/kb_category/${req.params.category}/?auth_token=${process.env.BUTTERCMS_READ_URL}&levels=3`)
    const data = response.data.data

    res.render('category', {
      title: data.name,
      data
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.get('/blog/:slug', async(req, res) => {

  try {
    const response = await axios(`${BASE_URL}/v2/pages/kb_article/${req.params.slug}/?auth_token=${process.env.BUTTERCMS_READ_URL}`)
    const data = response.data.data

    res.render('article', {
      title: 'Article',
      data
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.listen(3000, () => {
  console.log('server has started')
})