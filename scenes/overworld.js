import {BaseScene} from "./base.js";
import './interactive/factory.js';

export class OverworldScene extends BaseScene {

  constructor() {
    super('OverworldScene');
    // So that the collision and overlap events fire only once
    this.resetWelcome = true;

    // The different sign text and rectangle objects will be created and destroyed with this single variable
    this.signRect = undefined;
  }

  preload() {
    // The keys have to be unique! Otherwise they will not be preloaded again.
    // this.load.image("OverworldTiles", "./assets/prod/tilesets_and_maps/poke_converted.png");
    this.load.image("OverworldTiles", "./assets/prod/tilesets_and_maps/poke_converted_extruded.png");
    this.load.image("empty_tile", "./assets/prod/tilesets_and_maps/empty_tile.png");
    this.load.tilemapTiledJSON("OverworldMap", "./assets/prod/tilesets_and_maps/overworld.json");
    this.load.atlas("atlas", "./assets/prod/atlas/atlas.png", "./assets/prod/atlas/atlas.json");
	this.load.bitmapFont('pixelop', 'assets/prod/fonts/pixelop.png', 'assets/prod/fonts/pixelop.xml');
	this.load.bitmapFont('pixelopmono', 'assets/prod/fonts/pixelopmono.png', 'assets/prod/fonts/pixelopmono.xml');
  }

  create() {
    super.create("OverworldMap", "OverworldTiles", "poke");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 1920, 1088);
    this.cameras.main.setBounds(0, 0, 1920, 1088);

    // On scene switch (after entering a door) display the walking DOWN animation
    this.events.on('wake', () => {this.player.anims.play("ariel-front-walk", true)}, this);

    // WELCOME TEXT
    let welcomeTileObj = this.map.createFromObjects("Objects", {
      key: "empty_tile",  // the image to show
      name: "welcome",
      classType: Phaser.GameObjects.Image
    });
    const welcomeTile = this.physics.add.staticGroup(welcomeTileObj);

	const welcomeText = [
	  "Hi! Welcome to my site!",
	  "I'm Ariel Roffe. I'm a",
	  "philosophy researcher from",
	  "Argentina. Feel free to",
	  "explore the map to know more",
	  "about me. Or use the menu in",
	  "the top left to leave the game.",
	]

	// todo Scale acording to the user's screen size (mobile or desktop)!
	//let welcomeBitmapText = this.add.bitmapText(304, 700, 'pixelopmono', welcomeText, 16)
	this.welcomeText = this.add.bitmapText(304, 700, 'pixelop', welcomeText, 32)
	  .setOrigin(0.5, 0)
	  .setDepth(102);
	this.welcomeRect = this.add.rectangle(this.welcomeText.x, this.welcomeText.y, this.welcomeText.width+10, this.welcomeText.height, 0xffffff)
	  .setStrokeStyle(2, 0x000000)
	  .setOrigin(0.5, 0)
	  .setDepth(101);

	this.physics.add.overlap(this.player, welcomeTile,
        (player, tile) => {
	      if (this.resetWelcome) {
	        this.welcomeText.visible = true;
	        this.welcomeRect.visible = true;
	        this.resetWelcome = false;
          }
        });

	// SIGNS
    this.signs = [];
    this.map.filterObjects("Objects", obj => {
      if (obj.name === 'sign') {
        this.signs.push(
          this.add.sign(obj.x, obj.y, obj.properties[0].value)  // last parameter is the text to show
        )
      }
    });

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

  update(time, delta) {
    super.update(time, delta);

    // Hide the welcome text when the player moves
    if (!this.resetWelcome && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
      this.welcomeText.visible = false;
      this.welcomeRect.visible = false;
      this.resetWelcome = true;
    }

    // Hide the sign text when the player moves (anywhere but up)
    if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y > 0) {
      this.signs.forEach((sign) => sign.hideSignText());
    }
  }

}
