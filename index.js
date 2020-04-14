//CGR


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function retrieveUrl() {
  // fetch URL variants
  const resp = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');

  // handle API response failures
  if(!resp.ok) return null;

  // assign URLs to variant options
  const {variants: [variant1, variant2]} = await resp.json();

  // generate fairly random (50/50 odds) boolean
  const selection = Math.random() >= 0.5;

  // return randomly selected URL in A/B manner
  return (selection ? variant1 : variant2);

}

async function handleRequest(request) {
  // attempt request
  const resp = await retrieveUrl();

  //check for missing response and handle accordingly
  if (await !resp){
    return new Response('Bad Gateway | Page could not be found :(', {status: 502});
  } else return fetch(await resp);
}

