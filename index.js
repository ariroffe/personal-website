// ------------------------------------------------------------------------------------
// OVERWORLD SCENE

let GameScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function GameScene () {
    this.wasEmbedded = false;
    this.cursors = undefined;
    this.player = undefined;
    this.zone1 = undefined;
    this.wasEmbedded = false;
    Phaser.Scene.call(this, { key: 'GameScene' });
    },

  // --------------------------------------------------------------------------------------------------
  // PRELOAD

  preload: function () {
    this.load.image("tiles", "./assets/test/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "./assets/test/tuxemon-town.json");
    // this.load.image("tiles", "./assets/test/tuxmon-sample-32px.png");
    // this.load.tilemapTiledJSON("map", "./assets/test/acantilado-prueba2.json");
    // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
    // the player animations (walking left, walking right, etc.) in one image. For more info see:
    //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
    // If you don't use an atlas, you can do the same thing with a spritesheet, see:
    //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    this.load.atlas("atlas", "./assets/test/atlas.png", "./assets/test/atlas.json");
    },


  // --------------------------------------------------------------------------------------------------
  // CREATE

  create: function() {
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    // const tileset = map.addTilesetImage("tuxmon-sample-32px", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    // const belowLayer = map.createStaticLayer("Ground", tileset, 0, 0);
    // const worldLayer = map.createStaticLayer("Player level", tileset, 0, 0);

    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    // REACTIVAR LO QUE SIGUE
    worldLayer.setCollisionByProperty({ collides: true });

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      //.sprite(0, 0, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, worldLayer);

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
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);

      worldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });

    // Resize behavior
    this.scale.on('resize', this.resize, this);

    // Zones
    // DEFINIR EL x E y EN TILED CON LANDMARKS!
    // CUANDO LO ARMEMOS BIEN, LA ZONA TIENE QUE CUBRIR LA MITAD SUPERIOR DEL CUADRADO DE COLOR
    // ASI DETECTA EL OVERLAP SOLO CUANDO LOS PIES (NO LA CABEZA) ENTRAN
    this.zone1 = this.add.zone(spawnPoint.x, spawnPoint.y, 64, 64);
    this.physics.world.enable(this.zone1, 0);  // (0) DYNAMIC (1) STATIC
    this.physics.add.overlap(this.player, [this.zone1]);

    // Dialog plugin
    let dialogPlugin = this.plugins.install('dialogPlugin', DialogPlugin, true);

    this.zone1.on('enterzone', () => dialogPlugin.showDialog('Entering zone', this));
    this.zone1.on('leavezone', () => dialogPlugin.hideDialog(this));
    },

  // --------------------------------------------------------------------------------------------------
  // UPDATE

  update: function(time, delta) {
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
      // So that the x and y update if the camera moves and the mouse does not
      let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
      //let pointerPosition = pointer.position;

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


    // Update the animation last and give left/right animations precedence over up/down animations
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


    // Zone interaction
    // (for some reason, .embedded alone does not detect diagonal movement, so check touching as well
    var touching = this.zone1.body.touching;
    var isEmbedded = this.zone1.body.embedded;

    if (!this.wasEmbedded) {
      // If the player was not in the zone and is now embedded and not moving
      // if ((isEmbedded || !touching.none) && !isMoving) {
      if (isEmbedded && !isMoving) {
        this.zone1.emit('enterzone');
        this.wasEmbedded = true;
      }
    }
    else {
      // Leavezone is only called when the player exits the square, movement within does not count
      // if ((!isEmbedded && touching.none) || isMoving) {
      if (!isEmbedded && touching.none) {
        this.zone1.emit('leavezone');
        this.wasEmbedded = false;
      }
    }

    this.zone1.body.debugBodyColor = isEmbedded ? 0x00ffff : 0xffff00;
  },

  resize (gameSize, baseSize, displaySize, resolution) {
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);
  }

});



// ------------------------------------------------------------------------------------
// DIALOG PLUGIN

class DialogPlugin extends Phaser.Plugins.BasePlugin {

  constructor (pluginManager) {
    super(pluginManager);
    // this.testtext = "Hello, this is test text";
  }

  showDialog (text, scene) {
    console.log(text);
  }
  
  hideDialog (scene) {
    console.log('Leaving zone');
  }

}


// ------------------------------------------------------------------------------------
// GAME OBJECT

const config = {
  type: Phaser.AUTO,
  //width: 800,
  //height: 600,
  scale: {
    mode: Phaser.Scale.RESIZE,
    // mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game-container",
    // width: '100%',
    // height: '100%'
  },
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,  // SACAR EN PRODUCCION
      gravity: { y: 0 }
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);