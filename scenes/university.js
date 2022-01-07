import {BaseScene} from "./base.js";

export class UniversityScene extends BaseScene {

  constructor() {
    super('UniversityScene');
  }

  preload() {
    document.getElementById('loading').style.display = 'flex';
    this.load.spritesheet('fountain', 'assets/prod/anims/fountain.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON("UniversityMap", "./assets/prod/tilesets_and_maps/university-new.json");
  }

  create() {
    super.create("UniversityMap");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 1440, 768);
    this.cameras.main.setBounds(0, 0, 1440, 768);

    // On scene switch (after entering through the door) display the walking UP texture
    this.events.on('create', () => {this.player.setTexture("atlas", "ariel-back")}, this);
    this.events.on('wake', () => {this.player.setTexture("atlas", "ariel-back")}, this);

    // Fountain animation
    this.anims.create({
      key: "fountain-anim",
      frameRate: 5,
      frames: this.anims.generateFrameNumbers("fountain", { start: 1, end: 3 }),
      yoyo: false,
      repeat: -1
    });
    const fountain = this.add.sprite(928, 608, "fountain");
    fountain.playReverse("fountain-anim");
    // It is sitting exactly on top of the Tiled (fixed) fountain, so no need for a collider

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    document.getElementById('loading').style.display = 'none';
  }

}
