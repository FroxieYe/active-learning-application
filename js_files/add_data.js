var mongoose = require('mongoose');
var fs = require('fs');
var db = mongoose.connection;
var dbConfig = require('./db');

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.

	var Schema = mongoose.Schema;   
	var schema = new Schema({
	    id: String,
	    photo: {
	        data: Buffer,
	        contentType: String
	    },
	    NV: Number,
	    NYYes: Number,
	    QSO: Number,
	    QSOYes: Number,
	    BE: Number,
	    BEYes: Number,
	    CEPH: Number,
	    CEPHYes: Number,
	    RRL: Number,
	    RRLYes: Number,
	    EB: Number,
	    EBYes: Number,
	    ML: Number,
	    MLYes: Number,
	    LPV: Number,
	    LPVYes: Number,
	    isLabel: Number,
	    Label: String
	});

	var Photo = mongoose.model('Photo', schema);
	/*
	Add new data to the database. If the filename already exists, new data would not be added.
	@Param imgPath: path of the time series file, including the filename and its suffix.
	@Param filename: filename of the time series file without png / jpg suffix.
	@Param islabel: binary data. The value is either 1 or 0. 1 means we have the correct label.
	*/
	function add_time_series(imgPath, filename, islabel) {
		Photo.find({id: filename},  function (err, docs) {
		  	if (docs.length){
		     	console.log('Item exists already!');
		  	}else{
		      	var imgPath = imgPath;
				var tmp = filename.match( /\d/,'$2');

				var instance = new Photo({
					NV: 0,
				    NYYes: 0,
				    QSO: 0,
				    QSOYes: 0,
				    BE: 0,
				    BEYes: 0,
				    CEPH: 0,
				    CEPHYes: 0,
				    RRL: 0,
				    RRLYes: 0,
				    EB: 0,
				    EBYes: 0,
				    ML: 0,
				    MLYes: 0,
				    LPV: 0,
				    LPVYes: 0,
					isLabel: islabel,
					Label: label
				});
				var start = filename.indexOf(tmp);
				if (islabel)
					instance.Label = filename.substring(0,start);
				else
					instance.Label = "None";
				instance.id = filename;
				instance.photo.data = fs.readFileSync(imgPath);
				instance.photo.contentType = 'image/png';
				
				instance.save(function(err, instance) {
					if (err) return console.error(err);
					console.dir(instance);
				});
		  	}
		}); 
		
	}

	var sample_list = 
	['BE14530136R',
	 'BE14653105B',
	 'CEPH1344813B',
	 'CEPH1344962R',
	 'EB13444614B',
	 'EB13444880R',
	 'LPV1345053B',
	 'LPV135617R',
	 'ML101209081433B',
	 'ML101209102922R',
	 'QSO135962237B',
	 'QSO136805324R',
	 'RRL134431313B',
	 'RRL134431335R'
	]
	
	//Add sample to the database here. Each sample should be added once only.
	
	for (var i = 0; i<sample_list.length; i++)
		add_time_series('../time_series_plot/' + sample_list[i] + '.png', sample_list[i], 1);
		//Photo.find({id: sample_list[i]}).remove().exec();
	
	
});

mongoose.connect(dbConfig.url);