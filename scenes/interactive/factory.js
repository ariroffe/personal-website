import {Sign} from "./sign.js";
import {BigSign} from "./bigsign.js";
import {Door} from "./door.js"
import {Player} from "./player.js";
import {FullscreenButton, MusicButton} from "./UIButton.js"

// To be able to do scene.add.sign(...)
Phaser.GameObjects.GameObjectFactory.register('sign', function (x, y, text, direction) {
	return new Sign(this.scene, x, y, text, direction);
})

// To be able to do scene.add.bigSign(...)
Phaser.GameObjects.GameObjectFactory.register('bigSign', function (x, y,  width, height, signX, signY, sm_signX, sm_signY, text) {
	return new BigSign(this.scene, x, y, width, height, signX, signY, sm_signX, sm_signY, text);
})

// To be able to do scene.add.door(...)
Phaser.GameObjects.GameObjectFactory.register('door', function (x, y, width, height, destination, link) {
	return new Door(this.scene, x, y, width, height, destination, link);
})

// To be able to do scene.add.player(...)
Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, texture, frame) {
	return new Player(this.scene, x, y, texture, frame);
})

// Music and fullscreen buttons
Phaser.GameObjects.GameObjectFactory.register('fullscreenButton', function (x, y, texture1, texture2) {
	return new FullscreenButton(this.scene, x, y, texture1, texture2);
})
Phaser.GameObjects.GameObjectFactory.register('musicButton', function (x, y, texture1, texture2) {
	return new MusicButton(this.scene, x, y, texture1, texture2);
})
