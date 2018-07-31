const mongoose = require("mongoose");

const Profile = require("server/db/models/Profile/_Profile");

const async = require("async");

const comparisonSchema = new mongoose.Schema({
    feature: String,
    negative: String,
    positive: String,
    preference: String,
    created: Date,
});

comparisonSchema.pre("save", function(next, user, callback) {
    var comparison = this;
    var date = new Date();

    if (comparison.isNew) {
        comparison.created = date;
    }
    next(callback);
});

comparisonSchema.statics.addSetAndProfile = function(comparisonSet, role, callback) {
    var Comparison = this;

    var newUserProfile = new Profile({
        role: role
    });

    async.forEach(comparisonSet, addOneToSet, function() {
        // console.log("Profile: ", newUserProfile);
        callback(newUserProfile);
    });

    function addOneToSet(userComparison, cb) {
        var comparison = new Comparison();
        comparison.feature = userComparison.Feature;
        comparison.negative = userComparison.NegativeImage;
        comparison.positive = userComparison.PositiveImage;
        comparison.preference = userComparison.Preference;
        comparison.save(function(err, saved) {
            newUserProfile.comparisons = newUserProfile.comparisons.concat(saved);
            cb(err, saved);
        });
    }

}

comparisonSchema.methods.addOne = function(userComparison) {
    var comparison = this;
    return new Promise(function(resolve, reject) {
        comparison.feature = userComparison.Feature;
        comparison.negative = userComparison.NegativeImage;
        comparison.positive = userComparison.PositiveImage;
        comparison.preference = userComparison.Preference;
        comparison.save(function(err, saved) {
            if (!err) return resolve(saved);
            else return reject(err);
        });

    });
}

/**
 * @module server/db/models/counter/_counter
 * @see counter
 *
 * @description Module that exports the Mongoose "counter" model.
 */
module.exports = mongoose.model('Comparison', comparisonSchema);
