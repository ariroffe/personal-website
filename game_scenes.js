import {DialogPlugin} from "./dialog_plugin.js";

// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// GENERAL GAME SCENE

class BaseScene extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.zones = [];
    this.resetSigns = true;
  }

  // --------------------------------------------------------------------------------------------------
  // CREATE

  create(tilemapKey, tilesetKey, tilesetImageName) {
    // Map and tileset
    const map = this.make.tilemap({ key: tilemapKey });
    const tileset = map.addTilesetImage(tilesetImageName, tilesetKey);

    // Map layers (defined in Tiled)
    const ground1Layer = map.createLayer("Ground1", tileset, 0, 0);
    const ground2Layer = map.createLayer("Ground2", tileset, 0, 0);
    const collision1Layer = map.createLayer("Collision1", tileset, 0, 0);
    const collision2Layer = map.createLayer("Collision2", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above", tileset, 0, 0);
    // To have "Above Player" layer to sit on top of the player, we give it a depth.
    aboveLayer.setDepth(10);

    // Object layer of the tilemap
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

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
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Movete, gato', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0)
      .setDepth(30);

    // Debug graphics
    this.input.keyboard.once("keydown-D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create world layers collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics({lineStyle: {width: 4, color: 0xaa0000}})
        .setAlpha(0.75)
        .setDepth(20);

      // collision1Layer.renderDebug(graphics, {
      //   tileColor: null, // Color of non-colliding tiles
      //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      // });
      // collision2Layer.renderDebug(graphics, {
      //   tileColor: null, // Color of non-colliding tiles
      //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      // });

      let rect = Phaser.Geom.Rectangle.Clone(this.physics.world.bounds);
      graphics.strokeRectShape(rect);
    });

    // Resize behavior
    this.scale.on('resize', this.resize, this);

    // INTERACTIVE OBJECTS
    // SIGNS
    const signObjects = map.createFromObjects("Objects", {
      key: "sign",  // the image to show
      name: "sign",
      classType: Phaser.GameObjects.Image
    });
    const signs = this.physics.add.staticGroup();
    signs.addMultiple(signObjects, true);
    this.physics.add.collider(this.player, signs,
        (player, sign) => {
          if (this.resetSigns && player.body.touching.up && !player.body.wasTouching.up) {
            console.log('Choque con', sign.data.list.text);
            this.resetSigns = false;
          }
        }
    );

    // DOORS
    const doorObjects = map.createFromObjects("Objects", {
      key: "door",  // the image to show
      name: "door",
      classType: Phaser.GameObjects.Image
    });
    const doors = this.physics.add.staticGroup();
    doors.addMultiple(doorObjects, true);
    // Make the hitbox smaller so that collisions with the door are not detected
    // too far away from it:
    doors.children.entries.forEach((door) => {
      door.body.setSize(door.body.width - 24, door.body.height);
    });
    // Collision handling for doors, scene switch
    this.physics.add.collider(this.player, doors,
        (player, door) => {
          if (player.body.touching.up && !player.body.wasTouching.up) {
            console.log('collision with', door.data.list.destination);
            // this.scene.switch(door.data.list.destination);
          }
        }
    );

    // ZONES
    // Dialog plugin - SACAR ESTO?
    // let dialogPlugin = this.plugins.install('dialogPlugin', DialogPlugin, true);
    // Call registerZones after this coded executes once you've added them in your inherited class

    // Collision with the world layers
    // Has to come after the rest of the colliders in order for them to detect
    collision1Layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, collision1Layer);
    collision2Layer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, collision2Layer);

    //this.player.setCollideWorldBounds(true);
    //this.player.onWorldBounds = true;
  }

  registerZones() {
    let scene = this;
    // let dialogPlugin = this.plugins.get("dialogPlugin");
    this.zones.forEach(function (zone, index) {
      scene.add.existing(zone);
      scene.physics.world.enable(zone, 0);  // (0) DYNAMIC (1) STATIC
      // zone.on('enterzone', () => dialogPlugin.showDialog(zone.displayText, scene));
      // zone.on('leavezone', () => dialogPlugin.hideDialog(scene));
      zone.on('enterzone', () => console.log('Enter zone ', zone));
      zone.on('leavezone', () => console.log('Leave zone ', zone));
      zone.wasEmbedded = false;
    });
    scene.physics.add.overlap(scene.player, scene.zones);
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

    // Mouse movement
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

    // Keyboard movement
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

    // Update the animation and give left/right animations precedence over up/down animations
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

    let isMoving = moveleft || moveright || moveup || movedown;
    if (!isMoving) {
      this.player.anims.stop();
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    if (!this.resetSigns && (moveleft || moveright || movedown)) {
      this.resetSigns = true;
    }

    // Zone interaction
    // (for some reason, .embedded alone does not detect diagonal movement, so check touching as well
    this.zones.forEach(function (item, index) {
      let touching = !item.body.touching.none;
      let isEmbedded = item.body.embedded;

      if (!item.wasEmbedded) {
        // If the player was not in the zone and is now embedded and not moving
        if (isEmbedded && !isMoving) {
          item.emit('enterzone');
          item.wasEmbedded = true;
        }
      }
      else {
        // Leavezone is only called when the player exits the square, movement within does not count
        if (!isEmbedded && !touching) {
          item.emit('leavezone');
          item.wasEmbedded = false;
        }
      }
      item.body.debugBodyColor = item.body.embedded ? 0x00ffff : 0xffff00;
    });

  }

  resize (gameSize, baseSize, displaySize, resolution) {
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);
    // this.physics.world.setBounds(0, 0, width, height);
  }

}

// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// OVERWORLD SCENE

export class OverworldScene extends BaseScene {

  constructor() {
    super('OverworldScene');
  }

  preload() {
    // The keys have to be unique! Otherwise they will not be preloaded again
    // Instead, the asset will be taken from the other scene
    // Assets used in more than one scene can be preloaded only once (in the starting scene)

    this.load.image("OverworldTiles", "./assets/prod/poke_converted.png");
    this.load.tilemapTiledJSON("OverworldMap", "./assets/prod/overworld.json");
    this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");

    // Already loaded before...
    // this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");
    // this.load.image("sign", "./assets/test/sign.png");
    // this.load.image("door", "./assets/test/door.png");
  }

  create() {
    super.create("OverworldMap", "OverworldTiles", "poke");

    // ZONE DEFINITIONS
    // CUANDO LO ARMEMOS BIEN, LA ZONA TIENE QUE CUBRIR LA MITAD SUPERIOR DEL CUADRADO DE COLOR
    // ASI DETECTA EL OVERLAP SOLO CUANDO LOS PIES (NO LA CABEZA) ENTRAN
    let zone1 = new Phaser.GameObjects.Zone(this, 200, 1000, 64, 64)
    zone1.displayText = "Zone 1"
    this.zones.push(zone1);

    this.registerZones();
  }

}

// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// TEST SCENES

export class TestOverworldScene extends BaseScene {

  constructor() {
    super('OverworldScene');
  }

  preload() {
    // The keys have to be unique! Otherwise they will not be preloaded again
    // Instead, the asset will be taken from the other scene
    // Assets used in more than one scene can be preloaded only once (in the starting scene)

    this.load.image("OverworldTiles", "./assets/test/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("OverworldMap", "./assets/test/tuxemon-town.json");

    // Already loaded before...
    // this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");
    // this.load.image("sign", "./assets/test/sign.png");
    // this.load.image("door", "./assets/test/door.png");
  }

  create() {
    super.create("OverworldMap", "OverworldTiles", "tuxmon-sample-32px-extruded");

    // ZONE DEFINITIONS

    // DEFINIR EL x E y EN TILED CON LANDMARKS?!
    // CUANDO LO ARMEMOS BIEN, LA ZONA TIENE QUE CUBRIR LA MITAD SUPERIOR DEL CUADRADO DE COLOR
    // ASI DETECTA EL OVERLAP SOLO CUANDO LOS PIES (NO LA CABEZA) ENTRAN
    let zone1 = new Phaser.GameObjects.Zone(this, 200, 1000, 64, 64)
    zone1.displayText = "Zone 1"
    this.zones.push(zone1);

    let zone2 = new Phaser.GameObjects.Zone(this, 500, 1000, 64, 64)
    zone2.displayText = "Zone 2"
    this.zones.push(zone2);

    this.registerZones();
  }

}


// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// TEST SCENE

export class TestScene extends BaseScene {

  constructor() {
    super('TestScene');
  }

  preload() {
    this.load.image("TestTiles", "./assets/test/tuxmon-sample-32px.png");
    this.load.tilemapTiledJSON("TestMap", "./assets/test/acantilado-prueba2.json");

    this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");
    this.load.image("sign", "./assets/test/sign.png");
    this.load.image("door", "./assets/test/door.png");
  }

  create() {
    super.create("TestMap", "TestTiles", "tuxmon-sample-32px");
    let zone1 = new Phaser.GameObjects.Zone(this, 800, 910, 64, 32)
    zone1.displayText = "Test zone 1"
    this.zones.push(zone1);
    super.registerZones();
  }

}
