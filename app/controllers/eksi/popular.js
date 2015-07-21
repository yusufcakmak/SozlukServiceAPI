var request = require('request');
var cheerio = require('cheerio');
var url = 'https://eksisozluk.com/basliklar/gundem';

exports.popular = function (req, res, next) {
	request(url, function (err, response, body) {
		if (err) {
      return next(err);
    }
    if (response.statusCode !== 200) {
      return next(new Error('Server Error'));
    }
	  $ = cheerio.load(body);

    var links = $('small').remove();
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

exports.detail = function (req, res, next) {


    if(typeof req.query.url==='undefined'){return res.json({'status':false,'msg':'Hedef url url parametresiyle gelmelidir.'})}
    var istenenUrl="http://eksisozluk.com"+req.query.url;
    if(req.query.url[0]!="/")
    {
        var istenenUrl="http://eksisozluk.com/"+req.query.url;
    }

  request(istenenUrl, function (err, response, body) {
    if (err) {
      return next(err);
    }
    if (response.statusCode !== 200) {
      return next(new Error('Server Error'));
    }
    $ = cheerio.load(body);

    var links =  $("ul#entry-list li")
    .map(function (i, e) {
      var tds = $(e).find('div.content');
      var entryAuthor = $(e).find('footer div.info a.entry-author');
      var entryUrl = $(e).find('footer div.info a');
      
        return {

          entry: $(tds[0]).text(),
          entryUrl: $(entryUrl[0]).attr('href'),
          entryDate: $(entryUrl[0]).text(),
          author: $(entryAuthor[0]).text(),
          
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

