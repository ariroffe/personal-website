// ------------------------------------------------------------------------------------
// DIALOG PLUGIN

export class DialogPlugin extends Phaser.Plugins.BasePlugin {

  constructor (pluginManager) {
    super(pluginManager);
    // this.testtext = "Hello, this is test text";
  }

  showDialog (text, scene) {
    console.log(text);
  }

  hideDialog (scene) {
    console.log('Leaving zone');
  }

}