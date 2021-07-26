import {OverworldScene, ResearchScene, UniversityScene} from "./game_scenes.js";


// ------------------------------------------------------------------------------------
// GAME OBJECT

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
	mode: Phaser.Scale.NONE,
	//mode: other options are .FIT, .NONE, .ENVELOP, .HEIGHT_CONTROLS_WIDTH
    autoRound: true,
	autoFocus: true,
	autoCenter: Phaser.Scale.CENTER_BOTH,
	parent: "game-container",
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
	zoom: 1 / window.devicePixelRatio,
  },
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
