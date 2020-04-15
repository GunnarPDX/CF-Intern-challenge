//CGR

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, checkCookieValue(event.request)));
});

async function retrieveUrls() {
  const resp = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  // handle API response failures
  if(!resp.ok) {return null} else return resp;
}

class ElementHandler {
  element(element) {
    // modify elements contents
    element.setAttribute('href', 'https://gunnarrosenberg.com/');
    element.setInnerContent('-> Check out my portfolio <-');
  }
}

// create new HTMLRewriter to replace link with my portfolio
const rewriter = new HTMLRewriter().on('a#url', new ElementHandler());

async function handleRequest(request, option) {
  const resp = await retrieveUrls();
  // check for missing response and handle accordingly
  if (!resp){
    return new Response('Probably a bad gateway | Page could not be found :(', {status: 502});
  } else {
    const {variants: [variant1, variant2]} = await resp.json();

    let RESP1 = await fetch(variant1);
    let RESP2 = await fetch(variant2);

    // check to see if variant matches and return matching url
    if (option === 'test') {
      return rewriter.transform(RESP1);

    } else if (option === 'control') {
      return rewriter.transform(RESP2);

    } else {
      // if not variant is present then create a new cookie value for random variant
      let group = Math.random() < 0.5 ? 'test' : 'control';
      let resp = group === 'test' ? rewriter.transform(RESP1) : rewriter.transform(RESP2);
      // append selected variant
      resp.headers.append('Set-Cookie', `variant=${group}; path=/`);
      return resp;
    }
  }
}

function checkCookieValue(request) {
  let cookie = request.headers.get('Cookie');
  // if cookie is present then parse for page variant
  if(cookie){
    let values = {};
    cookie.split(';').forEach(function(cookie) {
      let segment = cookie.split('=');
      values[segment.shift().trim()] = decodeURI(segment.join('='));
    });
    return values.variant
  } else {
    return null
  }
}