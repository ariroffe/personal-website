export class Door extends Phaser.GameObjects.Image
{
	constructor(scene, x, y, height, width, destination, link) {
		super(scene, x, y, 'empty_tile');

		// Tiled coordinate is of the bottom left of the object
		this.setOrigin(0, 1);

		// Add the GameObject and collider to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this, true);  // true is for static body
		this.body.setSize(width, height, false).setOffset(0, 32-height);
		// The false is to make the body's top left coincide with the image's top left
		// The offset is to move the y to the bottom (32 is the height of the image)

		this.destination = destination;
		this.link = link;
		scene.physics.add.collider(scene.player, this, () => this.enterDoor(scene));
	}

	enterDoor(scene) {
		if (!scene.player.body.touching.none && scene.player.body.wasTouching.none) {
			if (this.link) {
			    window.location.href = "./sites/" + this.destination + ".html";
            } else {
			    scene.scene.switch(this.destination);
            }
		}
	}
}
