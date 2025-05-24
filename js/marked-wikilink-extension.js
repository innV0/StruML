// js/marked-wikilink-extension.js

const wikilinkExtension = {
  name: 'wikilink',
  level: 'inline', // This is an inline-level extension
  start(src) {
    console.log('[wikilinkExtension start] Source:', src);
    const matchIndex = src.match(/\[\[/)?.index;
    console.log('[wikilinkExtension start] Match index:', matchIndex);
    return matchIndex; // Find the first occurrence of '[['
  },
  tokenizer(src, tokens) {
    console.log('[wikilinkExtension tokenizer] Source:', src);
    const rule = /^\[\[([^\]]+)\]\]/; // Regex to match [[Page Title]]
    const match = rule.exec(src);
    console.log('[wikilinkExtension tokenizer] Match result:', match);
    if (match) {
      const title = match[1].trim();
      // Return a token object
      const token = {
        type: 'wikilink',
        raw: match[0],
        title: title,
        // Optional: you can add other properties to the token if needed
      };
      console.log('[wikilinkExtension tokenizer] Token created:', token);
      return token;
    }
  },
  renderer(token) {
    console.log('[wikilinkExtension renderer] Token received:', token);
    // Render the token as an HTML span placeholder
    // The actual React component will be mounted later
    const htmlOutput = `<span class="item-badge-placeholder" data-item-title="${token.title}"></span>`;
    console.log('[wikilinkExtension renderer] HTML output:', htmlOutput);
    return htmlOutput;
  }
};

// Export the extension to be used in utils.js
if (typeof window.StruMLApp === 'undefined') {
  window.StruMLApp = {};
}
if (typeof window.StruMLApp.MarkedExtensions === 'undefined') {
  window.StruMLApp.MarkedExtensions = {};
}
window.StruMLApp.MarkedExtensions.wikilink = wikilinkExtension;
