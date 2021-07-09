import {DialogPlugin} from "./dialog_plugin.js";

// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// GENERAL GAME SCENE

class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  // --------------------------------------------------------------------------------------------------
  // CREATE

  create(tilemapKey, tilesetKey, tilesetImageName) {
    // Map and tileset
    this.map = this.make.tilemap({key: tilemapKey});
    const tileset = this.map.addTilesetImage(tilesetImageName, tilesetKey);

    // Map layers (defined in Tiled)
    const ground1Layer = this.map.createLayer("Ground1", tileset, 0, 0);
    const ground2Layer = this.map.createLayer("Ground2", tileset, 0, 0);
    this.collision1Layer = this.map.createLayer("Collision1", tileset, 0, 0);
    this.collision2Layer = this.map.createLayer("Collision2", tileset, 0, 0);
    const aboveLayer = this.map.createLayer("Above", tileset, 0, 0);
    // To have "Above Player" layer to sit on top of the player, we give it a depth.
    aboveLayer.setDepth(10);

    // Object layer of the tilemap
    const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    this.player = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "misa-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Debug graphics
    this.input.keyboard.once("keydown-D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create world layers collision graphic above the player, but below the help text
      const graphics = this.add
          .graphics({lineStyle: {width: 4, color: 0xaa0000}})
          .setAlpha(0.75)
          .setDepth(20);

      this.collision1Layer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
      this.collision2Layer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });

      let rect = Phaser.Geom.Rectangle.Clone(this.physics.world.bounds);
      graphics.strokeRectShape(rect);
    });

    // Resize behavior
    this.scale.on('resize', this.resize, this);

    // INTERACTIVE OBJECTS

    // DOORS
    const doorObjects = this.map.createFromObjects("Objects", {
      key: "empty_tile",  // the image to show
      name: "door",
      classType: Phaser.GameObjects.Image
    });
    const doors = this.physics.add.staticGroup();
    doors.addMultiple(doorObjects, true);

    // Collision handling for doors, scene switch
    this.physics.add.collider(this.player, doors, (player, door) => {
      // if (player.body.touching.up && !player.body.wasTouching.up) {
      if (!player.body.touching.none && player.body.wasTouching.none) {
        // If the door has the link property it leads to a redirect
        if (door.data.list.hasOwnProperty('link')) {
          window.location.href = door.data.list.destination + ".html";
        }
        // Otherwise it leads to another scene
        else {
          this.scene.switch(door.data.list.destination);
        }
      }
    });

  }

  collide_with_world() {
    // Collision with the world layers
    // Has to come after the rest of the colliders in order for them to detect, call from the children creates
    this.collision1Layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.collision1Layer);
    this.collision2Layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.collision2Layer);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
  }

  // --------------------------------------------------------------------------------------------------
  // UPDATE

  update(time, delta) {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    let moveleft = false;
    let moveright = false;
    let moveup = false;
    let movedown = false;

    // MOUSE MOVEMENT
    let pointer = this.input.activePointer;
    if (pointer.primaryDown) {
      //let pointerPosition = pointer.position;
      // So that the x and y update if the camera moves and the mouse does not
      let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y)

      // Horizontal movement
      if (Math.abs(pointerPosition.x - this.player.x) > 15) {  // To avoid glitching when the player hits the cursor
        if (pointerPosition.x > this.player.x) {
          moveright = true;
        } else if (pointerPosition.x < this.player.x) {
          moveleft = true;
        }
      }

      // Vertical movement
      if (Math.abs(pointerPosition.y - this.player.y) > 15) {  // To avoid glitching when the player hits the cursor
        if (pointerPosition.y > this.player.y) {
          movedown = true;
        } else if (pointerPosition.y < this.player.y) {
          moveup = true;
        }
      }
    }

    // KEYBOARD MOVEMENT
    // Horizontal movement
    if (this.cursors.left.isDown) {
      moveleft = true;
    } else if (this.cursors.right.isDown) {
      moveright = true;
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      moveup = true;
    } else if (this.cursors.down.isDown) {
      movedown = true;
    }

    // Update the animation and give left/right animations precedence over up/down animations in diagonal movement
    if (moveleft) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("misa-left-walk", true);
    } else if (moveright) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("misa-right-walk", true);
    }
    if (moveup) {
      this.player.body.setVelocityY(-speed);
      if (!(moveleft || moveright)) {    // When moving diagonally display the left / right animation
        this.player.anims.play("misa-back-walk", true);
      }
    } else if (movedown) {
      this.player.body.setVelocityY(speed);
      if (!(moveleft || moveright)) {    // When moving diagonally display the left / right animation
        this.player.anims.play("misa-front-walk", true);
      }
    }

    // If not moving, pick and idle frame to use
    if (!(moveleft || moveright || moveup || movedown)) {
      this.player.anims.stop();
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);
  }

  resize (gameSize, baseSize, displaySize, resolution) {
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);
  }

}

// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// OVERWORLD SCENE

export class OverworldScene extends BaseScene {

  constructor() {
    super('OverworldScene');
    // So that the collision and overlap events fire only once
    this.resetSigns = true;
    this.resetWelcome = true;

    // The different sign text and rectangle objects will be created and destroyed with this single variable
    this.signText = undefined;
    this.signRect = undefined;
  }

  preload() {
    // The keys have to be unique! Otherwise they will not be preloaded again. Instead, the asset will be taken from the
    // other scene. Assets used in more than one scene can be preloaded only once (in the starting scene)

    this.load.image("OverworldTiles", "./assets/prod/tilesets_and_maps/poke_converted.png");
    this.load.image("empty_tile", "./assets/prod/tilesets_and_maps/empty_tile.png");
    this.load.tilemapTiledJSON("OverworldMap", "./assets/prod/tilesets_and_maps/overworld.json");
    this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");
	this.load.bitmapFont('pixelop', 'assets/prod/fonts/pixelop.png', 'assets/prod/fonts/pixelop.xml');
	this.load.bitmapFont('pixelopmono', 'assets/prod/fonts/pixelopmono.png', 'assets/prod/fonts/pixelopmono.xml');
  }

  create() {
    super.create("OverworldMap", "OverworldTiles", "poke");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 1920, 1088);
    this.cameras.main.setBounds(0, 0, 1920, 1088);

    // On scene switch (after entering a door) display the walking DOWN animation
    this.events.on('wake', () => {this.player.anims.play("misa-front-walk", true)}, this);

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
	
	// Scale acording to the user's screen size (mobile or desktop)!!!
	//let welcomeBitmapText = this.add.bitmapText(304, 700, 'pixelopmono', welcomeText, 16)
	this.welcomeText = this.add.bitmapText(304, 700, 'pixelop', welcomeText, 32)
	  .setOrigin(0.5, 0)
	  .setDepth(102);
	this.welcomeRect = this.add.rectangle(this.welcomeText.x, this.welcomeText.y, this.welcomeText.width+10, this.welcomeText.height, 0xffffff)
	  .setStrokeStyle(2, 0x000000)
	  .setOrigin(0.5, 0)
	  .setDepth(101);

	this.physics.add.overlap(this.player, welcomeTile,
        (player, door) => {
	      if (this.resetWelcome) {
	        this.welcomeText.visible = true;
	        this.welcomeRect.visible = true;
	        this.resetWelcome = false;
          }
        });

	// SIGNS
    const signObjects = this.map.createFromObjects("Objects", {
      key: "empty_tile",  // the image to show
      name: "sign",
      classType: Phaser.GameObjects.Image
    });
    const signs = this.physics.add.staticGroup();
    signs.addMultiple(signObjects, true);
    this.physics.add.collider(this.player, signs, (player, sign) => {
      if (this.resetSigns && player.body.touching.up && !player.body.wasTouching.up) {

        this.signText = this.add.bitmapText(Math.round(sign.x), Math.round(sign.y-45), 'pixelopmono', sign.data.list.text, 16, 1)
          .setOrigin(0.5)
		  //.setScale(0.75)
		  .setDepth(101);
		this.signRect = this.add.rectangle(this.signText.x, this.signText.y, this.signText.width+10, this.signText.height, 0xffffff)
		  .setStrokeStyle(1, 0x000000)
		  .setOrigin(0.5)
		  .setDepth(100);

		this.resetSigns = false;
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

    // Hide the sign text when the user moves anywhere but up
    if (!this.resetSigns && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y > 0)) {
      this.resetSigns = true;
      this.signText.destroy();
      this.signRect.destroy();
    }
  }

}


// ---------------------------------------------------------------------------------------------------
// RESEARCH SCENE

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
    this.load.image("InsideTiles", "./assets/prod/tilesets_and_maps/poke_inside_converted.png");
    this.load.tilemapTiledJSON("ResearchMap", "./assets/prod/tilesets_and_maps/research.json");
  }

  create() {
    super.create("ResearchMap", "InsideTiles", "poke_inside");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering a door) display the walking up animation
    this.events.on('create', () => {this.player.anims.play("misa-back-walk", true)}, this);
    this.events.on('wake', () => {this.player.anims.play("misa-back-walk", true)}, this);

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
