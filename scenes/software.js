import {BaseScene} from "./base.js";

export class SoftwareScene extends BaseScene {

  constructor() {
    super('SoftwareScene');
  }

  preload() {
    document.getElementById('loading').style.display = 'flex';
    this.load.tilemapTiledJSON("SoftwareMap", "./assets/prod/tilesets_and_maps/software-new.json");
  }

  create() {
    super.create("SoftwareMap");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering through the door) display the walking UP texture
    this.events.on('create', () => {this.player.setTexture("atlas", "ariel-back")}, this);
    this.events.on('wake', () => {this.player.setTexture("atlas", "ariel-back")}, this);

    // Small computer animation
    this.anims.create({
      key: "smallcomputer-anim",
      frames: this.anims.generateFrameNames("anims_ui", {
        prefix: "comput2.",
        start: 0,
        end: 1,
        zeroPad: 3
      }),
      frameRate: 2,
      repeat: -1
    });
    const computer = this.add.sprite(880, 80, "anims_ui", "comput2.000");
    computer.play("smallcomputer-anim");

    // Big computer animation
    this.anims.create({
      key: "bigcomputer-anim",
      frames: this.anims.generateFrameNames("anims_ui", {
        prefix: "comput.",
        start: 0,
        end: 1,
        zeroPad: 3
      }),
      frameRate: 2,
      repeat: -1
    });
    const bigcomputer = this.add.sprite(528, 80, "anims_ui", "comput.000");
    bigcomputer.play("bigcomputer-anim");

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    document.getElementById('loading').style.display = 'none';
  }

}
