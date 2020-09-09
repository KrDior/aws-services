const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  region: "eu-central-1",
  accessKeyId: "AKIAUPMEVSX75ZXHVKCV",
  secretAccessKey: "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",
});


const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

const allMovies = JSON.parse(fs.readFileSync("mockedData.json", "utf8"));
allMovies.forEach(function (movie) {
  const params = {
    TableName: 'products',
    Item: {
      id: movie.id,
      title: movie.title,
      tagline: movie.tagline,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      overview: movie.overview,
      budget: movie.budget,
      revenue: movie.revenue,
      genres: movie.genres,
      runtime: movie.runtime,
      availability: movie.availability,
      price: movie.price,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add movie",
        movie.title,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", movie.title);
    }
  });
});
