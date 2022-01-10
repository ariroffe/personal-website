import {BaseScene} from "./base.js";
import './interactive/factory.js';  // This has to run before the first scene in order to add the commands


export class OverworldScene extends BaseScene {

  constructor() {
    super('OverworldScene');
  }

  preload() {
    // The keys have to be unique! Otherwise they will not be preloaded again.
    // this.load.image("OverworldTiles", "./assets/prod/tilesets_and_maps/tileset.png");
    this.load.image("TilesetImage", "./assets/prod/tilesets_and_maps/tileset_extruded.png");
    this.load.tilemapTiledJSON("OverworldMap", "./assets/prod/tilesets_and_maps/overworld-new.json");
    this.load.atlas("atlas", "./assets/prod/atlas/atlas.png", "./assets/prod/atlas/atlas.json");
	  this.load.bitmapFont('pixelop', 'assets/prod/fonts/pixelop.png', 'assets/prod/fonts/pixelop.xml');
	  this.load.bitmapFont('pixelopmono', 'assets/prod/fonts/pixelopmono.png', 'assets/prod/fonts/pixelopmono.xml');
	  this.load.image("enterfullscreen", "./assets/prod/other/fullscreen.png");
    this.load.image("exitfullscreen", "./assets/prod/other/fullscreen2.png");
	  this.load.image("mute", "./assets/prod/other/sound.png");
    this.load.image("play", "./assets/prod/other/nosound.png");
	  this.load.spritesheet('purple_tile', 'assets/prod/anims/purple_tile.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // super.create("OverworldMap", "OverworldTiles", "poke");
    super.create("OverworldMap");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 1920, 1088);
    this.cameras.main.setBounds(0, 0, 1920, 1088);

    // On scene switch (after entering a door) display the walking DOWN animation
    this.events.on('wake', () => {this.player.setTexture("atlas", "ariel-front")}, this);

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined

    document.getElementById('loading').style.display = 'none';
  }

}
