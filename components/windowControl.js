module.exports = class{
   constructor(mainWindow,ipcMain){
      this.size = 1;
      ipcMain.on("win-resize",()=>{
         this.size?mainWindow.maximize():mainWindow.unmaximize();
         this.size?this.size=0:this.size=1;
      });

      ipcMain.on("win-close",()=>{
         mainWindow.close();
      });
      ipcMain.on("win-min",()=>{
         mainWindow.minimize();
      });
   }
}