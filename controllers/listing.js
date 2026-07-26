const Listing = require('../models/listings.js');
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    // if(!req.body.listing) throw new ExpressError("Please provide valid listing data", 400); - can't use many ifs for listing and fields in listing, so use JOI validation instead
    const newListing = new Listing(req.body.listing);
    if (req.file) {
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
        };
    }
    const result = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
    );
    newListing.owner = req.user._id;
    newListing.geometry = result.features[0].geometry;
    let savedListing = await newListing.save();
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).
    populate({
        path: "review", 
        populate: {path: "author"}
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/w_250/");
    console.log("TRANSFORMED URL IS:", originalImageUrl);
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if (req.file) {
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};