const express = require('express');
const apkpure = require('./test.js');

const app = express();
const port = 3000;

// عرض "Hello world" في الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('Hello world');
});

// البحث عن التطبيقات
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const appInfo = await apkpure(query);
        res.json(appInfo);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
