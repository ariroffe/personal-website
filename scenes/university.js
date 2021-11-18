import {BaseScene} from "./base.js";

export class UniversityScene extends BaseScene {

  constructor() {
    super('UniversityScene');
    // So that the collision events fire only once
    this.resetBlackboard = true;

    // The different sign text and rectangle objects will be created and destroyed with this single variable
    this.blackboardText = undefined;
    this.blackboardRect = undefined;
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

    // Blackboard text
    let blackboardObj = this.map.createFromObjects("Objects", {
      key: "empty_tile",  // the image to show
      name: "blackboard",
      classType: Phaser.GameObjects.Image
    });
    const blackboard = this.physics.add.staticGroup(blackboardObj);

	const blackboardText = [
	  "This is a multiline text",
	  "About my teaching..."
	]

	// Scale acording to the user's screen size (mobile or desktop)!!!
	this.blackboardText = this.add.bitmapText(500, 300, 'pixelop', blackboardText, 32)
	  .setOrigin(0.5, 0)
	  .setDepth(102);
	this.blackboardRect = this.add.rectangle(this.blackboardText.x, this.blackboardText.y, this.blackboardText.width+10, this.blackboardText.height, 0xffffff)
	  .setStrokeStyle(2, 0x000000)
	  .setOrigin(0.5, 0)
	  .setDepth(101);
	this.blackboardText.visible = false;
	this.blackboardRect.visible = false;

	this.physics.add.overlap(this.player, blackboard,
        (player, tile) => {
	      if (this.resetBlackboard) {
	        this.blackboardText.visible = true;
	        this.blackboardRect.visible = true;
	        this.resetBlackboard = false;
          }
        });

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

  update(time, delta) {
    super.update(time, delta);

    // Hide the blackboard text when the player moves
    if (!this.resetBlackboard && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
      this.blackboardText.visible = false;
      this.blackboardRect.visible = false;
      this.resetBlackboard = true;
    }

  }

}
