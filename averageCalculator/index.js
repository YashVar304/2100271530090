const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
let window = [];

const API_URLS = {
    p: 'https://20.244.56.144/test/primes',
    f: 'https://20.244.56.144/test/fibo',
    e: 'https://20.244.56.144/test/even',
    r: 'https://20.244.56.144/test/rand',
};

const TOKEN_TYPE = 'Bearer';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3ODI1NjIwLCJpYXQiOjE3MTc4MjUzMjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjJlOWQyMzVjLWE5MTEtNGJjOC05M2NlLTBiZGI3Zjk2MjUwNyIsInN1YiI6InZhcnNobmV5eWFzaDMwNEBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJBamF5IEt1bWFyIEdhcmcgRW5naW5lZXJpbmcgQ29sbGVnZSIsImNsaWVudElEIjoiMmU5ZDIzNWMtYTkxMS00YmM4LTkzY2UtMGJkYjdmOTYyNTA3IiwiY2xpZW50U2VjcmV0IjoiZ3F6UUhRbmxRVWlFa3hsUyIsIm93bmVyTmFtZSI6Illhc2ggVmFyc2huZXkiLCJvd25lckVtYWlsIjoidmFyc2huZXl5YXNoMzA0QGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAyNzE1MzAwOTAifQ.LisF5n47m1sB7JyVTafC1konC1ZaOEcRHr_nMetr2aM';

const fetchNumbers = async (numberId) => {
    const url = API_URLS[numberId];
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `${TOKEN_TYPE} ${TOKEN}`
            }
        });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        throw error;
    }
};

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
};

app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    try {
        // Fetch new numbers from the third-party API
        const newNumbers = await fetchNumbers(numberId);

        // Store previous state for the response
        const windowPrevState = [...window];

        // Update the window with new unique numbers
        window = window.concat(newNumbers);
        if (window.length > WINDOW_SIZE) {
            window = window.slice(-WINDOW_SIZE);
        }

        // Calculate the average
        const average = calculateAverage(window);

        // Prepare the response
        const response = {
            windowPrevState: windowPrevState,
            windowCurrState: window,
            numbers: newNumbers,
            avg: parseFloat(average.toFixed(2))
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Average calculator app listening at http://localhost:${port}`);
});
