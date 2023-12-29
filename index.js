const http = require("node:http");
const fsPromises = require("node:fs/promises");
const fs = require("node:fs");

const PORT = process.env.PORT || 8080;

const getPage = async url => {
	let path =
		url === "/" ? `${__dirname}/index.html` : `${__dirname + url}.html`;

	const hasPath = fs.existsSync(path);

	!hasPath && (path = `${__dirname}/404.html`);

	try {
		return {
			page: await fsPromises.readFile(path),
			hasPath,
		};
	} catch (err) {
		console.err(err);
		return { page: null };
	}
};

const server = http.createServer(async (req, res) => {
	const { page, hasPath } = await getPage(req.url);

	res.writeHead(hasPath ? 200 : 404, { "Content-Type": "text/html" });
	res.end(page ? page : "<h1>404 Not Found</h1>");
});

server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
