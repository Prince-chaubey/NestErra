const Joi = require("joi");

module.exports.validateListings = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(), // corrected "discription"
        location: Joi.string().required(),
        price: Joi.number().required(),
        country: Joi.string().required(),
        image: Joi.string().required(),
    }).required()
});

module.exports.validateReviews = Joi.object({
    reviews: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required()
});
