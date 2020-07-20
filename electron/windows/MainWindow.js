const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const url = require("url");
const isDev = require("electron-is-dev");
const path = require("path");

class MainWindow extends BrowserWindow {
  constructor(options) {
    super(options);
    this.init();
  }

  init = () => {
    this.loadURL(
      isDev
        ? "http://localhost:3000"
        : url.format({
            pathname: path.join(__dirname, "../../index.html"),
            protocol: "file:",
            slashes: true,
          })
    );
    this.createMainMenu();

    this.ipcInit();
  };

  createMainMenu = () => {
    const mainMenuTemplate = [
      {
        label: "Controls",
        submenu: [
          {
            label: "Start/Stop",
            accelerator: "space",
            click: () => {
              this.webContents.send("beats:start-stop");
            },
          },
          {
            label: "Faster +10",
            accelerator: "numadd",
            click: () => {
              this.webContents.send("beats:change-speed", 10);
            },
          },
          {
            label: "Slower -10",
            accelerator: "numsub",
            click: () => {
              this.webContents.send("beats:change-speed", -10);
            },
          },
          {
            label: "Faster +1",
            accelerator: "Control+numadd",
            click: () => {
              this.webContents.send("beats:change-speed", 1);
            },
          },
          {
            label: "Slower -1",
            accelerator: "Control+numsub",
            click: () => {
              this.webContents.send("beats:change-speed", -1);
            },
          },
          {
            label: "Toggle Focus Mode",
            accelerator: "F",
            click: () => {
              this.webContents.send("app:toggle-focus", "");
            },
          },
          {
            label: "Tap BPM",
            accelerator: "T",
            click: () => {
              this.webContents.send("beats:tap-bpm", "");
            },
          },
        ],
      },
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "hide" },
          { role: "close" },
          { role: "quit" },
        ],
      },
    ];

    const appNamedMenu = {
      label: app.name,
      submenu: [
        {
          label: "Reset App",
          click: () => {
            this.webContents.send("app:reset");
          },
        },
      ],
    };

    if (isDev) {
      mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
          {
            label: "Toggle DevTools",
            click(item, focusedWindow) {
              focusedWindow.toggleDevTools();
            },
            accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I",
          },
          { role: "reload" },
        ],
      });
    }

    const mainMenu = Menu.buildFromTemplate([
      appNamedMenu,
      ...mainMenuTemplate,
    ]);
    Menu.setApplicationMenu(mainMenu);
  };

  ipcInit = () => {
    ipcMain.on("reload", () => {
      this.reload();
    });
  };
}

module.exports = MainWindow;
