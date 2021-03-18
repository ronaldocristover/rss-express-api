const express = require('express');
const xml = require('xml');
const xmlparser = require('express-xml-bodyparser')
let Parser = require('rss-parser');
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(xmlparser());
app.use(cors());

const port = 9001;

app.get('/rss', (req, res) => {
    let {key, source} = req.query;

    let parser = new Parser();

    (async () => {
        let rssUrl = '';

        if (source === '1') {
            rssUrl = 'https://www.suara.com/rss/news';
        } else if (source === '2') {
            rssUrl = 'https://www.vice.com/id/rss?locale=id_id';
        } else if (source === '3') {
            rssUrl = 'https://rss.tempo.co/bisnis';
        } else if (source === '4') {
            rssUrl = 'https://www.cnnindonesia.com/ekonomi/rss'
        } else if (source === '5') {
            rssUrl = 'https://www.cnbcindonesia.com/news/rss'
        }

        let feed = await parser.parseURL(rssUrl);
        
        if(key !== undefined && key!== ""){
            let searchData = feed.items.filter(f => f.content.indexOf(key) > -1);
            return res.send(searchData);
        }

        let content = [];
        feed.items.forEach(f => {
            let datas = {
                title : f.title, 
                link: f.link, 
                content: f.content, 
                contentSnippet: f.contentSnippet
            };
            content.push(datas);
        })

        res.send(content);

    })()
});

app.listen(port, () => {
    console.log(`Port ${port} sedang berjalan`);
})