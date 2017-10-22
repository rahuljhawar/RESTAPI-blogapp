var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var blogSchema=new Schema({

	title:{type:String,default:'',required:true},
	author:{type:String,default:'',required:true},
	blogBody:{type:String,default:'',required:true},
	createdOn:{type:Date,default:Date.now},
	lastModified:{type:Date},
	comments: [{ body: String, date: Date }],

});

mongoose.model('Blog',blogSchema);
