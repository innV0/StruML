// js/marked-wikilink-extension.js

const wikilinkExtension = {
  name: 'wikilink',
  level: 'inline', // This is an inline-level extension
  start(src) {
    return src.match(/\[\[/)?.index; // Find the first occurrence of '[['
  },
  tokenizer(src, tokens) {
    const rule = /^\[\[([^\]]+)\]\]/; // Regex to match [[Page Title]]
    const match = rule.exec(src);
    if (match) {
      const title = match[1].trim();
      // Return a token object
      return {
        type: 'wikilink',
        raw: match[0],
        title: title,
        // Optional: you can add other properties to the token if needed
      };
    }
  },
  renderer(token) {
    // Render the token as an HTML span placeholder
    // The actual React component will be mounted later
    return `<span class="item-badge-placeholder" data-item-title="${token.title}"></span>`;
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
