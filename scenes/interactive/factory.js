import {Sign} from "./sign.js";

// To be able to do scene.add.sign(...)
Phaser.GameObjects.GameObjectFactory.register('sign', function (x, y, text) {
	return new Sign(this.scene, x, y, text);
})
