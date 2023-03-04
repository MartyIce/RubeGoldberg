const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const post = (root, resource, body) => {
  return fetch(`${root}/${resource}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body)
  });
}

const get = (root, resource) => {
  return fetch(`${root}/${resource}`);
}

export { post, get };