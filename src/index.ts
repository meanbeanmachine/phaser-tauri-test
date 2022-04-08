import Phaser from "phaser";
import { resourceDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("dino");
  }

  create() {
    const center = {
      width: this.game.canvas.width / 2,
      height: this.game.canvas.height / 2,
    };
    this.add.text(20, 20, `Asset Path: ${this.load.baseURL}`, {
      fontSize: "24px",
    });
    this.add.image(center.width, center.height, "dino");
  }
}

window.addEventListener("load", async function () {
  // Default asset path (for running w/o Tauri)
  let assetUrl: string = "/";
  // Setup App Info if running w/ Tauri
  if ("__TAURI_IPC__" in window) {
    const appResourcePath = await resourceDir();
    const filePath = await join(appResourcePath, "_up_/static/assets/");
    assetUrl = convertFileSrc(filePath);
  }
  // Setup Game
  const game = new Phaser.Game({
    width: 1920,
    height: 1080,
    backgroundColor: "#2f2f2f",
    loader: { crossOrigin: "anonymous", baseURL: assetUrl },
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    scene: [Boot],
  });

  game.scene.start("Boot");
});
