const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
    console.info(`Backend is listening on port ${PORT}`);
});
