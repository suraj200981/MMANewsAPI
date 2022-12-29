const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
//global variable to store the data
let data = [];

app.get('/scrape', (req, res) => {
  // URL of the MMA news site that you want to scrape
  const url = 'https://www.mmanews.com/news/ufc/';

  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      // Use cheerio to find the elements on the page that you want to scrape
      const newsHeadlines = $('h1>a, h2>a, h3>a, h4>a, h5>a, h6>a');
      const newsDate = $('.td-post-date');
      const author = $('.td_module_wrap .td-post-author-name a');
      //get the image url
      const image = $('[class*="tdb_module_loop"] .td-thumb-css')
      // Create an empty array to store the data that you scrape

      
      //loop through the elements and push data to the array using regular loop
        for (let i = 0; i < newsHeadlines.length; i++) {
            const newsDate1 = $(newsDate[i]).text();
            const headline1= newsHeadlines[i].children[0].data;
            const author1 = $(author[i]).text();
            const image1 = $(image[i]).attr('data-bg');
            data.push({
                headline: headline1,
                newsDate: newsDate1,
                author: author1,
                image: image1
            });
        }

       

      // Send the data back to the client
      res.send(data);
      console.log(data);
    }

  });
});

//create endpoint showdata to show the data in a nice html list
app.get('/showdata', (req, res) => {

    let html = `<h1>Data scraped from mmanews.com</h1>
    
    <ul>`;

    //loop through the data array including the image in an image tag
    for (let i = 0; i < data.length; i++) {
        html += '<li><img src="' + data[i].image + '" alt="">' + data[i].headline + ' - ' + data[i].newsDate + ' - ' + data[i].author + '</li>';
    }
    html += '</ul>';
    res.send(html);
});

app.listen(3000, () => {
  console.log('Web scraper running on port 3000');
});
