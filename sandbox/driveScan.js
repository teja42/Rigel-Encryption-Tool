const drivelist = require("drivelist");

drivelist.list((err,drives)=>console.log(JSON.stringify(drives,undefined,2)));