import {BaseScene} from "./base.js";

export class ResearchScene extends BaseScene {

  constructor() {
    super('ResearchScene');
  }

  preload() {
    document.getElementById('loading').style.display = 'flex';
    this.load.tilemapTiledJSON("ResearchMap", "./assets/prod/tilesets_and_maps/research-new.json");
  }

  create() {
    super.create("ResearchMap");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering through the door) display the walking UP texture
    this.events.on('create', () => {this.player.setTexture("atlas", "ariel-back")}, this);
    this.events.on('wake', () => {this.player.setTexture("atlas", "ariel-back")}, this);

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    document.getElementById('loading').style.display = 'none';
  }

}
