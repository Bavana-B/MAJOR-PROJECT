const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:{
              type: String,
            default:"https://unsplash.com/photos/gray-fabric-loveseat-near-brown-wooden-table-3wylDrjxH-E",
        set:(v)=> v === "" ? "https://unsplash.com/photos/a-close-up-of-a-jellyfish-in-the-water-1AtSPxYnwwg":v,
    },
     filename:{
           type:String,
           default:"listing_name"
    }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in: Listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

