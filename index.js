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

const notFound = (res) => {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>404 - Page Not Found</h1>');
}; 

const server = http.createServer((req, res) => {
    console.log('request', req.url, req.method, req.headers);
    const [a, resource, parameter] = req.url.split('/');

    // GET /
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<p>Tervetuloa esimerkkirajapintaan</p>');
        return; // <--- FIX 1: Added return to stop execution here!
        
    } else if (req.method === 'GET' && resource === 'items') {
        
        if (parameter) {
            const targetId = parseInt(parameter); 
            const foundItem = items.find(item => item.id === targetId);
            
            if (!foundItem) {
                notFound(res);
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(foundItem)); 
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(items));
        }
        res.end();
    }   else if (req.method === 'POST' && resource === 'items') {
        let data ='';
        req.on('data', chunk => {
            data += chunk.toString();
        });
        req.on('end', () => {
            console.log('POST data:', data);
            
            // FIX 2: Fixed case-sensitivity typo (NewItem -> newItem)
            const newItem = JSON.parse(data);
            newItem.id = items[items.length-1].id + 1;
            items.push(newItem); // Pushing the object with its new ID
            
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Data received", item: newItem }));
        });
        
    // Default 404 error response
    } else {
        notFound(res);  
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});