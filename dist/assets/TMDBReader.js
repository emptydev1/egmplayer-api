const { fetch } = require('undici');
const { load } = require('cheerio');
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Content-Type': 'text/plain',
    'Accept-Language': 'en-US'
};

async function DataReceiver(param) {
    const document = await fetch(`https://www.themoviedb.org${param}`, { headers });
    const $ = load(await document.text(), { lowerCaseTags: true }, true);
    
    if ($("#main .error_wrapper h2").parent().text().trim() == "Oops! We can't find the page you're looking for") return {};
    
    const [cls, logo] = [
        $('.certification').text().trim(),
        $('div.poster img').attr('src')
    ];
    
    return {
        title: $('h2').text().trim().split(/\n/)[0],
        logo: logo ? `https://www.themoviedb.org${logo.replace(/_filter\((.*?)\)/, '')}` : null,
        description: load(await fetch(document.url, { headers: { 'Accept-Language': 'pt-BR' } }).then((e) => e.text()))('meta[name="description"]').first().attr('content'),
        duration: $('.runtime').text().trim(),
        release_year: $('.tag.release_date').text().match(/\((.*?)\)/)[1],
        classification: (cls == 'R' ? '18' : cls) || null,
        genres: $('.genres a')
            .map((_, el) => $(el).text().toLowerCase())
            .toArray()
    };
}

exports.read = async function(title) {
    const document = await fetch(`https://www.themoviedb.org/search?query=${encodeURIComponent(title)}`, { headers })
        .then((e) => e.text());
    const $ = load(document, { lowerCaseTags: true }, true);
    
    return Promise.all(
        $('a.result')
        .filter((_, el) => el.attribs.href?.startsWith('/movie'))
        .slice(0, 5)
        .map((_, el) => DataReceiver(el.attribs.href))
    );
};
