/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => revealExplorerFile
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var revealExplorerFileSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "Reveal Explorer File" });
    const content = `<p>Repository: \u{1F334} <a href="https://github.com/1C0D/Obsidian-Reveal-File-in-explorer">1C0D/Obsidian-Reveal-File-in-explorer</a> \u{1F334}</p>`;
    containerEl.createDiv("", (el) => {
      el.innerHTML = content;
    });
    containerEl.createEl("h4", { text: "On header title clicking" });
    this.createToggle(
      containerEl,
      "Fold when clicking title",
      "When clicking title, close all folders where the file is not in",
      "foldOtherDirsBefore"
    );
    containerEl.createEl("h4", { text: "On file opening" });
    this.createToggle(
      containerEl,
      "Reveal when opening file",
      "When opening a file, it will reveal it",
      "revealOnOpen",
      true
    );
    if (this.plugin.settings.revealOnOpen) {
      this.createToggle(
        containerEl,
        "Fold when opening file",
        "When opening a file, it will also fold other folders",
        "foldWhenOpen"
      );
      this.createToggle(
        containerEl,
        "Enable Reveal when opening file from Explorer",
        "If disabled, the reveal will only happen using quick switcher",
        "enableRevealExplorer"
      );
      new import_obsidian.Setting(containerEl).setName("Excluded Folders from reveal on opening").setDesc(
        "Comma-separated list of Folders(case sensitive) to exclude from being revealed on opening. You can use 'copy file path' in the palette to get the path, but don't forget to delete the filename from the path. "
      ).addText(
        (text) => text.setPlaceholder(
          "folder/subfolder, folder, ..."
        ).setValue(this.plugin.settings.excludedFolders).onChange(async (value) => {
          this.plugin.settings.excludedFolders = value;
          await this.plugin.saveSettings();
        })
      );
    }
  }
  createToggle(containerEl, name, desc, prop, display) {
    new import_obsidian.Setting(containerEl).setName(name).setDesc(desc).addToggle(
      (bool) => bool.setValue(this.plugin.settings[prop]).onChange(async (value) => {
        this.plugin.settings[prop] = value;
        await this.plugin.saveSettings();
        this.plugin.reveal();
        if (display) {
          this.display();
        }
      })
    );
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  foldOtherDirsBefore: true,
  revealOnOpen: true,
  foldWhenOpen: true,
  // enableExclude: false,
  excludedFolders: "",
  enableRevealExplorer: true
};
var revealExplorerFile = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.disableRevealExplorer = false;
    this.reveal = () => {
      const { workspace } = this.app;
      const containerEl = workspace.containerEl.win;
      this.registerDomEvent(containerEl, "click", this.clickHandler, true);
      this.registerEvent(
        workspace.on(
          "file-open",
          this.onFileOpen
        )
      );
    };
    this.onFileOpen = async () => {
      if (this.settings.revealOnOpen && !this.disableRevealExplorer) {
        const { workspace } = this.app;
        const activeView = workspace.getActiveViewOfType(import_obsidian2.View);
        const path = activeView.leaf.getViewState().state.file;
        if (!this.is_view_explorer_open() || this.pathIsExcluded(path) || (path == null ? void 0 : path.endsWith(".table"))) {
          return;
        }
        if (this.settings.foldWhenOpen) {
          await this.fold();
        }
        const revealPromise1 = this.app.commands.executeCommandById("file-explorer:reveal-active-file");
        const revealPromise2 = this.app.commands.executeCommandById("file-explorer:reveal-active-file");
        await Promise.all([revealPromise1, revealPromise2]);
        setTimeout(
          async () => {
            this.app.workspace.setActiveLeaf(activeView.leaf, {
              focus: true
            });
          },
          50
        );
      } else {
        setTimeout(async () => {
          this.disableRevealExplorer = false;
        }, 200);
      }
    };
    this.clickHandler = async (evt) => {
      var _a;
      const clickedElement = evt.target;
      const isFileExplorer = clickedElement.classList.contains("tree-item-self") && clickedElement.classList.contains("nav-file-title") || clickedElement.classList.contains("tree-item-inner") && clickedElement.classList.contains("nav-file-title-content");
      if (clickedElement == null ? void 0 : clickedElement.classList.contains("view-header-title")) {
        const { workspace } = this.app;
        const activeView = workspace.getActiveViewOfType(import_obsidian2.View);
        const isNewTab = (activeView == null ? void 0 : activeView.getDisplayText()) === "New tab";
        if (isNewTab) {
          return;
        }
        if (this.settings.foldOtherDirsBefore) {
          await this.fold();
        }
        await this.app.commands.executeCommandById(
          "file-explorer:reveal-active-file"
        );
        await this.app.commands.executeCommandById("editor:focus");
        const titleContainerEl = (_a = activeView == null ? void 0 : activeView.containerEl) == null ? void 0 : _a.querySelector(".view-header-title");
        setTimeout(() => {
          titleContainerEl == null ? void 0 : titleContainerEl.focus();
        }, 50);
      } else if (this.settings.revealOnOpen && !this.settings.enableRevealExplorer && isFileExplorer) {
        this.disableRevealExplorer = true;
        const { parentElement } = clickedElement;
        if (parentElement) {
          const clickEvent = new Event("click");
          parentElement.dispatchEvent(clickEvent);
        }
      }
    };
    this.fold = async () => {
      var _a;
      const { workspace } = this.app;
      const fileExplorer = (_a = workspace.getLeavesOfType("file-explorer")) == null ? void 0 : _a.first();
      const activeView = workspace.getActiveViewOfType(import_obsidian2.View);
      if ((activeView == null ? void 0 : activeView.getDisplayText()) === "New tab") {
        return;
      }
      const files = Object.entries((fileExplorer == null ? void 0 : fileExplorer.view).fileItems);
      for (const [path, fileItem] of files) {
        if (path === "/") {
          continue;
        }
        const isFold = fileItem.file instanceof import_obsidian2.TFolder;
        if (isFold) {
          await fileItem.setCollapsed(true);
        }
      }
    };
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new revealExplorerFileSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      this.reveal();
    });
  }
  is_view_explorer_open() {
    const { workspace } = this.app;
    let is_open = false;
    workspace.iterateAllLeaves((leaf) => {
      if (leaf.getViewState().type == "file-explorer" && leaf.width > 0) {
        is_open = true;
      }
    });
    return is_open;
  }
  pathIsExcluded(path) {
    const excludedFolders = this.settings.excludedFolders;
    if (!this.settings.revealOnOpen || !excludedFolders)
      return false;
    const newList = excludedFolders.split(",").map((x) => x.trim().replace(/^\/+|\/+$/g, "")).filter((x) => x !== "");
    return newList.some((value) => path == null ? void 0 : path.startsWith(value));
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3NldHRpbmdzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIFRGaWxlLCBURm9sZGVyLCBWaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IHJldmVhbEV4cGxvcmVyRmlsZVNldHRpbmdzVGFiIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcclxuXHJcbmludGVyZmFjZSByZXZlYWxFeHBsb3JlckZpbGVTZXR0aW5ncyB7XHJcblx0Zm9sZE90aGVyRGlyc0JlZm9yZTogYm9vbGVhbjtcclxuXHRyZXZlYWxPbk9wZW46IGJvb2xlYW47XHJcblx0Zm9sZFdoZW5PcGVuOiBib29sZWFuO1xyXG5cdC8vIGVuYWJsZUV4Y2x1ZGU6IGJvb2xlYW47XHJcblx0ZXhjbHVkZWRGb2xkZXJzOiBzdHJpbmcsXHJcblx0ZW5hYmxlUmV2ZWFsRXhwbG9yZXI6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IHJldmVhbEV4cGxvcmVyRmlsZVNldHRpbmdzID0ge1xyXG5cdGZvbGRPdGhlckRpcnNCZWZvcmU6IHRydWUsXHJcblx0cmV2ZWFsT25PcGVuOiB0cnVlLFxyXG5cdGZvbGRXaGVuT3BlbjogdHJ1ZSxcclxuXHQvLyBlbmFibGVFeGNsdWRlOiBmYWxzZSxcclxuXHRleGNsdWRlZEZvbGRlcnM6IFwiXCIsXHJcblx0ZW5hYmxlUmV2ZWFsRXhwbG9yZXI6IHRydWVcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHJldmVhbEV4cGxvcmVyRmlsZSBleHRlbmRzIFBsdWdpbiB7XHJcblx0c2V0dGluZ3M6IHJldmVhbEV4cGxvcmVyRmlsZVNldHRpbmdzO1xyXG5cdGRpc2FibGVSZXZlYWxFeHBsb3JlciA9IGZhbHNlXHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IHJldmVhbEV4cGxvcmVyRmlsZVNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XHJcblx0XHRcdHRoaXMucmV2ZWFsKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldmVhbCA9ICgpID0+IHtcclxuXHRcdGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcclxuXHRcdGNvbnN0IGNvbnRhaW5lckVsID0gd29ya3NwYWNlLmNvbnRhaW5lckVsLndpbjsgLy93aW4gLT4gbXVsdGkgd2luZG93c1xyXG5cdFx0Ly8gdmlldy1oZWFkZXItdGl0bGUgY2xpY2tcclxuXHRcdHRoaXMucmVnaXN0ZXJEb21FdmVudChjb250YWluZXJFbCwgXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlciwgdHJ1ZSk7Ly90cnVlIHRvIGludGVyY2VwdCBldmVudCB0YXJnZXQgaWYgY2xpY2sgaW4gZXhwbG9yZXJcclxuXHRcdHRoaXMucmVnaXN0ZXJFdmVudChcclxuXHRcdFx0d29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsIHRoaXMub25GaWxlT3BlblxyXG5cdFx0XHQpKVxyXG5cdH07XHJcblxyXG5cdG9uRmlsZU9wZW4gPSBhc3luYyAoKSA9PiB7XHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5yZXZlYWxPbk9wZW4gJiYgIXRoaXMuZGlzYWJsZVJldmVhbEV4cGxvcmVyKSB7XHJcblx0XHRcdGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcclxuXHRcdFx0Y29uc3QgYWN0aXZlVmlldyA9IHdvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKFZpZXcpO1xyXG5cdFx0XHQvLyBhZGRlZCBhIGZpeCBvbiAqLnRhYmxlIGZvciB0aGUgcGx1Z2luIE5vdGlvbiBsaWtlIHRhYmxlLiBidWcgd2l0aCB0aGUgb2JzaWRpYW4gcmV2ZWFsIGNvbW1hbmRcclxuXHRcdFx0Y29uc3QgcGF0aCA9IGFjdGl2ZVZpZXchLmxlYWYuZ2V0Vmlld1N0YXRlKCkuc3RhdGUuZmlsZVxyXG5cdFx0XHRpZiAoIXRoaXMuaXNfdmlld19leHBsb3Jlcl9vcGVuKCkgfHwgdGhpcy5wYXRoSXNFeGNsdWRlZChwYXRoKSB8fCBwYXRoPy5lbmRzV2l0aChcIi50YWJsZVwiKSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZm9sZFdoZW5PcGVuKSB7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5mb2xkKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gYXBwYXJlbnRseSB0aGUgcmV2ZWFsIGZhaWxzIHNvbWV0aW1lXHJcblx0XHRcdGNvbnN0IHJldmVhbFByb21pc2UxID0gKHRoaXMuYXBwIGFzIGFueSkuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKFwiZmlsZS1leHBsb3JlcjpyZXZlYWwtYWN0aXZlLWZpbGVcIik7XHJcblx0XHRcdGNvbnN0IHJldmVhbFByb21pc2UyID0gKHRoaXMuYXBwIGFzIGFueSkuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKFwiZmlsZS1leHBsb3JlcjpyZXZlYWwtYWN0aXZlLWZpbGVcIik7XHJcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFtyZXZlYWxQcm9taXNlMSwgcmV2ZWFsUHJvbWlzZTJdKTtcclxuXHRcdFx0Ly8gZm9jdXMgb24gYWN0aXZlIGxlYWZcclxuXHRcdFx0c2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYoYWN0aXZlVmlldyEubGVhZiwge1xyXG5cdFx0XHRcdFx0Zm9jdXM6IHRydWUsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHQsIDUwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZGlzYWJsZVJldmVhbEV4cGxvcmVyID0gZmFsc2VcclxuXHRcdFx0fSwgMjAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsaWNrSGFuZGxlciA9IGFzeW5jIChldnQ6IGFueSkgPT4ge1xyXG5cdFx0Y29uc3QgY2xpY2tlZEVsZW1lbnQgPSBldnQudGFyZ2V0O1xyXG5cdFx0Ly8gaWYgY2xpY2sgb24gYSBmaWxlIGluIGV4cGxvcmVyXHJcblx0XHRjb25zdCBpc0ZpbGVFeHBsb3JlciA9XHJcblx0XHRcdGNsaWNrZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInRyZWUtaXRlbS1zZWxmXCIpXHJcblx0XHRcdCYmIGNsaWNrZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdi1maWxlLXRpdGxlXCIpXHJcblx0XHRcdHx8IGNsaWNrZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInRyZWUtaXRlbS1pbm5lclwiKVxyXG5cdFx0XHQmJiBjbGlja2VkRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXYtZmlsZS10aXRsZS1jb250ZW50XCIpXHJcblxyXG5cdFx0aWYgKGNsaWNrZWRFbGVtZW50Py5jbGFzc0xpc3QuY29udGFpbnMoXCJ2aWV3LWhlYWRlci10aXRsZVwiKSkge1xyXG5cdFx0XHQvLyBkb24ndCB0cmlnZ2VyIG9uIE5ldyB0YWJcclxuXHRcdFx0Y29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xyXG5cdFx0XHRjb25zdCBhY3RpdmVWaWV3ID0gd29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoVmlldyk7XHJcblx0XHRcdGNvbnN0IGlzTmV3VGFiID0gYWN0aXZlVmlldz8uZ2V0RGlzcGxheVRleHQoKSA9PT0gXCJOZXcgdGFiXCI7XHJcblx0XHRcdGlmIChpc05ld1RhYikge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZm9sZE90aGVyRGlyc0JlZm9yZSkge1xyXG5cdFx0XHRcdGF3YWl0IHRoaXMuZm9sZCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF3YWl0ICh0aGlzLmFwcCBhcyBhbnkpLmNvbW1hbmRzLmV4ZWN1dGVDb21tYW5kQnlJZChcclxuXHRcdFx0XHRcImZpbGUtZXhwbG9yZXI6cmV2ZWFsLWFjdGl2ZS1maWxlXCJcclxuXHRcdFx0KTtcclxuXHRcdFx0YXdhaXQgKHRoaXMuYXBwIGFzIGFueSkuY29tbWFuZHMuZXhlY3V0ZUNvbW1hbmRCeUlkKFwiZWRpdG9yOmZvY3VzXCIpO1xyXG5cclxuXHRcdFx0Y29uc3QgdGl0bGVDb250YWluZXJFbCA9XHJcblx0XHRcdFx0YWN0aXZlVmlldz8uY29udGFpbmVyRWw/LnF1ZXJ5U2VsZWN0b3IoXCIudmlldy1oZWFkZXItdGl0bGVcIik7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdCh0aXRsZUNvbnRhaW5lckVsIGFzIGFueSk/LmZvY3VzKCk7XHJcblx0XHRcdH0sIDUwKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MucmV2ZWFsT25PcGVuICYmICF0aGlzLnNldHRpbmdzLmVuYWJsZVJldmVhbEV4cGxvcmVyICYmIGlzRmlsZUV4cGxvcmVyKSB7XHJcblx0XHRcdHRoaXMuZGlzYWJsZVJldmVhbEV4cGxvcmVyID0gdHJ1ZVxyXG5cdFx0XHRjb25zdCB7IHBhcmVudEVsZW1lbnQgfSA9IGNsaWNrZWRFbGVtZW50O1xyXG5cdFx0XHRpZiAocGFyZW50RWxlbWVudCkge1xyXG5cdFx0XHRcdGNvbnN0IGNsaWNrRXZlbnQgPSBuZXcgRXZlbnQoXCJjbGlja1wiKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRmb2xkID0gYXN5bmMgKCkgPT4ge1xyXG5cdFx0Y29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xyXG5cdFx0Y29uc3QgZmlsZUV4cGxvcmVyID0gd29ya3NwYWNlXHJcblx0XHRcdC5nZXRMZWF2ZXNPZlR5cGUoXCJmaWxlLWV4cGxvcmVyXCIpXHJcblx0XHRcdD8uZmlyc3QoKTtcclxuXHRcdC8vIGRvbid0IHRyaWdnZXIgb24gTmV3IHRhYlxyXG5cdFx0Y29uc3QgYWN0aXZlVmlldyA9IHdvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKFZpZXcpO1xyXG5cdFx0aWYgKGFjdGl2ZVZpZXc/LmdldERpc3BsYXlUZXh0KCkgPT09IFwiTmV3IHRhYlwiKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBmaWxlcyA9IE9iamVjdC5lbnRyaWVzKChmaWxlRXhwbG9yZXI/LnZpZXcgYXMgYW55KS5maWxlSXRlbXMpO1xyXG5cdFx0Zm9yIChjb25zdCBbcGF0aCwgZmlsZUl0ZW1dIG9mIGZpbGVzKSB7XHJcblx0XHRcdC8vIGRvbid0IGNvbGxhcHNlIHJvb3RcclxuXHRcdFx0aWYgKHBhdGggPT09IFwiL1wiKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29sbGFwc2UgZm9sZGVyc1xyXG5cdFx0XHRjb25zdCBpc0ZvbGQgPSAoZmlsZUl0ZW0gYXMgYW55KS5maWxlIGluc3RhbmNlb2YgVEZvbGRlcjtcclxuXHRcdFx0aWYgKGlzRm9sZCkge1xyXG5cdFx0XHRcdGF3YWl0IChmaWxlSXRlbSBhcyBhbnkpLnNldENvbGxhcHNlZCh0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdGlzX3ZpZXdfZXhwbG9yZXJfb3BlbigpOiBib29sZWFuIHtcclxuXHRcdGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcclxuXHRcdGxldCBpc19vcGVuID0gZmFsc2U7XHJcblx0XHR3b3Jrc3BhY2UuaXRlcmF0ZUFsbExlYXZlcygobGVhZikgPT4ge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0bGVhZi5nZXRWaWV3U3RhdGUoKS50eXBlID09IFwiZmlsZS1leHBsb3JlclwiICYmXHJcblx0XHRcdFx0KGxlYWYgYXMgYW55KS53aWR0aCA+IDBcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0aXNfb3BlbiA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGlzX29wZW47XHJcblx0fVxyXG5cclxuXHRwYXRoSXNFeGNsdWRlZChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGNvbnN0IGV4Y2x1ZGVkRm9sZGVycyA9IHRoaXMuc2V0dGluZ3MuZXhjbHVkZWRGb2xkZXJzO1xyXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLnJldmVhbE9uT3BlbiB8fCAhZXhjbHVkZWRGb2xkZXJzKSByZXR1cm4gZmFsc2U7XHJcblx0XHRjb25zdCBuZXdMaXN0ID0gZXhjbHVkZWRGb2xkZXJzLnNwbGl0KFwiLFwiKS5tYXAoeCA9PiB4LnRyaW0oKS5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCBcIlwiKSkuZmlsdGVyKHggPT4geCAhPT0gXCJcIik7XHJcblx0XHRyZXR1cm4gbmV3TGlzdC5zb21lKHZhbHVlID0+IHBhdGg/LnN0YXJ0c1dpdGgodmFsdWUpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihcclxuXHRcdHt9LFxyXG5cdFx0REVGQVVMVF9TRVRUSU5HUyxcclxuXHRcdGF3YWl0IHRoaXMubG9hZERhdGEoKVxyXG5cdCk7XHJcbn1cclxuXHJcblx0YXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG5cdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbn1cclxufVxyXG4iLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCByZXZlYWxFeHBsb3JlckZpbGUgZnJvbSBcInNyYy9tYWluXCI7XHJcbmltcG9ydCBEdXBsaWNhdGVUYWJzIGZyb20gXCJzcmMvbWFpblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIHJldmVhbEV4cGxvcmVyRmlsZVNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0cGx1Z2luOiByZXZlYWxFeHBsb3JlckZpbGU7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IER1cGxpY2F0ZVRhYnMpIHtcclxuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0ZGlzcGxheSgpOiB2b2lkIHtcclxuXHRcdGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMVwiLCB7IHRleHQ6IFwiUmV2ZWFsIEV4cGxvcmVyIEZpbGVcIiB9KTtcclxuXHRcdGNvbnN0IGNvbnRlbnQgPVxyXG5cdFx0XHRgPHA+UmVwb3NpdG9yeTogXHVEODNDXHVERjM0IDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vMUMwRC9PYnNpZGlhbi1SZXZlYWwtRmlsZS1pbi1leHBsb3JlclwiPjFDMEQvT2JzaWRpYW4tUmV2ZWFsLUZpbGUtaW4tZXhwbG9yZXI8L2E+IFx1RDgzQ1x1REYzNDwvcD5gO1xyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRGl2KFwiXCIsIChlbDogSFRNTERpdkVsZW1lbnQpID0+IHtcclxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDRcIiwgeyB0ZXh0OiBcIk9uIGhlYWRlciB0aXRsZSBjbGlja2luZ1wiIH0pO1xyXG5cclxuXHRcdHRoaXMuY3JlYXRlVG9nZ2xlKFxyXG5cdFx0XHRjb250YWluZXJFbCxcclxuXHRcdFx0XCJGb2xkIHdoZW4gY2xpY2tpbmcgdGl0bGVcIixcclxuXHRcdFx0XCJXaGVuIGNsaWNraW5nIHRpdGxlLCBjbG9zZSBhbGwgZm9sZGVycyB3aGVyZSB0aGUgZmlsZSBpcyBub3QgaW5cIixcclxuXHRcdFx0XCJmb2xkT3RoZXJEaXJzQmVmb3JlXCJcclxuXHRcdCk7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoXCJoNFwiLCB7IHRleHQ6IFwiT24gZmlsZSBvcGVuaW5nXCIgfSk7XHJcblxyXG5cdFx0dGhpcy5jcmVhdGVUb2dnbGUoXHJcblx0XHRcdGNvbnRhaW5lckVsLFxyXG5cdFx0XHRcIlJldmVhbCB3aGVuIG9wZW5pbmcgZmlsZVwiLFxyXG5cdFx0XHRcIldoZW4gb3BlbmluZyBhIGZpbGUsIGl0IHdpbGwgcmV2ZWFsIGl0XCIsXHJcblx0XHRcdFwicmV2ZWFsT25PcGVuXCIsXHJcblx0XHRcdHRydWVcclxuXHRcdCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnJldmVhbE9uT3Blbikge1xyXG5cdFx0XHR0aGlzLmNyZWF0ZVRvZ2dsZShcclxuXHRcdFx0XHRjb250YWluZXJFbCxcclxuXHRcdFx0XHRcIkZvbGQgd2hlbiBvcGVuaW5nIGZpbGVcIixcclxuXHRcdFx0XHRcIldoZW4gb3BlbmluZyBhIGZpbGUsIGl0IHdpbGwgYWxzbyBmb2xkIG90aGVyIGZvbGRlcnNcIixcclxuXHRcdFx0XHRcImZvbGRXaGVuT3BlblwiXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHR0aGlzLmNyZWF0ZVRvZ2dsZShcclxuXHRcdFx0XHRjb250YWluZXJFbCxcclxuXHRcdFx0XHRcIkVuYWJsZSBSZXZlYWwgd2hlbiBvcGVuaW5nIGZpbGUgZnJvbSBFeHBsb3JlclwiLFxyXG5cdFx0XHRcdFwiSWYgZGlzYWJsZWQsIHRoZSByZXZlYWwgd2lsbCBvbmx5IGhhcHBlbiB1c2luZyBxdWljayBzd2l0Y2hlclwiLFxyXG5cdFx0XHRcdFwiZW5hYmxlUmV2ZWFsRXhwbG9yZXJcIlxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdFx0LnNldE5hbWUoXCJFeGNsdWRlZCBGb2xkZXJzIGZyb20gcmV2ZWFsIG9uIG9wZW5pbmdcIilcclxuXHRcdFx0XHQuc2V0RGVzYyhcclxuXHRcdFx0XHRcdFwiQ29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgRm9sZGVycyhjYXNlIHNlbnNpdGl2ZSkgdG8gZXhjbHVkZSBmcm9tIGJlaW5nIHJldmVhbGVkIG9uIG9wZW5pbmcuIFwiICtcclxuXHRcdFx0XHRcdFwiWW91IGNhbiB1c2UgJ2NvcHkgZmlsZSBwYXRoJyBpbiB0aGUgcGFsZXR0ZSB0byBnZXQgdGhlIHBhdGgsIGJ1dCBkb24ndCBmb3JnZXQgdG8gZGVsZXRlIHRoZSBmaWxlbmFtZSBmcm9tIHRoZSBwYXRoLiBcIlxyXG5cdFx0XHRcdClcclxuXHRcdFx0XHQuYWRkVGV4dCgodGV4dCkgPT5cclxuXHRcdFx0XHRcdHRleHRcclxuXHRcdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKFxyXG5cdFx0XHRcdFx0XHRcdFwiZm9sZGVyL3N1YmZvbGRlciwgZm9sZGVyLCAuLi5cIlxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlZEZvbGRlcnMpXHJcblx0XHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlZEZvbGRlcnMgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjcmVhdGVUb2dnbGUoXHJcblx0XHRjb250YWluZXJFbDogSFRNTEVsZW1lbnQsXHJcblx0XHRuYW1lOiBzdHJpbmcsXHJcblx0XHRkZXNjOiBzdHJpbmcsXHJcblx0XHRwcm9wOiBzdHJpbmcsXHJcblx0XHRkaXNwbGF5PzogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKG5hbWUpXHJcblx0XHRcdC5zZXREZXNjKGRlc2MpXHJcblx0XHRcdC5hZGRUb2dnbGUoKGJvb2wpID0+XHJcblx0XHRcdFx0Ym9vbFxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyBhbnkpW3Byb3BdIGFzIGJvb2xlYW4pXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdCh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyBhbnkpW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5yZXZlYWwoKTtcclxuXHRcdFx0XHRcdFx0aWYgKGRpc3BsYXkpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmRpc3BsYXkoKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHQpO1xyXG5cdH1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUFBQSxtQkFBNkM7OztBQ0E3QyxzQkFBK0M7QUFJeEMsSUFBTSxnQ0FBTixjQUE0QyxpQ0FBaUI7QUFBQSxFQUduRSxZQUFZLEtBQVUsUUFBdUI7QUFDNUMsVUFBTSxLQUFLLE1BQU07QUFDakIsU0FBSyxTQUFTO0FBQUEsRUFDZjtBQUFBLEVBRUEsVUFBZ0I7QUFDZixVQUFNLEVBQUUsWUFBWSxJQUFJO0FBQ3hCLGdCQUFZLE1BQU07QUFDbEIsZ0JBQVksU0FBUyxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxVQUFNLFVBQ0w7QUFDRCxnQkFBWSxVQUFVLElBQUksQ0FBQyxPQUF1QjtBQUNqRCxTQUFHLFlBQVk7QUFBQSxJQUNoQixDQUFD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
