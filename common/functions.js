const fs = require('fs');

/** Get news article text from txt file */
function getNewsArticle(articlePath) {
  // articlePath = articlePath.replace("\\", "\/");
  return new Promise((resolve, reject) => {
    fs.readFile(articlePath, (err, article) => {
      if (err) reject(err);
      resolve(article.toString());
    });
  });
};

exports.getNewsArticle = getNewsArticle;