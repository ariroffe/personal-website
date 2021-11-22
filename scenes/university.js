import {BaseScene} from "./base.js";

export class UniversityScene extends BaseScene {

  constructor() {
    super('UniversityScene');
  }

  preload() {
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
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

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

}
