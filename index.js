const http = require("node:http");
const fsPromises = require("node:fs/promises");
const fs = require("node:fs");

const PORT = process.env.PORT || 8080;

let page404 = null;

const getPage = async url => {
	let path =
		url === "/" ? `${__dirname}/index.html` : `${__dirname + url}.html`;

	try {
		return await fsPromises.readFile(path);
	} catch (err) {
		console.error(err);
		return false;
	}
};

const server = http.createServer(async (req, res) => {
	const page = await getPage(req.url);

	res.writeHead(page ? 200 : 404, { "Content-Type": "text/html" });
	res.end(page ? page : page404);
});

server.listen(PORT, async () => {
	page404 = await fsPromises.readFile(`${__dirname}/404.html`);
	console.log(`Server is running at http://localhost:${PORT}`);
});
