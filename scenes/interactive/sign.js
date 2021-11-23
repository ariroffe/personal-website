export class Sign extends Phaser.GameObjects.Image
{
	constructor(scene, x, y, text, direction) {
		super(scene, x, y, 'empty_tile');

		// Add the GameObject and collider to the scene
		scene.add.existing(this).setOrigin(0, 1);
		scene.physics.add.existing(this, true);  // true is for static body

		// Direction
		this.direction = direction;
		// Add the text and rectangle to the scene
		let offsetX, offsetY;
		if (direction === "up") {
			offsetX = 17;
			offsetY = -45;
		} else if (direction === "down") {
			offsetX = 17;
			offsetY = 24;
		} else if (direction === "center") {
			offsetX = 17;
			offsetY = 0;
		}
		
		this.signText = scene.add.bitmapText(Math.round(x+offsetX), Math.round(y+offsetY), 'pixelopmono', text, 16, 1)
            .setOrigin(0.5, 1)
		    .setDepth(101)
			.setVisible(false);
		this.signRect = scene.add.rectangle(Math.round(x+offsetX), Math.round(y+offsetY), this.signText.width+10, this.signText.height, 0xffffff)
		    .setStrokeStyle(1, 0x000000)
		    .setOrigin(0.5, 1)
		    .setDepth(100)
			.setVisible(false);
			
		// This assumes that the hitbox for the body is the same as the empty tile image (32 x 32), see door.js if not
		scene.physics.add.collider(scene.player, this, () => this.showSignText(scene.player));
	}

	showSignText(player) {
		if (this.direction === 'center') {
			// Center hits from every direction
			this.signRect.setVisible(true);
			this.signText.setVisible(true);
		} else if (this.direction === 'up' && player.body.touching.up) {
			this.signRect.setVisible(true);
			this.signText.setVisible(true);
		} else if (this.direction === 'down' && player.body.touching.down) {
			this.signRect.setVisible(true);
			this.signText.setVisible(true);
		}
	}

	hideSignText(moveleft, moveright, moveup, movedown) {
		// For now, center is cancelling as down (librarian is the only one... modify for this if necessary)
		if (moveleft || moveright) {  // || this.direction === 'center') {
			this.signRect.setVisible(false);
			this.signText.setVisible(false);
		}
		if (this.direction === 'up' &&  movedown) {
			this.signRect.setVisible(false);
			this.signText.setVisible(false);
		} else if ((this.direction === 'down' || this.direction === 'center') && moveup) {
			this.signRect.setVisible(false);
			this.signText.setVisible(false);
		}
	}

}
