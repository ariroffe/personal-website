import {BaseScene} from "./base.js";

export class ResearchScene extends BaseScene {

  constructor() {
    super('ResearchScene');
  }

  preload() {
    document.getElementById('loading').style.display = 'flex';
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
    this.load.tilemapTiledJSON("ResearchMap", "./assets/prod/tilesets_and_maps/research.json");
  }

  create() {
    super.create("ResearchMap", "InsideTiles", "poke_inside");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering through the door) display the walking UP animation
    this.events.on('create', () => {this.player.anims.play("ariel-back-walk", true)}, this);
    this.events.on('wake', () => {this.player.anims.play("ariel-back-walk", true)}, this);

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    document.getElementById('loading').style.display = 'none';
  }

}
