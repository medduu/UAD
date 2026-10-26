import http from 'http';
const hostname = '127.0.0.1';
const port = 3000;

// mock data
const items = [
  {id: 1, name: 'Item 1'},
  {id: 2, name: 'Item 2'},
  {id: 6, name: 'Item 6'},
  {id: 8, name: 'Item 8'},
];

// Send a JSON response with the given status code
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
};

const notFound = (res) => {
  sendJson(res, 404, {message: 'Resource not found'});
};

// Read the request body and parse it as JSON
const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });

const findItemIndex = (id) => items.findIndex((item) => item.id === Number(id));

const getItemById = (res, id) => {
  const index = findItemIndex(id);
  if (index === -1) {
    return notFound(res);
  }
  sendJson(res, 200, items[index]);
};

const addItem = async (req, res) => {
  try {
    const body = await readJsonBody(req);
    if (!body?.name) {
      return sendJson(res, 400, {message: 'Name is required'});
    }
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    const newItem = {id: newId, name: body.name};
    items.push(newItem);
    sendJson(res, 201, {message: 'Item added', item: newItem});
  } catch {
    sendJson(res, 400, {message: 'Invalid JSON'});
  }
};

const updateItem = async (req, res, id) => {
  const index = findItemIndex(id);
  if (index === -1) {
    return notFound(res);
  }
  try {
    const body = await readJsonBody(req);
    if (!body?.name) {
      return sendJson(res, 400, {message: 'Name is required'});
    }
    items[index].name = body.name;
    sendJson(res, 200, {message: 'Item updated', item: items[index]});
  } catch {
    sendJson(res, 400, {message: 'Invalid JSON'});
  }
};

const deleteItem = (res, id) => {
  const index = findItemIndex(id);
  if (index === -1) {
    return notFound(res);
  }
  items.splice(index, 1);
  res.writeHead(204);
  res.end();
};

const server = http.createServer((req, res) => {
  console.log('request', req.method, req.url);
  const [, resource, id] = req.url.split('/');
  const {method} = req;

  if (method === 'GET' && req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<p>Tervetuloa esimerkkirajapintaan</p>');
  } else if (resource !== 'items') {
    notFound(res);
  } else if (method === 'GET' && id) {
    getItemById(res, id);
  } else if (method === 'GET') {
    sendJson(res, 200, items);
  } else if (method === 'POST' && !id) {
    addItem(req, res);
  } else if (method === 'PUT' && id) {
    updateItem(req, res, id);
  } else if (method === 'DELETE' && id) {
    deleteItem(res, id);
  } else {
    sendJson(res, 405, {message: 'Method not allowed'});
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});