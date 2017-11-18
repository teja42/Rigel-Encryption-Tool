const db = require("nedb");
filesDb = new db({filename: `/media/teja/Rigel.pro2/__CORE_rigel.pro/x100.db`,autoload:true});
filesDb.insert({name: "test"},(err,newdoc)=>{
  err?console.log(err):console.log(newdoc._id);
});  