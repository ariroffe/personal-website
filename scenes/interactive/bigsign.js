export class BigSign extends Phaser.GameObjects.Zone
{
	constructor(scene, x, y, width, height, signX, signY, sm_signX, sm_signY, text) {
		super(scene, x, y, width, height);

		// Add the GameObject and collider to the scene
		scene.add.existing(this).setOrigin(0, 1);
		scene.physics.world.enable(this, 1);  // 1 is for static body
		scene.physics.add.overlap(scene.player, this, () => this.showSignText(scene.player));

		// Add the text and rectangle to the scene
		// SMALL VERSION
		this.sm_signText = scene.add.bitmapText(sm_signX, sm_signY, 'pixelop', text, 16, 1)
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

		// Add the glowing animations to the scene
		scene.anims.create({
      key: "purple-tile-anim",
      frames: scene.anims.generateFrameNames("anims_ui", {
        prefix: "purple.",
        start: 0,
        end: 2,
        zeroPad: 3
      }),
      frameRate: 6,
      yoyo: true,
			delay: 400,
			repeatDelay: 800,
			repeat: -1
    });
		this.purple_tiles = [];
		if (scene.scene.key === 'ResearchScene') {
			this.purple_tiles.push(scene.add.sprite(x - 30, y - 10, "anims_ui", "purple.000").setOrigin(0, 1));
		}
		else {
			this.purple_tiles.push(scene.add.sprite(x - 8, y, "anims_ui", "purple.000").setOrigin(0, 1));
			// If the tile height is more than 1 tile, then the bigSign has 4 tiles
			if (height > 32) {
				this.purple_tiles.push(scene.add.sprite(x - 8, y - 32, "anims_ui", "purple.000").setOrigin(0, 1));
				this.purple_tiles.push(scene.add.sprite(x - 8 + 32, y, "anims_ui", "purple.000").setOrigin(0, 1));
				this.purple_tiles.push(scene.add.sprite(x - 8 + 32, y - 32, "anims_ui", "purple.000").setOrigin(0, 1));
			}
		}
		this.purple_tiles.forEach((purple_tile) => purple_tile.setDepth(2).play("purple-tile-anim", true));

		this.activated = false;     // So that the hideSignText code executes only if the bigSign was activated
	}

	showSignText(player) {
		// So that the overlap is not detected if the players feet are
		// outside the tile. +20 is bc player.y is at the middle of the sprite, but this.y is at the bottom,
		// bc we did .setOrigin(..., 1)
		if (Math.ceil(player.y+20) <= this.y) {
			this.purple_tiles.forEach((purple_tile) => purple_tile.anims.stop().setTint(0xffff00));
			this.activated = true;
			if (window.innerWidth < 900) {
				this.sm_signRect.setVisible(true);
				this.sm_signText.setVisible(true);
			} else {
				this.signRect.setVisible(true);
				this.signText.setVisible(true);
			}
			// A bit hacky, but if in the Overworld, play the waving animation
			if (this.scene.scene.key === 'OverworldScene' && player.body.velocity.x === 0 && player.body.velocity.y === 0) {
				player.anims.play("ariel-wave", true);
			}
		}
	}

	hideSignText(player) {
		if (this.activated) {  // So that the following code does not execute at every frame, but only once to hide the text
			// Check that the player is either not embedded nor touching or with feet outside the square
			if ((!player.body.embedded && player.body.touching.none) || Math.ceil(player.y+20) > this.y) {
				this.signRect.setVisible(false);
				this.signText.setVisible(false);
				this.sm_signRect.setVisible(false);
				this.sm_signText.setVisible(false);
				this.purple_tiles.forEach((purple_tile) => {
					purple_tile.clearTint();  // Remove the tint
				});
				this.activated = false;
			}
		}
	}
}
