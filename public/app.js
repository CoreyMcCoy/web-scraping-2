const resultsBtn = document.querySelector('#results');
const feedDisplay = document.querySelector('#feed');

resultsBtn.addEventListener('click', getArticles);

async function getArticles() {
    const response = await fetch('http://localhost:3000/results');
    const data = await response.json();
    console.log(data);
    for (d of data) {
        const article = document.createElement('article');
        article.innerHTML = `
            <h2>${d.title}</h2>
            <p><a href="${d.url}">Read This Article</a></p>
        `;
        feedDisplay.appendChild(article);
    }
}
