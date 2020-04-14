//CGR


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function retrieveUrl() {
  // fetch URL variants
  const resp = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');

  // assign URLs to variant options
  const {variants: [variant1, variant2]} = await resp.json();

  // generate fairly random (50/50 odds) boolean
  const selection = Math.random() >= 0.5;

  // return randomly selected URL in A/B manner
  return (selection ? variant1 : variant2);

}

async function handleRequest(request) {
  return fetch(await retrieveUrl());
}

