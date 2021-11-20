import {Sign} from "./sign.js";
import {Door} from "./door.js"

// To be able to do scene.add.sign(...)
Phaser.GameObjects.GameObjectFactory.register('sign', function (x, y, text) {
	return new Sign(this.scene, x, y, text);
})

// To be able to do scene.add.door(...)
Phaser.GameObjects.GameObjectFactory.register('door', function (x, y, height, width, destination, link) {
	return new Door(this.scene, x, y, height, width, destination, link);
})
