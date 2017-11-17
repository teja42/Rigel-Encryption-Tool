const {dialog,shell} = require("electron");

module.exports = class{
   constructor(mainWindow,ipcMain){
      this.mainWindow = mainWindow;
      ipcMain.on("show-msgBox",(evt,obj)=>{
         dialog.showMessageBox({
            title: obj.title,
            message: obj.message,
            type: "info",
            buttons: obj.btns?obj.btns:["Ok"]
         });
      });

      ipcMain.on("openFolder",(evt,path)=>shell.showItemInFolder(path+"/"));
   }

}
