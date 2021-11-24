export class BigSign extends Phaser.GameObjects.Image
{
	constructor(scene, x, y, tileHeight, tileWidth, signX, signY, sm_signX, sm_signY, text) {
		super(scene, x, y, 'empty_tile');

		// Add the GameObject and collider to the scene
		scene.add.existing(this).setOrigin(0, 1);
		scene.physics.add.existing(this, true);  // true is for static body
		this.body.setSize(tileWidth, tileHeight).setOffset(0, 32-tileHeight);  // Resize hitbox
		scene.physics.add.overlap(scene.player, this, () => this.showSignText(this, scene.player));

		// Add the text and rectangle to the scene
		// SMALL VERSION
		this.sm_signText = scene.add.bitmapText(sm_signX, sm_signY, 'pixelopmono', text, 16, 1)
			.setOrigin(0, 1)
		    .setDepth(101)
			.setVisible(false);
		this.sm_signRect = scene.add.rectangle(sm_signX-10, sm_signY, this.sm_signText.width+20, this.sm_signText.height, 0xffffff)
		    .setStrokeStyle(1, 0x000000)
		    .setOrigin(0, 1)
		    .setDepth(100)
			.setVisible(false);

		// LARGE VERSION
		this.signText = scene.add.bitmapText(signX, signY, 'pixelop', text, 32, 1)
            .setOrigin(0, 1)
		    .setDepth(101)
			.setVisible(false);
		this.signRect = scene.add.rectangle(signX-10, signY, this.signText.width+20, this.signText.height, 0xffffff)
		    .setStrokeStyle(1, 0x000000)
		    .setOrigin(0, 1)
		    .setDepth(100)
			.setVisible(false);

		this.isVisible = false;
	}

	showSignText(self, player) {
		if (!self.isVisible) {
			self.isVisible = true;
			if (window.innerWidth < 900) {
				self.sm_signRect.setVisible(true);
				self.sm_signText.setVisible(true);
			} else {
				self.signRect.setVisible(true);
				self.signText.setVisible(true);
			}

		}
	}

	hideSignText() {
		this.isVisible = false;
		this.signRect.setVisible(false);
		this.signText.setVisible(false);
		this.sm_signRect.setVisible(false);
		this.sm_signText.setVisible(false);
	}

}
