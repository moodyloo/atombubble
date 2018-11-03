'use babel';

import {
  CompositeDisposable,
  Disposable
} from 'atom';
import AtomBubbleView from './atombubble-view';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://atombubble') {
          return new AtomBubbleView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'atombubble:toggle': () => this.toggle(),
        'atombubble:extract': () => this.extract()
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
    atom.workspace.toggle('atom://atombubble');
  },

  deserializeAtomBubbleView(serialized) {
    return new AtomBubbleView();
  }

};
