var request = require('request');
var cheerio = require('cheerio');
var url = 'https://eksisozluk.com';

exports.category = function (req, res, next) {
     if(typeof req.query.category==='undefined'){return res.json({'status':false,'msg':'Hedef category parametresiyle gelmelidir.'})}
    var istenenUrl="http://eksisozluk.com"+"/basliklar/kanal/"+req.query.category;


  request(istenenUrl, function (err, response, body) {
    if (err) {
      return next(err);
    }
    if (response.statusCode !== 200) {
      return next(new Error('Server Error'));
    }
    $ = cheerio.load(body);

    var links = $('dropdown').remove();
    var links = $('div#content.instapaper_body ul.topic-list li')
    .map(function (i, e) {

        var tds = $(e).find('a');
        return {
          
          entryTitle: $(tds[0]).text(),
          entryUrl:   $(tds[0]).attr('href'),
        };
        })
      .get() // get basic JSONArray
      .sort(function (a, b) { // sort by code
        return a.code - b.code;
      });

      if (req.query.skip) {
      links = links.slice(req.query.skip);
    }
    if (req.query.limit) {
      links = links.slice(0, req.query.limit);
    }

      return res.json(links);
    });
};