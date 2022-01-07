export class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
  }

  // --------------------------------------------------------------------------------------------------
  // CREATE

  create(tilemapKey) {
    // ----------------
    // MAP AND TILESET
    this.map = this.make.tilemap({key: tilemapKey});
    // const tileset = this.map.addTilesetImage("tileset", "TilesetImage");
    const tileset = this.map.addTilesetImage("tileset", "TilesetImage", 32, 32, 1, 2);  // Add margin and spacing for the extruded image:

    // Map layers (defined in Tiled)
    const ground1Layer = this.map.createLayer("Ground1", tileset, 0, 0);
    const ground2Layer = this.map.createLayer("Ground2", tileset, 0, 0);
    const collision1Layer = this.map.createLayer("Collision1", tileset, 0, 0);
    const collision2Layer = this.map.createLayer("Collision2", tileset, 0, 0);
    const aboveLayer = this.map.createLayer("Above", tileset, 0, 0);
    aboveLayer.setDepth(10);  // To have the "Above" layer sit on top of the player, we give it a depth.
    // The layer with wich the player will collide
    this.LayerToCollide = this.map.createLayer("CollisionLayer", tileset, 0, 0);
    this.LayerToCollide.setVisible(false);  // Comment out this line if you wish to see which objects the player will collide with

    // ----------------
    // CREATE THE PLAYER AND THE ANIMATIONS
    // Get the spawn point
    const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");
    // Create a sprite with physics for the player

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas", "ariel-front");
	this.player.setDepth(5);
    this.player.body.setSize(26, 41);

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
	anims.create({
      key: "ariel-wave",
      frames: anims.generateFrameNames("atlas", {
        prefix: "ariel-wave.",
        start: 0,
        end: 4,
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
    this.signs = [];
    this.bigSigns = [];
    this.map.filterObjects("Objects", obj => {

      // DOORS
      if (obj.name === 'door') {
        this.add.door(Math.round(obj.x), Math.round(obj.y), obj.height, obj.width, obj.properties[0].value, obj.properties[1].value);
        // last 2: destination (str) and link (bool, if true leads to a redirect)
      }

      // BIGSIGNS (text that shows on the purple squares)
      else if (obj.name === 'bigSign') {
        this.bigSigns.push(
          this.add.bigSign(Math.round(obj.x), Math.round(obj.y), obj.height, obj.width, obj.properties[0].value,
						   obj.properties[1].value, obj.properties[2].value, obj.properties[3].value,
                           obj.properties[4].value)
          // last parameters are signX, signY, sm_signX, sm_signY, text
        )
      }

      // SIGNS
      else if (obj.name === 'sign') {
        this.signs.push(this.add.sign(obj.x, obj.y, obj.properties[1].value, obj.properties[0].value))
        // Last parameters are the text to show and the direction of the text in relation to the object
      }
    });

	// ----------------
    // TOP BUTTONS (PLAY MUSIC AND FULLSCREEN)
    // MUSIC
    const self = this;
    const playmusic = this.add.image(240, 45, 'play').setScrollFactor(0).setDepth(105);
    const stopmusic = this.add.image(240, 45, 'mute').setScrollFactor(0).setDepth(105).setVisible(false);

    // If the music already exists and is playing (e.g. after a scene switch), display the pause animation
    function checkDisplayPause(self) {
      const prevMusic = self.sound.get('music')
      if (prevMusic !== null && prevMusic.isPlaying) {
        stopmusic.setVisible(true);
        playmusic.setVisible(false);
      } else {
        stopmusic.setVisible(false);
        playmusic.setVisible(true);
      }
    }
    checkDisplayPause(self);  // Run it once in the create method
    this.events.on('wake', () => checkDisplayPause(self))  // And again after each wake event

    // Music will load asyncronously, once the player hits the play button, bc it is a large file
    // If we put the loading in preload it will take longer to init the game
    playmusic.setInteractive({useHandCursor: true}).on('pointerdown', function () {
      if (!self.load.isLoading()) {  // Music will load on click, check that it not loading from prev click
        const music = self.sound.get('music');  // null if the key does not exist yet (i.e. audio not loaded)
        if (music !== null) {  // The key exists (was loaded from prev file)
          music.resume();
          stopmusic.setVisible(true);
          playmusic.setVisible(false);
        } else {  // The audio is not loaded, load it now
          self.load.audio('music', '/assets/prod/audio/music.mp3');
          self.load.once('complete', function() {
            self.sound.play('music');
            stopmusic.setVisible(true);
            playmusic.setVisible(false);
          });
          self.load.start();
        }
      }
    });
    stopmusic.setInteractive({useHandCursor: true}).on('pointerdown', function () {
      stopmusic.setVisible(false);
      playmusic.setVisible(true);
      const music = self.sound.get('music');
      if (music !== null) music.pause();  // The conditional should always be true here but I leave it just in case
    });

    // FULLSCREEN
	const enterfullscreen = this.add.image(140, 45, 'fullscreen').setScrollFactor(0).setDepth(105);
	const leavefullscreen = this.add.image(50, 45, 'fullscreen2').setScrollFactor(0).setDepth(105).setVisible(false);

    // If we are already in fullscreen, show the exit button
    function checkDisplayFullscreen(self) {
      if (self.scale.isFullscreen) {
        enterfullscreen.setVisible(false);
        leavefullscreen.setVisible(true);
      } else {
        enterfullscreen.setVisible(true);
        leavefullscreen.setVisible(false);
      }
    }
    checkDisplayFullscreen(self);  // Run it once in the create method
    this.events.on('wake', () => checkDisplayFullscreen(self))  // And again after each wake event

    enterfullscreen.setInteractive({useHandCursor: true}).on('pointerdown', function () {
      if (!window.mouseOverMenu) {
        enterfullscreen.setVisible(false);
        leavefullscreen.setVisible(true);
        this.scene.scale.toggleFullscreen();
      }
    });
	enterfullscreen.on('pointerover', () => enterfullscreen.setTint(0x6699ff));
	enterfullscreen.on('pointerout', () => enterfullscreen.clearTint());

    leavefullscreen.setInteractive({useHandCursor: true}).on('pointerdown', function () {
      enterfullscreen.setVisible(true);
      leavefullscreen.setVisible(false);
      this.scene.scale.toggleFullscreen();
    });
	leavefullscreen.on('pointerover', () => leavefullscreen.setTint(0x6699ff));
	leavefullscreen.on('pointerout', () => leavefullscreen.clearTint());
  }

  // -----------------

  resize (gameSize, baseSize, displaySize, resolution) {
     this.cameras.resize(gameSize.width, gameSize.height);
  }

  collide_with_world() {
    // Collision with the world layers. Has to come after the rest of the colliders in order for them to detect.
    // We need to call this at the end of the children's create
    this.physics.add.collider(this.player, this.LayerToCollide);
    this.LayerToCollide.setCollisionBetween(40, 41);

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
    if (pointer.primaryDown && !window.mouseOverMenu) {
      // If you press the pointer outside the menu, hide it... Done here bc otherwise takes till after movement
      // to execute this command
      document.getElementById("game-menu").style.display = 'none';
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

    // If not moving (and not waving or at the start of the game), stop animations and pick and idle frame
    if (!(moveleft || moveright || moveup || movedown) &&
		// This next part is so that it doesn't stop the waving animation in the overworld
		// Second disjunct is if it was already playing it (from prev iteration of Overworld's update)
		// First disjunct is bc at the start of the game currentAnim is null, comparing with .key gives an error
	    !(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key === 'ariel-wave')) 
	{
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
    // Hide the bigSigns and signs
    this.bigSigns.forEach((bigSign) => bigSign.hideSignText(bigSign, this.player));
    if (moveleft || moveright || moveup || movedown) {
      this.signs.forEach((sign) => sign.playerMovement(moveleft, moveright, moveup, movedown));
    }
  }

}
