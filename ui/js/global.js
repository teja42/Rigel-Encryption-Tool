(()=>{
   let windowDrag = document.createElement("div");
   windowDrag.setAttribute("id","window-drag");
   let div = document.createElement("div");
   let winClose = document.createElement("i");
   winClose.classList.add("win-close");
   winClose.classList.add("win-btn");
   winClose.classList.add("ion-close");
   let winResize = document.createElement("i");
   winResize.classList.add("ion-ios-browsers-outline");
   winResize.classList.add("win-btn");
   winResize.classList.add("win-resize");
   let winMin = document.createElement("i");
   winMin.classList.add("win-min");
   winMin.classList.add("win-btn");
   winMin.classList.add("ion-minus-round");
   div.appendChild(winClose);
   div.appendChild(winResize);
   div.appendChild(winMin);
   windowDrag.appendChild(div);
   let actualDrag = document.createElement("div");
   actualDrag.classList.add("actual-window-drag");
   windowDrag.appendChild(actualDrag);
   document.querySelector("body").appendChild(windowDrag);
      let {ipcRenderer} = require("electron");   
      winResize.onclick = ()=>{
         ipcRenderer.send("win-resize");
      }

      winMin.onclick = ()=>{
         ipcRenderer.send("win-min");
      }

      winClose.onclick = ()=>{
         ipcRenderer.send("win-close");
      }

   // Style sheet
   let link = document.createElement("link");
   link.setAttribute("rel","stylesheet");
   link.setAttribute("type","text/css");
   link.setAttribute("href",__dirname+"/css/global.css");
   document.querySelector("head").appendChild(link);
   
})();