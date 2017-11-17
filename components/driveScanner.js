const driveList = require("drivelist");
const os = require("os");
const path = require("path");

module.exports = class {

   constructor(mainWindow,ipcMain){
      this.send = (event,msg)=>mainWindow.webContents.send(event,msg);
      this.dir = os.homedir().split(path.sep)[0];
      this.getDrivesAndSend = ()=>{
         driveList.list((err,drives)=>{
            if(err){return this.send("list-usb",-1); }
            let res = [];
            let c=0;
            for(let i=0;i<drives.length;i++){
               for(let j=0;j<=drives[i].mountpoints.length;j++){
                  if(j==drives[i].mountpoints.length && j>0){
                     break;
                  }
                  res[c] = {};
                  res[c].description = drives[i].description;
                  res[c].size = this.parseSize(drives[i].size);
                  res[c].name = drives[i].displayName;
                  if(drives[i].mountpoints.length==0){
                     res[c].mountpoint = "Not Mounted";
                     c++;
                     break;
                  }
                  res[c].mountpoint = drives[i].mountpoints[j].path;
                  if(this.isRootDir(res[c].mountpoint)){
                     res[c] = null;
                     continue;
                  }
                  c++;
               }
            }
            this.send("list-usb",res);
         });
      }

      (()=>{
         setInterval(()=>this.getDrivesAndSend(),2000);
      })();
   }

   isRootDir(x){
      if(process.platform==="win32"){
         if(x==this.dir) return true;
         else return false;
      }else{
         if(x=="/") return true;
         else return false;
      }
   }

   parseSize(x){
      let gb = 1024*1024*1024;
      let y,z;
      if(x>=gb*1024){
         y=x/(gb*1024);z=" TB";
      }
      if(x>=gb){
         y= x/gb; z=" GB";
      } else{
         y= x/(gb/1024); z=" MB";
      }
      return y.toFixed(2) + z;
   }
}