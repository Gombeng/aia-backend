require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// error handling
app.use((error, req, res, next) => {
	const status = error.errorStatus || 500;
	const message = error.message;
	const data = error.data;

	res.status(status).json({ message, data });
});

const PORT = 4000;
const URI = `https://www.flickr.com/services/feeds/photos_public.gne?format=json`;
const YOUR_API_KEY = '77110961c7fb30763073477da0e6ad63';

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

const makeRequest = async (endpoint, params, reqType, api_key) => {
	try {
		let response;
		switch (reqType) {
			case 'GET':
				response = await axios.get(endpoint, {
					params: {
						...params,
						api_key,
					},
				});
				break;
			case 'POST':
				response = await axios.post(endpoint, {
					...params,
					api_key,
				});
				break;
			case 'PUT':
				response = await axios.put(endpoint, {
					...params,
					api_key,
				});
				break;
			case 'DELETE':
				response = await axios.delete(endpoint, {
					params: {
						...params,
						api_key,
					},
				});
				break;
			default:
				throw new Error('Invalid request type.');
		}
		return response.data;
	} catch (err) {
		console.error(err);
	}
};

app.get('/', (req, res) => {
	res.send('hello world');
});

// get
app.get('/get', (req, res) => {
	makeRequest(`${URI}`, req.query, 'GET', YOUR_API_KEY)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});

// post
app.post('/post', (req, res) => {
	makeRequest(`${URI}`, req.body, 'POST', YOUR_API_KEY)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});

// edit
app.post('/edit', (req, res) => {
	makeRequest(`${URI}`, req.body, 'PUT', YOUR_API_KEY)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});

// delete
app.delete('/delete', (req, res) => {
	makeRequest(`${URI}`, req.params, 'DELETE', YOUR_API_KEY)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});
