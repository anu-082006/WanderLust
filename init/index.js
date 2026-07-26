const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listings');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log('connected to DB');
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a625762bc8b25c72cb96b57"
    }));// Add the owner field to each listing object
    await Listing.insertMany(initData.data);
    console.log("Data was successfully initialized");
};

initDB();
