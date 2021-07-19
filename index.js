import {OverworldScene, ResearchScene, UniversityScene} from "./game_scenes.js";


// ------------------------------------------------------------------------------------
// GAME OBJECT

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
	mode: Phaser.Scale.NONE,
    //mode: Phaser.Scale.RESIZE,
	//mode: Phaser.Scale.FIT,
    //mode: Phaser.Scale.ENVELOP,
	//mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoRound: true,
	autoCenter: Phaser.Scale.CENTER_BOTH,
	parent: "game-container",
    width: 640,
    height: 480,
    //width: '100%',
    //height: '100%'
  },
  //	parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,  // Remove in production
	  //debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [OverworldScene, ResearchScene, UniversityScene]
};

const game = new Phaser.Game(config);
