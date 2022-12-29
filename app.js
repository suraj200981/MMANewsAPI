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
      //store data in json file. if the data is duplicated, it will be overwritten
        const fs = require('fs');
        fs.writeFile('data.json', JSON.stringify(data), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });

    }

  });
});

//create endpoint showdata to show the data in a nice html list
app.get('/', (req, res) => {
    const fs = require('fs');

    //is data.json does not exist, show html error message
    if (!fs.existsSync('data.json')) {
        res.send('data.json does not exist. Please run /scrape first');
    } else{

    //read the data from the json file present data nicely and image in image tag
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        let data1 = JSON.parse(data);
        let html = `
    <h1 style="text-align:center">UFC News scraped from <a href="https://www.mmanews.com/">MMANews.com</a></h1>
       
    <br><br>
    <h3 style="text-align:center">click <a href="/scrape">here</a> to scrape the data again</h3>
    <br>
    <ul style="list-style: none; margin">`;


        
        
        //write the loop again but this time to show the data in a table
        for (let i = 0; i < data1.length; i++) {
            html += `
            <li>
                <h2>${data1[i].headline}</h2>
                <p>${data1[i].newsDate}</p>
                <p>${data1[i].author}</p>
                <img src="${data1[i].image}" alt="image">
            </li>
            `;
        }
        html += '</ul>';
        res.send(html);
    }); 

}
});

app.listen(3000, () => {
  console.log('Web scraper running on port 3000');
});
