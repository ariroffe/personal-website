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

		// Add the animations to the scene
		scene.anims.create({
		  key: "purple-tile-anim",
		  frameRate: 6,
		  frames: scene.anims.generateFrameNumbers("purple_tile", { start: 0, end: 2 }),
		  yoyo: true,
		  repeatDelay: 500,
		  repeat: -1
		});
		if (scene.scene.key === 'ResearchScene') {
			const purple_tile = scene.add.sprite(x - 30, y - 10, "purple_tile").setOrigin(0, 1);
			purple_tile.setDepth(2).play("purple-tile-anim");
		}
		else {
			const purple_tile = scene.add.sprite(x - 8, y, "purple_tile").setOrigin(0, 1);
			purple_tile.setDepth(2).play("purple-tile-anim");
			// If the tile height is more than 1 tile, then the bigSign has 4 tiles
			if (tileHeight > 32) {
				const purple_tile2 = scene.add.sprite(x - 8, y - 32, "purple_tile").setOrigin(0, 1);
				purple_tile2.setDepth(2).play("purple-tile-anim");
				const purple_tile3 = scene.add.sprite(x - 8 + 32, y, "purple_tile").setOrigin(0, 1);
				purple_tile3.setDepth(2).play("purple-tile-anim");
				const purple_tile = scene.add.sprite(x - 8 + 32, y - 32, "purple_tile").setOrigin(0, 1);
				purple_tile.setDepth(2).play("purple-tile-anim");
			}
		}
	}

	showSignText(self, player) {
		// This conditional is so that the overlap is not detected if the players feet are
		// outside the tile. +20 is bc player.y is at the middle of the sprite, but self.y is at the bottom,
		// bc we did .setOrigin(..., 1)
		if (player.y+20 <= self.y) {	
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
			// A bit hacky, but if in the Overworld, play the waving animation
			if (self.scene.scene.key === 'OverworldScene' && player.body.velocity.x === 0 && player.body.velocity.y === 0) {
				player.anims.play("ariel-wave", true);
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
