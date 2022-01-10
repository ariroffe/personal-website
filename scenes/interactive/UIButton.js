class UIButton extends Phaser.GameObjects.Image
{
  constructor(scene, x, y, texture1, texture2) {
    super(scene, x, y, texture1);

    // Add to scene
    scene.add.existing(this);

    // Fix in place when camera moves, and sit on top of the game.
    this.setScrollFactor(0).setDepth(105);

    // When the button is clicked it will toggle between texture1 and texture2
    this.initialX = x;  // Initial x position, will be changed when entering fullscreen
    this.texture1 = texture1;
    this.texture2 = texture2;
    this.activated = false;

    // Texture to display at creation or at scene wake event
    const self = this;
    this.setInitialTexture(self);
    scene.events.on('wake', () => this.setInitialTexture(self))  // IMPLEMENT IN SUBCLASS!!!

    // Binding for the pointerdown event
    this.setInteractive({useHandCursor: true}).on('pointerdown', () => this.clickButton(self, scene))
  }

  clickButton(self, scene) {
    window.mouseOverMenu = true;  // Do not move the player
    if (!self.activated) {
      self.activateButton(self, scene);  // IMPLEMENT IN SUBCLASS!!!
    } else {
      self.deactivateButton(self, scene);  // IMPLEMENT IN SUBCLASS!!!
    }
  }
}


export class FullscreenButton extends UIButton {
  setInitialTexture(self) {
    if (self.scene.scale.isFullscreen) {
      // If we are already at fullscreen
      self.setTexture(self.texture2);  // set the exit fullscreen texture
      self.x = self.initialX - 100;    // move buttons to the left
      self.scene.musicButton.x = self.scene.musicButton.initialX - 100;
    } else {
      // Otherwise, the enter fullscreen one, and return the buttons to orig place
      self.setTexture(self.texture1);
      self.x = self.initialX;
      self.scene.musicButton.x = self.scene.musicButton.initialX;
    }
  }

  activateButton(self, scene) {
    self.scene.scale.startFullscreen();
    self.setTexture(self.texture2);

    // Move the buttons to the left (since the menu disappears)
    self.x = self.initialX - 100;
    scene.musicButton.x = scene.musicButton.initialX - 100;

    self.activated = true;
  }

  deactivateButton(self, scene) {
    self.scene.scale.stopFullscreen();
    self.setTexture(self.texture1);

    // Move the buttons to the right (since the menu resappears)
    self.x = self.initialX;
    scene.musicButton.x = scene.musicButton.initialX;

    self.activated = false;
  }
}


export class MusicButton extends UIButton {
  setInitialTexture(self) {
    const prevMusic = self.scene.sound.get('music')
    // If the 'music' key exists and it is playing, set the mute button;
    if (prevMusic !== null && prevMusic.isPlaying) {
      self.setTexture(self.texture2);
    } else {
      self.setTexture(self.texture1);  // Otherwise, the play music one
    }
  }

  activateButton(self, scene) {
    // Music will load on click, check that it not loading from prev click in this scene
    if (!scene.load.isLoading()) {
      const music = scene.sound.get('music');  // null if the key does not exist yet (i.e. audio not loaded)
      if (music !== null) {
        // The key exists (audio file was loaded in previous click or scene)
        music.resume();
        self.setTexture(self.texture2);
        self.activated = true;
      } else {
        // The audio is not loaded, load it now
        scene.load.audio('music', '/assets/prod/audio/music.mp3');
        scene.load.once('complete', function() {
          scene.sound.play('music');
          self.setTexture(self.texture2);
          self.activated = true;
        });
        scene.load.start();
      }
    }
  }

  deactivateButton(self, scene) {
    const music = scene.sound.get('music');
    if (music !== null) music.pause();  // The conditional should always be true here but I leave it just in case
    self.setTexture(self.texture1);
    self.activated = false;
  }
}
