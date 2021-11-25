export class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  // --------------------------------------------------------------------------------------------------
  // CREATE

  create(tilemapKey, tilesetKey, tilesetImageName) {
    // ----------------
    // MAP AND TILESET
    this.map = this.make.tilemap({key: tilemapKey});
    // const tileset = this.map.addTilesetImage(tilesetImageName, tilesetKey);
    const tileset = this.map.addTilesetImage(tilesetImageName, tilesetKey, 32, 32, 1, 2);  // Add margin and spacing for the extruded image:

    // Map layers (defined in Tiled)
    const ground1Layer = this.map.createLayer("Ground1", tileset, 0, 0);
    const ground2Layer = this.map.createLayer("Ground2", tileset, 0, 0);
    this.collision1Layer = this.map.createLayer("Collision1", tileset, 0, 0);
    this.collision2Layer = this.map.createLayer("Collision2", tileset, 0, 0);
    const aboveLayer = this.map.createLayer("Above", tileset, 0, 0);
    // To have the "Above" layer sit on top of the player, we give it a depth.
    aboveLayer.setDepth(10);

    // ----------------
    // PLAYER
    // Get the spawn point
    const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");
    // Create a sprite with physics for the player

    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "ariel-front");

    // Create the player's walking animations from the texture atlas
    const anims = this.anims;
    anims.create({
      key: "ariel-left-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "ariel-left-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "ariel-right-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "ariel-right-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "ariel-front-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "ariel-front-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "ariel-back-walk",
      frames: anims.generateFrameNames("atlas", {
        prefix: "ariel-back-walk.",
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    // ----------------
    // CAMERA
    const camera = this.cameras.main;
	camera.startFollow(this.player);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
    // Camera resize behavior
    this.scale.on('resize', this.resize, this);

    // ----------------
    // INTERACTIVE OBJECTS
    // DOORS
    this.map.filterObjects("Objects", obj => {
      if (obj.name === 'door') {
        this.add.door(Math.round(obj.x), Math.round(obj.y), obj.height, obj.width, obj.properties[0].value, obj.properties[1].value);
        // last 2: destination (str) and link (bool, if true leads to a redirect)
      }
    });

    // BIGSIGNS (text that shows on the purple squares)
    this.bigSigns = [];
    this.map.filterObjects("Objects", obj => {
      if (obj.name === 'bigSign') {
        this.bigSigns.push(
          this.add.bigSign(Math.round(obj.x), Math.round(obj.y), obj.height, obj.width, obj.properties[0].value, 
						   obj.properties[1].value, obj.properties[2].value, obj.properties[3].value,
                           obj.properties[4].value)
          // last parameters are signX, signY, sm_signX, sm_signY, text
        )
      }
    });

    // SIGNS
    this.signs = [];
    this.map.filterObjects("Objects", obj => {
      if (obj.name === 'sign') {
        this.signs.push(
          this.add.sign(obj.x, obj.y, obj.properties[1].value, obj.properties[0].value)
          // Last parameters are the text to show and the direction of the text in relation to the object
        )
      }
    });
	
	// Fullscreen button
	let fullscreen = this.add.image(160, 32, 'fullscreen').setScrollFactor(0).setDepth(105);
	fullscreen.setInteractive({useHandCursor: true}).on('pointerdown', () => this.scale.toggleFullscreen());
	fullscreen.on('pointerover', () => fullscreen.setTint(0x6699ff));
	fullscreen.on('pointerout', () => fullscreen.clearTint());
  }
  
  resize (gameSize, baseSize, displaySize, resolution) {
     this.cameras.resize(gameSize.width, gameSize.height);
  }

  collide_with_world() {
    // Collision with the world layers. Has to come after the rest of the colliders in order for them to detect.
    // We need to call this at the end of the children's create
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

    // ----------------
    // MOUSE MOVEMENT
    let pointer = this.input.activePointer;
    if (pointer.primaryDown) {
      // let pointerPosition = pointer.position;
      // So that the x and y update if the camera moves and the mouse does not
	  let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
	  
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

    // ----------------
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

    // ----------------
    // MOVEMENT ANIMATIONS
    // Update the animation and give left/right animations precedence over up/down animations in diagonal movement
    if (moveleft) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("ariel-left-walk", true);
    } else if (moveright) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("ariel-right-walk", true);
    }
    if (moveup) {
      this.player.body.setVelocityY(-speed);
      if (!(moveleft || moveright)) {    // When moving diagonally display the left / right animation
        this.player.anims.play("ariel-back-walk", true);
      }
    } else if (movedown) {
      this.player.body.setVelocityY(speed);
      if (!(moveleft || moveright)) {    // When moving diagonally display the left / right animation
        this.player.anims.play("ariel-front-walk", true);
      }
    }

    // If not moving, pick and idle frame to use
    if (!(moveleft || moveright || moveup || movedown)) {
      this.player.anims.stop();
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "ariel-left");
      else if (prevVelocity.x > 0) this.player.setTexture("atlas", "ariel-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "ariel-back");
      else if (prevVelocity.y > 0) this.player.setTexture("atlas", "ariel-front");
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    // ---------------------
    // INTERACTIVE OBJECTS
    // Hide the bigSigns when the player moves
    if (moveleft || moveright || moveup || movedown) {
      // Hide the bigSign text when the player moves
      this.bigSigns.forEach((bigSign) => bigSign.hideSignText());
    }

    // Hide the normal signs when the player moves (anywhere but up)
    // todo Si agregamos signs en otras direcciones, ver de pasarle la direcc del movimiento como param
    if (moveleft || moveright || moveup || movedown) {
      this.signs.forEach((sign) => sign.hideSignText(moveleft, moveright, moveup, movedown));
    }

  }

}
