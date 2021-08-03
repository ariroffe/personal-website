import {OverworldScene, ResearchScene, UniversityScene} from "./game_scenes.js";

const DPRtrunc = Math.trunc(window.devicePixelRatio * 100) / 100;  // So that dprs like 2.63541.. floor to 2.63
const DPRrounded = Math.floor(window.devicePixelRatio);            // Then floor it to 2
const DPRzoom = DPRrounded / DPRtrunc;			                   // The zoom should be 2 / 2.63
const DPRscreen = DPRtrunc / DPRrounded;			   	           // The screen size adjustment 2.63 / 2


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
    width: Math.floor(window.innerWidth * DPRscreen),
	height: Math.floor(window.innerHeight * DPRscreen),
	zoom: DPRzoom,
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


// ------------------------------------------------------------------------------------
// RESIZE BEHAVIOR

window.addEventListener('resize', function (event) {
    // Has to be done here instead of in the scene's resize event handler
	// bc otherwise we get infinite recursion (game.scale.resize emits 'resize')
	const newWidth = Math.floor(window.innerWidth * DPRscreen);
    const newHeight = Math.floor(window.innerHeight * DPRscreen);
	game.scale.resize(newWidth, newHeight);
  }, false);
