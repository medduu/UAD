import http from 'http';
const hostname = '127.0.0.1';
const port = 3000;

// mock data
const items = [
    {id: 1, name: 'Item 1'},
    {id: 2, name: 'Item 2'},
];

const server = http.createServer((req, res) => {
    console.log('request', req.url, req.method, req.headers);
    // split rquest url to resource name and parameter
    const [a, resource, parameter] = req.url.split('/');

    // GET /items
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<p>Tervetuloa esimerkkirajapintaan</p>');
    // GET items
    }   else if (req.method === 'GET' && resource === '/items') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        if (id) {
            res.write(JSON.stringify(items[0]))
        }   else {
            res.write(JSON.stringify(items));
        }
        res.end();
    // Default 404 erroe response
    }   else {
        res.write(JSON.stringify(items));
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 - Page Not Found</h1>');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});