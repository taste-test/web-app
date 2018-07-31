const mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
    role: String,
    comparisons: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comparison"
    }],
    results: Object,
    generatedDate: Date,
});

profileSchema.pre("save", function(next, user, callback) {
    var profile = this;
    var date = new Date();

    if (profile.isNew) {
        profile.generatedDate = date;
    }
    next(callback);
});

// profileSchema.statics.addSet = function(profileSet) {
// 	var Profile = this;
//     profileSet.forEach(function(userProfile) {
// 		var profile = new Profile();
//         profile.feature = userProfile.Feature;
//         profile.negative = userProfile.NegativeImage;
//         profile.positive = userProfile.PositiveImage;
//         profile.preference = userProfile.Preference;
//         profile.save();
//     });
//     return profileSet;
// }
//
// profileSchema.methods.addOne = function(userProfile) {
//     var profile = this;
//     profile.feature = userProfile.Feature;
//     profile.negative = userProfile.NegativeImage;
//     profile.positive = userProfile.PositiveImage;
//     profile.preference = userProfile.Preference;
//     profile.save();
//
//     return profile;
// }

/**
 * @module server/db/models/counter/_counter
 * @see counter
 *
 * @description Module that exports the Mongoose "counter" model.
 */
module.exports = mongoose.model('Profile', profileSchema);
