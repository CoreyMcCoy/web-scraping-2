const resultsBtn = document.querySelector('#results');
const feedDisplay = document.querySelector('#feed');

resultsBtn.addEventListener('click', getArticles);

async function getArticles() {
    const response = await fetch('http://localhost:3000/results');
    const data = await response.json();
    for (d of data) {
        const article = document.createElement('article');
        article.innerHTML = `
            <h1>${d.title.slice(0, 50)}...</h1>
            <h2>${d.source}</h2>
            <p class='card'><a href="${d.url}">Read This Article</a></p>
        `;
        feedDisplay.appendChild(article);
    }
}
