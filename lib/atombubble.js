'use babel';
import {
  CompositeDisposable,
  Disposable
} from 'atom';
import AtomBubbleView from './atombubble-view';

export default {

  subscriptions: null,
  modalpanel: null,
  atombubbleview: null,

  activate(state) {
    this.atombubbleview = new AtomBubbleView(state.AtomBubbleViewState);
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://atombubble') {
          return this.atombubbleview;
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'atombubble:toggle': () => this.toggle(),
        'atombubble:extract': () => this.extract(),
        'atombubble:bubblify': () => this.bubblify()
      }),

      // Destroy any ActiveEditorInfoViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach((item) => {
          if (item instanceof AtomBubbleView) {
            item.destroy();
          }
        });
      }),
    );
  },


  deactivate() {
    this.subscriptions.dispose();
  },

  //create bubble of extracted function/method
  extract() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) { //if anything was extracted
      const selection = editor.getSelectedBufferRange(); //get range of extracted function in editor
      const marker = editor.markBufferRange(selection); //get logical range of extracted function
      console.log(marker.getBufferRange());
      this.atombubbleview.addBubble(editor,marker);
    }
  },

  // toggle atom bubble view
  toggle() {
    atom.workspace.toggle('atom://atombubble');
  },

  //create a bubble of the code in an existing text editor
  bubblify() {
    var textEditor = atom.workspace.getActiveTextEditor(); //get model of active text editor
    var textEditorContent = textEditor.getText(); //get all text from active text editor

    //pass model of  atom-text-editor and model of active text editor
    this.atombubbleview.addBubble(textEditor,{});
  },

  //value from serialize passed to this function
  //add deserializer object to package.json
  //return current state of package

  deserializeAtomBubbleView(serialized) {
      return new AtomBubbleView();
  },

};
