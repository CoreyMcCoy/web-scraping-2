const PORT = process.env.PORT || 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const url = 'https://www.theguardian.com';

app.get('/', (req, res) => {
    res.send('index');
});

// Create an API endpoint to get the articles
app.get('/results', (req, res) => {
    axios(url)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const articles = [];

            $('.fc-item__title').each(function () {
                const title = $(this).text();
                const url = $(this).find('a').attr('href');
                articles.push({
                    title,
                    url,
                });
            });
            res.json(articles);
        })
        .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
