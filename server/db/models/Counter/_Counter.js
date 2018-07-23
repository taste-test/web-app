var MEANLib = require("server/mean-lib").module;
var mongoose = MEANLib.modules.mongoose;

var counterSchema = new mongoose.Schema({
	count: Number,
	created: Date,
	accessed: Date,
	production: Boolean
});

counterSchema.pre("save", function(next, user, callback) {
    var counter = this;
    var date = new Date();

	if (counter.isNew) { counter.created = date; }
	counter.accessed = date;
    next(callback);
});

counterSchema.methods.addCount = function(){
    var counter = this;
    counter.count += 1;
    counter.save();
	return counter.count;
}

/**
 * @module server/db/models/counter/_counter
 * @see counter
 *
 * @description Module that exports the Mongoose "counter" model.
 */
module.exports = mongoose.model('Counter', counterSchema);
