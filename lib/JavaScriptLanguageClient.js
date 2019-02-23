const {AutoLanguageClient} = require('atom-languageclient')

class JavaScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.js','javascript' ] }
  getLanguageName () { return 'JavaScript' }
  getServerName () { return 'Sourcegraph' }

  startServerProcess () {
    console.log(require.resolve('javascript-typescript-langserver/lib/server'));
    return super.spawnChildNode([ require.resolve('javascript-typescript-langserver/lib/server') ]);
  }
}

module.exports = new JavaScriptLanguageClient();
