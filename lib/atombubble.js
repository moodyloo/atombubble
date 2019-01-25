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

  extract() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const selection = editor.getSelectedText();
      console.log(selection);
    }
  },

  // toggle atom bubble view
  toggle() {
    var mp = document.createElement('div');
    mp.innerHTML = 'Hi, this is a modal panel';
    this.modalpanel = atom.workspace.addTopPanel({
      item: mp,
      visible: false,
    });

    atom.workspace.toggle('atom://atombubble');
  },

  //create a bubble of the code in an existing text editor
  bubblify() {
    var textEditor = atom.workspace.getActiveTextEditor()
    console.log(atom.views.getView(textEditor));
    var textEditorContent = textEditor.getText();
    var bubble = document.createElement('atom-text-editor');
    var model = bubble.getModel();
    model.insertText(textEditorContent);
    this.atombubbleview.addBubble(bubble);
  },

  deserializeAtomBubbleView(serialized) {
    return new AtomBubbleView();
  }

};
