import _ from 'lodash';
import superagent from 'superagent';
import cheerio from 'cheerio';
import getImageColors from 'get-image-colors';

const phraseToQuery = phrase => 
  _(phrase.split(' '))
    .map(x => x.trim().toLowerCase())
    .filter(x => x.length > 0)
    .join('+');

export const googleToHex = async phrase => {

  const referrer = 'https://www.google.com/';
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0';

  const query = phraseToQuery(phrase + ' color');
  
  const url = 'https://www.google.com/search?tbm=isch&sout=1&q=' + query;

  const response = await superagent.get(url)
    .set('Referrer', referrer)
    .set('User-Agent', userAgent);

  const $ = cheerio.load(response.text);
  const urls = _($.parseHTML($.html('img')))
    .map(x => x.attribs.src)
    .value();
  
  for (const imageUrl of urls) {

    try {
      const imageResponse = (await superagent.get(imageUrl)
        .set('Referrer', url)
        .set('User-Agent', userAgent)
        .parse(superagent.parse.image)
        .buffer());
      
      const contentType = imageResponse.headers['content-type'];
      const colors = await getImageColors(imageResponse.body, contentType);

      if (!_(colors).isEmpty()) {
        return _(colors).first().hex();
      }

    } catch (error) {
      // console.error(error);
    }
  }
  throw new Error('No image was found');  
};

// (async () => {
//   const phrase = process.argv[2] || 'magical sunrise';
//   console.log(await googleColor(phrase));
// })().catch(error => console.error(error));
