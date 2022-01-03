import {BaseScene} from "./base.js";

export class UniversityScene extends BaseScene {

  constructor() {
    super('UniversityScene');
  }

  preload() {
    document.getElementById('loading').style.display = 'flex';
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
    this.load.spritesheet('fountain', 'assets/prod/anims/fountain.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON("UniversityMap", "./assets/prod/tilesets_and_maps/university.json");
  }

  create() {
    super.create("UniversityMap", "InsideTiles", "poke_inside");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 1440, 768);
    this.cameras.main.setBounds(0, 0, 1440, 768);

    // On scene switch (after entering a door) display the walking up animation
    this.events.on('create', () => {this.player.anims.play("ariel-back-walk", true)}, this);
    this.events.on('wake', () => {this.player.anims.play("ariel-back-walk", true)}, this);

    // Fountain animation
    this.anims.create({
      key: "fountain-anim",
      frameRate: 5,
      frames: this.anims.generateFrameNumbers("fountain", { start: 1, end: 3 }),
      yoyo: false,
      repeat: -1
    });
    let fountain = this.add.sprite(928, 608, "fountain");
    fountain.playReverse("fountain-anim");
    // It is sitting exactly on top of the Tiled (fixed) fountain, so no need for a collider

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    document.getElementById('loading').style.display = 'none';
  }

}
