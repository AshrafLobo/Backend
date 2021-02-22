const fs = require('fs');

function getNewsArticle(articlePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(articlePath, (err, article) => {
      if (err) reject(err);
      resolve(article.toString());
    });
  });
};

exports.getNewsArticle = getNewsArticle;