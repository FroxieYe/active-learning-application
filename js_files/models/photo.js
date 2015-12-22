var mongoose = require("mongoose");

module.exports = mongoose.model('Photo', {
	/*
	id: String,
	photoname: String,
	predLabel: String,
	predLabelProbability: Number,
	userLabelCnt: Number,
	totalResponseCnt: Number,
	category: String
	*/
	photo: {
		data: Buffer,
		title: String,
		contentType: String
	}
	
});