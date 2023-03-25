const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/posts', postRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});