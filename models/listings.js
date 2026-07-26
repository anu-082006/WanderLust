//Model-1 Listings(place) => title, description, image, price, location, country
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user.js");

const listingSchema = new Schema({
    title: {
       type: String,
       required: true
    },
    description: String,
    image: {
       url: String,
       filename: String
    },
    price: Number,
    location: String,
    country: String,
    review: [ {
        type: Schema.Types.ObjectId,
        ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete", async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});//findOneAndDelete will be called when findByIdAndDelete is called in the delete route. It will delete all the reviews associated with the listing being deleted.

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;