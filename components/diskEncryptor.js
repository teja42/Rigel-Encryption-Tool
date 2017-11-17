const crypto = require("crypto");
const rReader = require("fs-readdir-recursive");
const fs = require('fs');
const path = require("path");
const THREADS = require("os").cpus().length;
const events = require("events");
const sudo = require("sudo-prompt");
const db = require("nedb");

module.exports = class {

   constructor(mainWindow,ipcMain){
      this.mainWindow = mainWindow;
      this.ipcMain = ipcMain;
      this.cipherCore = new events.EventEmitter();
      ipcMain.on("getFileSystem",(evt,mntpnt)=>{
         this.getFileSystem(mntpnt).then((res)=>this.send("FileSystem",res));
      });
      ipcMain.on("prepare-encryption",(evt,mntpnt)=>{
         this._init(mntpnt);
      });
   }

   encodeName(x){
     return new Promise(async (resolve,reject)=>{
        const cipher = crypto.createCipher('aes192', this.PASSWORD);
        let encrypted = cipher.update(x,'utf8', 'hex');
        encrypted += cipher.final('hex');
        if(encrypted.length>240){
          console.log("240 reached . Storing in db.");
          let p;
          try{
             p = await this.storeFileName(encrypted);
          }catch(e){
            console.log("Error at storeFileName",e);
          }
          resolve(`@rigel.pro_Fn ${p}`);
        } else{
            resolve(encrypted);
        }
     });
    }

   storeFileName(x){
    return new Promise((resolve,reject)=>{
     let doc = { encName: x };
     let filesDb = new db({
        filename: `${this.mntpnt}/__CORE_rigel.pro/x100.db`,
        autoload: true
     });
     filesDb.insert(doc,(err,newdoc)=>{
       let id = newdoc._id;
       console.log(id);
       err?reject():resolve(id);
     });   
    });
  }

   send(evt,msg=""){
      this.mainWindow.webContents.send(evt,msg);
   }

   async getPath(x){
      let y = x.split(path.sep);
      let {length} = y;
      let _path = `${this.mntpnt}/__DATA_rigel.pro`;
      if(length>1){
         for(let i=0; i<(length-1) ; i++){
            let p = await this.encodeName(y[i]);
            console.log("Awaited value from encodeName",p);
            _path+=`/${p}`;
            fs.existsSync(_path)?true:(()=>{
              try{
                fs.mkdirSync(_path);
              } catch(e){ console.log("Error E1 : \n",e);}
            })();
         }
      }
      let p = await this.encodeName(y[length-1]);
      return new Promise((res,rej)=>res(`${_path}/${p}`));
   }

   encryptFile(pass,src,dest,id){
      let cipher = crypto.createCipher("aes192",pass);
      let input = fs.createReadStream(src);
      let output = fs.createWriteStream(dest);
      cipher.on("end",()=>{
         this.cipherCore.emit("complete", id );
         input.close();
         output.close();
      });
      input.pipe(cipher).pipe(output);
      this.send("encrypt:fileOn",id);
   }

   delete(path){
     return new Promise((res,rej)=>{
        fs.unlink(path,(err)=>{
        err?rej():res();
      });
     });
   }

   async start(mntpnt){
      this.mntpnt = mntpnt;
      let i,ec=0,ep=0;
      this.PASSWORD = "Password";
      try{ 
        fs.mkdirSync(`${mntpnt}/__DATA_rigel.pro`);
        fs.mkdirSync(`${mntpnt}/__CORE_rigel.pro`);
      }
      catch(e){ this.send("encrypt:main_dir_e"); console.log(e); return; }
      this.fileList = rReader(mntpnt);
      this.send("encrypt:fileList",this.fileList);
      for(i=0; i<THREADS && i<this.fileList.length ;i++){
         this.encryptFile(this.PASSWORD,`${mntpnt}/${this.fileList[i]}`,await this.getPath(this.fileList[i]),i);
         ep++;
      }
      this.cipherCore.on("complete",async (id)=>{
         try{await this.delete(this.fileList[id]);}
          catch(e){ console.log(e);}
         this.send("encrypt:fileOff",id);
         ec++;
         if((ec)==this.fileList.length){console.log("Ec"); return this.send("encryption-complete"); }
         if(ep!=this.fileList.length){
            this.encryptFile(this.PASSWORD,`${mntpnt}/${this.fileList[i]}`,await this.getPath(this.fileList[i]),i);
            ep++;
         }
         i++;
      });
   }

   async getFileSystem(mntpnt){
      return new Promise((resolve,reject)=>{
         let driveName;
         sudo.exec("df",{name:"Rigel Pro"},(err,stdo,stde)=>{
            if(stde||err){
              this.send("disk-prep:error");
              return reject();
            }
            let x = stdo.split("\n");
            for(let i=0;i<x.length;i++){
             if(x[i].indexOf(mntpnt)>-1){
                driveName = x[i].split(" ")[0];
             }
            }
            console.log("Completed Running : df");
            sudo.exec("blkid",{name: "Rigel Pro"},(err,stdo,stde)=>{
             console.log("Response from blkid");
             if(stde||err){
              this.send("disk-prep:error");
              return reject();
            }
             let x = stdo.split("\n");
             for(let i=0;i<x.length;i++){
                if(x[i].indexOf(driveName)>-1){
                   let y = x[i].split(" ");
                   for(i=0;i<y.length;i++){
                      if(y[i].indexOf("TYPE")>-1) return resolve({_fs:/"(.*?)"/.exec(y[i])[1],driveName});
                   }
                }
             }
             reject(); 
            });
          });
      });
   }

   _init(mntpnt){
      this.getFileSystem(mntpnt).then((res)=>{  
         let {_fs,driveName} = res;
         console.log(res);
         if(_fs.toLowerCase()!="exfat"){
           setTimeout(()=>{
            console.log("Attempting to format the drive as exFAT : Linux sys tool - mkfs.exfat");
            console.log(`mkfs.exfat -n "Rigel.pro" ${driveName}`);
            sudo.exec(`mkfs.exfat -n "Rigel.pro" ${driveName}`,
              {name:"Rigel Pro"},(err,stdo,stde)=>{
               if(err||stde) throw new Error("An error occured while formatting the drive");
               console.log("Format sucessful");
               this.start(mntpnt);
            });
           },1000);
         } else{
            this.start(mntpnt);
         }
      },e=>console.log("Drive might have been removed."));
   }

   reset(){
     this.mntpnt = null;
     this.fileList = null;
   }

}
