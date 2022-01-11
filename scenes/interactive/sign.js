export class Sign extends Phaser.GameObjects.Zone
{
	constructor(scene, x, y, text, direction) {
		super(scene, x, y, 32, 32);

		// Add the GameObject and collider to the scene
		scene.add.existing(this).setOrigin(0, 1);
		scene.physics.world.enable(this, 1);  // 1 is for static body

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
		
		this.signText = scene.add.bitmapText(Math.round(x+offsetX), Math.round(y+offsetY), 'pixelop', text, 16, 1)
			.setOrigin(0.5, 1)
			.setDepth(101)
			.setVisible(false);
		this.signRect = scene.add.rectangle(Math.round(x+offsetX), Math.round(y+offsetY), this.signText.width+10, this.signText.height, 0xffffff)
			.setStrokeStyle(1, 0x000000)
			.setOrigin(0.5, 1)
			.setDepth(100)
			.setVisible(false);
			
		// This assumes that the hitbox for the body is the same as the empty tile image (32 x 32), see door.js if not
		scene.physics.add.collider(scene.player, this, () => this.collideSign(scene.player));

		// By click or touch it activates within a given distance (clickRadius)
		this.setInteractive().on('pointerdown', this.clickSign);
		this.clickRadius = 100;
		this.showByClick = false;

		this.activated = false;
	}

	collideSign(player) {
		if (!this.activated) {
			if (this.direction === 'center') {
				// Center hits from every direction
				this.showSignText();
			} else if (this.direction === 'up' && player.body.touching.up) {
				this.showSignText();
			} else if (this.direction === 'down' && player.body.touching.down) {
				this.showSignText();
			}
		}
	}

	clickSign() {
		if (!this.activated) {
			// getCenter necessary bc signs have setOrigin(0,1)
			let distance = Phaser.Math.Distance.BetweenPoints(this.getCenter(), this.scene.player);
			if (distance < this.clickRadius) {
				if (this.scene.scene.key === 'UniversityScene') this.scene.signs.forEach((other_sign) => other_sign.hideSignText());  // So there is no clutter in the classroom
				this.showSignText();
				this.showByClick = true;
			}
		}
	}

	showSignText() {
		this.signRect.setVisible(true);
		this.signText.setVisible(true);
		this.scene.showingSign = true;  // A property of the scene, see BaseScene's update
		this.activated = true;
	}

	playerMovement(moveleft, moveright, moveup, movedown) {
		// A check for activated is done in BaseScene before calling this
		if (this.showByClick) {
			// If the player activated the sign via pointerdown, then remove it only when she goes away
			if (Phaser.Math.Distance.BetweenPoints(this.getCenter(), this.scene.player) > this.clickRadius) {
				this.hideSignText();
			}
		} else {  // Otherwise, the player activated the sign via collision
			if (moveleft || moveright) {
				this.hideSignText();
			} else if (this.direction === 'up' &&  movedown) {
				this.hideSignText();
			} else if ((this.direction === 'down' || this.direction === 'center') && !movedown) {
				this.hideSignText();
			}
		}
	}

	hideSignText() {
		this.signRect.setVisible(false);
		this.signText.setVisible(false);
		this.showByClick = false;
		this.scene.showingSign = false;  // A property of the scene, see BaseScene's update
		this.activated = false;
	}

}
