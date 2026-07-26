require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { nextTick } = require('process');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const maptiler = process.env.MAPTILER_API_KEY;

app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.redirect("/listings");
});

const port = process.env.PORT || 3000;

const MONGO_URL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, //in ms
        httpOnly: true
    }
};

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

app.use(session(sessionOptions));
app.use(flash());//use before routes so that flash messages can be used in routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //passport adds user to req object, so we can access it in all routes
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

main().then(() => {
    console.log('connected to DB');
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//if sends req to unknown page(not matching with any route), then throw error
app.all("/*splat", (req, res, next) => { //(*) - for older versions of express, (/*splat) - for newer versions of express(5+)
    next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500; 
    const message = err.message || "Something went wrong";
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
});//server-side validation

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
