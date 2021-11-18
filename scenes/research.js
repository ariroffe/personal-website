import {BaseScene} from "./base.js";

export class ResearchScene extends BaseScene {

  constructor() {
    super('ResearchScene');
    // So that the collision events fire only once
    this.resetBook = true;

    // The different sign text and rectangle objects will be created and destroyed with this single variable
    this.bookText = undefined;
    this.bookRect = undefined;
  }

  preload() {
    // this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted_extruded.png");
    this.load.tilemapTiledJSON("ResearchMap", "./assets/prod/tilesets_and_maps/research.json");
  }

  create() {
    super.create("ResearchMap", "InsideTiles", "poke_inside");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering a door) display the walking up animation
    this.events.on('create', () => {this.player.anims.play("ariel-back-walk", true)}, this);
    this.events.on('wake', () => {this.player.anims.play("ariel-back-walk", true)}, this);

    // BOOK TEXT
    let bookObj = this.map.createFromObjects("Objects", {
      key: "empty_tile",  // the image to show
      name: "book",
      classType: Phaser.GameObjects.Image
    });
    const book = this.physics.add.staticGroup(bookObj);

	const bookText = [
	  "This is a multiline text",
	  "About my research..."
	]

	// Scale acording to the user's screen size (mobile or desktop)!!!
	this.bookText = this.add.bitmapText(500, 300, 'pixelop', bookText, 32)
	  .setOrigin(0.5, 0)
	  .setDepth(102);
	this.bookRect = this.add.rectangle(this.bookText.x, this.bookText.y, this.bookText.width+10, this.bookText.height, 0xffffff)
	  .setStrokeStyle(2, 0x000000)
	  .setOrigin(0.5, 0)
	  .setDepth(101);
	this.bookText.visible = false;
	this.bookRect.visible = false;

	// Collider
	this.physics.add.collider(this.player, book, (player, book) => {
      if (this.resetBook && player.body.touching.right && !player.body.wasTouching.right) {
        this.bookText.visible = true;
        this.bookRect.visible = true;
        this.resetBook = false;
      }
	});

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

  update(time, delta) {
    super.update(time, delta);

    // Hide the book text when the player moves everywhere but right
    if (!this.resetBook && (this.player.body.velocity.x < 0 || this.player.body.velocity.y !== 0)) {
      this.bookText.visible = false;
      this.bookRect.visible = false;
      this.resetBook = true;
    }

  }

}
