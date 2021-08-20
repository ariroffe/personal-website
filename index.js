import {OverworldScene, ResearchScene, UniversityScene} from "./game_scenes.js";


// ------------------------------------------------------------------------------------
// GAME OBJECT

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
	mode: Phaser.Scale.NONE,
    autoRound: true,
	autoFocus: true,
	autoCenter: Phaser.Scale.NO_CENTER,
	parent: "game-container",
    width: window.innerWidth,
	height: window.innerHeight
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,  // Remove in production
	  // debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [OverworldScene, ResearchScene, UniversityScene]
};


const game = new Phaser.Game(config);


// ------------------------------------------------------------------------------------
// RESIZE BEHAVIOR

window.addEventListener('resize', function (event) {
    // Has to be done here instead of in the scene's resize event handler
	// bc otherwise we get infinite recursion (game.scale.resize emits 'resize')
	game.scale.resize(window.innerWidth, window.innerHeight);
  }, false);
