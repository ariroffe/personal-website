import {BaseScene} from "./base.js";

export class SoftwareScene extends BaseScene {

  constructor() {
    super('SoftwareScene');
  }

  preload() {
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
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

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

}
