const express = require('express');
const Article = require('./../models/article');
const slugify = require('slugify')
const { markdown } = require("markdown");

const router = express.Router();

// Route to view an individual article
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) return res.sendStatus(404);
    res.json({
        title: article.title,
        description: article.description,
        createdAt: article.createdAt, 
        slug: article.slug, 
        sanitizedHtml: article.sanitizedHtml,
        markdown: article.markdown
    });
});

// Route to create a new article
router.post('/', async (req, res) => {
    const slug = slugify(req.body.title)
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        slug,
        sanitizedHtml: markdown.toHTML(req.body.markdown)
    });
    try {
        await Article.findOneAndUpdate({ slug }, article, { upsert: true });
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

// Route to delete an article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

module.exports = router;
