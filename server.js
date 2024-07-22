const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Article = require("./models/article")
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb+srv://simonaisakova6:NRuLsBiYgufoNgUg@development.vghqd78.mongodb.net/')
app.use(cors())

// app.use(express.urlencoded({ extended: false }))
// app.use(methodOverride('_method'))
app.use(express.json())

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.json(articles.map(({ title, description, createdAt, slug, sanitizedHtml }) => ({ title, description, createdAt, slug, sanitizedHtml })))
})

app.use('/articles', articleRouter)

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
