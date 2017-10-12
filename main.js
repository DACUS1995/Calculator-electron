'use strict';

const electron = require("electron");
const url = require("url");
const path = require("path");

// Set environment variables
// process.env.NODE_ENV = "development";
process.env.NODE_ENV = "production";

const { app, BrowserWindow, Menu, ipcMain } = electron;
// require('electron-reload')(__dirname);

let mainWindow;
let resizable = process.env.NODE_ENV == "development" ? true : false;

//When main process is ready create renderer processes
app.on("ready", () => {
	// Create main window
	mainWindow = new BrowserWindow({
		resizable: resizable,
		'width': 335,
		'height': 360,
		icon: __dirname + "/img/Wolves.png"
	});

	// Load html in the window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file",
		slashes: true
	}))

	// Close main app when main window is closed
	mainWindow.on("closed", () => {
		app.quit();
	})

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
	app.quit()
  }
})

// Main menu template
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "Clear",
				click() {
					mainWindow.webContents.send("clear");
				}
			}
		]
	}
]


// If the run environment is not production show dev tools
if(process.env.NODE_ENV !== "production"){
	mainMenuTemplate.push({
		label: "Developer Tools",
		submenu: [
			{
				role:"reload"
			},
			{
				label: "Toggle DevTools",
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}           
		]
	});
}