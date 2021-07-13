import {OverworldScene, ResearchScene, UniversityScene} from "./game_scenes.js";


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
  scene: [OverworldScene, ResearchScene, UniversityScene]
};

const game = new Phaser.Game(config);
