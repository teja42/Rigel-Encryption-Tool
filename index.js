const electron = require("electron");
const {BrowserWindow,app,shell,ipcMain,dialog} = electron;
const driveScanner = require("./components/driveScanner.js");
const diskEncryptor = require("./components/diskEncryptor.js");
const misc = require("./components/misc.js");
let mainWindow;

app.on("ready",()=>{
   if(process.argv[1]!=="."){
      //workWithFile(process.argv[0]);
      console.log(process.argv);
      return;
   }
   mainWindow = new BrowserWindow({
      minHeight:600,
      minWidth: 800
   });
   mainWindow.loadURL(`file://${__dirname}/ui/index.html`);

   new misc(mainWindow,ipcMain);

   setTimeout(()=>{
      new driveScanner(mainWindow,ipcMain);
      new diskEncryptor(mainWindow,ipcMain);
   },3000);

});

app.on("window-all-close",()=>app.exit(0));





//Mac
// diskutil eraseDisk ExFAT DiskName /dev/DiskNodeID

//Linux
// mkfs.exfat /dev/sdX1