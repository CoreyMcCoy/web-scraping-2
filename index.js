const PORT = process.env.PORT || 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const websites = [
    {
        name: 'The Guardian - Artificial Intelligence',
        address: 'https://www.theguardian.com/us/technology',
        base: '',
    },
    {
        name: 'MIT News - Computer Science And Artificial Intelligence Laboratory',
        address: 'https://www.csail.mit.edu/news/',
        base: 'https://www.csail.mit.edu',
    },
    {
        name: 'OpenAI',
        address: 'https://blog.openai.com',
        base: 'https://blog.openai.com',
    },
    {
        name: 'Robotics & AI | TechCrunch',
        address: 'https://techcrunch.com',
        base: 'https://techcrunch.com',
    },
    {
        name: 'Machine Intelligence Research Institute',
        address: 'https://intelligence.org',
        base: '',
    },
    {
        name: 'DeepMind',
        address: 'https://deepmind.com',
        base: 'https://deepmind.com',
    },
    {
        name: 'MIT News - Artificial Intelligence',
        address: 'https://news.mit.edu',
        base: 'https://news.mit.edu',
    },
    {
        name: 'The AI Blog',
        address: 'https://blogs.microsoft.com',
        base: '',
    },
    {
        name: 'AI Impacts',
        address: 'https://aiimpacts.org',
        base: '',
    },
    {
        name: 'AWS Machine Learning Blog',
        address: 'https://aws.amazon.com',
        base: '',
    },
    {
        name: 'AI News',
        address: 'https://artificialintelligence-news.com',
        base: '',
    },
    {
        name: 'Becoming Human: Artificial Intelligence Magazine',
        address: 'https://becominghuman.ai',
        base: 'https://becominghuman.ai',
    },
    {
        name: 'Google AI Blog',
        address: 'https://ai.googleblog.com',
        base: '',
    },
    {
        name: 'OpenAI Blog',
        address: 'https://openai.com',
        base: 'https://openai.com',
    },
];

const articles = [];

websites.forEach((website) => {
    axios
        .get(website.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            // Get the articles from websites that only reference the word "ai" or "AI" or "Artificial Intelligence" in the title. Display the title and the url and the source of the article.
            $('a').each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                if (title.includes('AI') || title.includes('Artificial Intelligence')) {
                    articles.push({
                        title: title,
                        url: website.base + url,
                        source: website.name,
                    });
                }
            });
        })
        .catch((err) => console.log(err));
});

// Create a route to the index.html file

app.get('/', (req, res) => {
    res.send('index');
});

// Create an API endpoint to get the articles
app.get('/results', (req, res) => {
    res.json(articles);
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
