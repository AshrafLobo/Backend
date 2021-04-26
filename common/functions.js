const fs = require('fs');
const config = require('config');

/** Get news article text from txt file */
function getNewsArticle(articlePath) {
  articlePath = articlePath.replace("\\", "\/");
  console.log("Article path", articlePath);
  return new Promise((resolve, reject) => {
    fs.readFile(articlePath, (err, article) => {
      if (err) reject(err);
      resolve(article.toString());
    });
  });
};

exports.getNewsArticle = getNewsArticle;