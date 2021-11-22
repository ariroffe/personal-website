export class Sign extends Phaser.GameObjects.Image
{
	constructor(scene, x, y, text) {
		super(scene, x, y, 'empty_tile');

		// Add the GameObject and collider to the scene
		scene.add.existing(this).setOrigin(0, 1);
		scene.physics.add.existing(this, true);  // true is for static body
		// This assumes that the hitbox for the body is the same as the empty tile image (32 x 32), see door.js if not
		scene.physics.add.collider(scene.player, this, () => this.showSignText(scene.player));

		// Add the text and rectangle to the scene
		this.signText = scene.add.bitmapText(Math.round(x+17), Math.round(y-45), 'pixelopmono', text, 16, 1)
            .setOrigin(0.5, 1)
		    //.setScale(0.75)
		    .setDepth(101)
			.setVisible(false);
		this.signRect = scene.add.rectangle(Math.round(x+17), Math.round(y-45), this.signText.width+10, this.signText.height, 0xffffff)
		    .setStrokeStyle(1, 0x000000)
		    .setOrigin(0.5, 1)
		    .setDepth(100)
			.setVisible(false);
	}

	showSignText(player) {
		if (player.body.touching.up && !player.body.wasTouching.up) {
			this.signRect.setVisible(true);
			this.signText.setVisible(true);
		}
	}

	hideSignText() {
		this.signRect.setVisible(false);
		this.signText.setVisible(false);
	}

}
