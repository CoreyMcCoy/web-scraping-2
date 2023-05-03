const resultsBtn = document.querySelector('#results');
const feedDisplay = document.querySelector('#feed');

resultsBtn.addEventListener('click', getFoodTrucks);

async function getFoodTrucks() {
    const response = await fetch('http://localhost:3000/results');
    const data = await response.json();
    console.log(data);
    // for (d of data) {
    //     const article = document.createElement('article');
    //     article.innerHTML = `
    //         <h1>${d.title}...</h1>
    //         <p class='card'><a href="${d.url}">Read This Article</a></p>
    //     `;
    //     feedDisplay.appendChild(article);
    // }
}
