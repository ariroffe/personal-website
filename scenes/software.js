import {BaseScene} from "./base.js";

export class SoftwareScene extends BaseScene {

  constructor() {
    super('SoftwareScene');
  }

  preload() {
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
	this.load.spritesheet('computer', 'assets/prod/anims/computer.png', { frameWidth: 32, frameHeight: 64 });
	this.load.spritesheet('bigcomputer', 'assets/prod/anims/bigcomputer.png', { frameWidth: 128, frameHeight: 96 });
    this.load.tilemapTiledJSON("SoftwareMap", "./assets/prod/tilesets_and_maps/software.json");
  }

  create() {
    super.create("SoftwareMap", "InsideTiles", "poke_inside");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering through the door) display the walking UP animation
    this.events.on('create', () => {this.player.anims.play("ariel-back-walk", true)}, this);
    this.events.on('wake', () => {this.player.anims.play("ariel-back-walk", true)}, this);
	
	// Small computer animation
    this.anims.create({
      key: "computer-anim",
      frameRate: 2,
      frames: this.anims.generateFrameNumbers("computer", { start: 0, end: 1 }),
      yoyo: false,
      repeat: -1
    });
    let computer = this.add.sprite(880, 64, "computer");
    computer.play("computer-anim");
	
	// Big computer animation
    this.anims.create({
      key: "bigcomputer-anim",
      frameRate: 2,
      frames: this.anims.generateFrameNumbers("bigcomputer", { start: 0, end: 1 }),
      yoyo: false,
      repeat: -1
    });
    let bigcomputer = this.add.sprite(480, 48, "bigcomputer");
    bigcomputer.play("bigcomputer-anim");

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

}
