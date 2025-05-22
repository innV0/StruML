/**
 * StruML Utility Functions - Refactored Version
 * 
 * This file has been refactorized to:
 * - Use modular organization with clear separation of responsibilities
 * - Implement Handlebars as template engine
 * - Improve error handling and logging
 * - Use modern JavaScript practices
 */

// Initialize the global namespace
window.StruMLApp = window.StruMLApp || {};
window.StruMLApp.Utils = {};
window.StruMLApp.Utils.getSampleItem = function() {
  return {
      id: "sample_" + Date.now(),
      title: "Sample Item",
      content: "Sample content",
      tags: "",
      items: []
  };
};

// ====================================
// CORE UTILITIES
// ====================================

/**
 * Generate a unique ID
 * @returns {string} A unique identifier
 */
window.StruMLApp.Utils.generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Create a deep copy of an object
 * @param {Object} obj - The object to copy
 * @returns {Object} A deep copy of the object
 */
window.StruMLApp.Utils.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Show an alert message using Bootstrap toasts
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, warning, info)
 * @param {number} duration - How long to display the toast in milliseconds
 */
window.StruMLApp.Utils.showAlert = (message, type = 'success', duration = 3000) => {
  const toastId = `toast-${Date.now()}`;
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <span class="bg-${type} rounded me-2" style="width:16px; height:16px;"></span>
        <strong class="me-auto">StruML</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { 
        autohide: true, 
        delay: duration 
      });
      
      toast.show();
      
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
      });
    }
  }
};

/**
 * Centralized error logging function
 * @param {string} context - The context where the error occurred
 * @param {Error} error - The error object
 * @param {boolean} showToUser - Whether to show the error to the user
 */
window.StruMLApp.Utils.logError = (context, error, showToUser = false) => {
  const errorMessage = `Error in ${context}: ${error.message}`;
  console.error(errorMessage, error);
  
  if (showToUser) {
    window.StruMLApp.Utils.showAlert(errorMessage, 'error');
  }
  
  return errorMessage;
};

// ====================================
// CONTENT RENDERING
// ====================================

/**
 * Sanitize and render markdown content
 * @param {string} content - The markdown content to render
 * @returns {string} Sanitized HTML
 */
window.StruMLApp.Utils.renderMarkdown = (content) => {
  if (!content) return '';
  try {
    const rawHtml = marked.parse(content);
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    window.StruMLApp.Utils.logError('renderMarkdown', error);
    return `<p class="text-red-500">Error rendering markdown: ${error.message}</p>`;
  }
};

// ====================================
// TAG HANDLING
// ====================================

/**
 * Parse tags string into an array of tag objects
 * @param {string} tagsString - Comma-separated tags
 * @returns {Array} Array of tag objects
 */
window.StruMLApp.Utils.parseTags = (tagsString) => {
  if (!tagsString) return [];
  
  return tagsString.split(',').map(tag => {
    tag = tag.trim();
    if (!tag) return null;
    
    // Check for special tag formats
    if (tag.includes('::')) {
      const [type, value] = tag.split('::').map(part => part.trim());
      return { type, value, full: tag };
    }
    
    // Check for relation tags
    if (tag.includes('>>')) {
      const [relation, target] = tag.split('>>').map(part => part.trim());
      return { type: 'relation', relation, target, full: tag };
    }
    
    // Regular tag
    return { type: 'default', value: tag, full: tag };
  }).filter(Boolean);
};

/**
 * Extract relations from tags
 * @param {string} tagsString - Comma-separated tags
 * @returns {Array} Array of relation tag objects
 */
window.StruMLApp.Utils.extractRelations = (tagsString) => {
  const tags = window.StruMLApp.Utils.parseTags(tagsString);
  return tags.filter(tag => tag.type === 'relation');
};

/**
 * Extract all unique tags from items
 * @param {Array} items - Array of items
 * @returns {Array} Array of unique tags
 */
window.StruMLApp.Utils.extractAllTags = (items) => {
  if (!items || !Array.isArray(items)) return [];
  
  const tagSet = new Set();
  
  const processItem = (item) => {
    if (item.tags) {
      const tags = item.tags.split(',').map(tag => tag.trim());
      
      tags.forEach(tag => {
        // Skip empty tags
        if (!tag) return;
        
        // Skip relation tags (with >>)
        if (tag.includes('>>')) return;
        
        // Add tag to set
        tagSet.add(tag);
      });
    }
    
    // Process child items
    if (item.items && item.items.length > 0) {
      item.items.forEach(processItem);
    }
  };
  
  // Process all items
  items.forEach(processItem);
  
  // Convert set to array and sort alphabetically
  return Array.from(tagSet).sort();
};

// ====================================
// ITEM OPERATIONS
// ====================================

/**
 * Find an item by ID in the document
 * @param {Array} items - Array of items to search
 * @param {string} id - ID to find
 * @returns {Object|null} The found item or null
 */
window.StruMLApp.Utils.findItemById = (items, id) => {
  if (!items || !id) return null;
  
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    
    if (item.items && item.items.length > 0) {
      const found = window.StruMLApp.Utils.findItemById(item.items, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

/**
 * Find an item by title in the document
 * @param {Array} items - Array of items to search
 * @param {string} title - Title to find
 * @returns {Object|null} The found item or null
 */
window.StruMLApp.Utils.findItemByTitle = (items, title) => {
  if (!items || !title) return null;
  
  for (const item of items) {
    if (item.title === title) {
      return item;
    }
    
    if (item.items && item.items.length > 0) {
      const found = window.StruMLApp.Utils.findItemByTitle(item.items, title);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

/**
 * Find the parent of an item and its index within the parent's items array.
 * @param {Array} items - The array of items to search (usually document.items).
 * @param {string} itemId - The ID of the item whose parent is to be found.
 * @returns {Object|null} An object { parent: parentItem, index: itemIndex } or null if not found or root.
 */
window.StruMLApp.Utils.findParentItem = (items, itemId) => {
  if (!items || !itemId) return null;

  for (const parentCandidate of items) {
    if (parentCandidate.items && parentCandidate.items.length > 0) {
      const itemIndex = parentCandidate.items.findIndex(child => child.id === itemId);
      if (itemIndex !== -1) {
        return { parent: parentCandidate, index: itemIndex };
      }
      // Recursively search in children's items
      const foundInChild = window.StruMLApp.Utils.findParentItem(parentCandidate.items, itemId);
      if (foundInChild) {
        return foundInChild;
      }
    }
  }
  // If the loop finishes, it means the itemId was not found as a child in the current list of items.
  // It could be a root item, or not exist. If it's a root item, it has no parent.
  return null; 
};

/**
 * Create a new empty item
 * @param {string} parentId - Optional parent ID
 * @returns {Object} A new item object
 */
window.StruMLApp.Utils.createEmptyItem = (parentId = null) => {
  return {
    id: window.StruMLApp.Utils.generateId(),
    title: 'New Item',
    content: '',
    tags: '',
    items: []
  };
};

/**
 * Find the class of an item by looking for a class tag in the item or its ancestors
 * @param {Object} currentItem - The item to check
 * @param {Array} allItems - All items in the document
 * @returns {string} The class value or empty string
 */
window.StruMLApp.Utils.getItemClass = function(currentItem, allItems) {
  // First, check if the current item has a class tag
  if (currentItem && currentItem.tags) {
    const tags = window.StruMLApp.Utils.parseTags(currentItem.tags);
    
    // Check for class tag in format "class::value"
    const classTag = tags.find(tag => tag.type === 'class');
    if (classTag && classTag.value) {
      return classTag.value;
    }
    
    // Check for simple "class" tag (without value)
    const simpleClassTag = tags.find(tag => tag.full === 'class');
    if (simpleClassTag) {
      // If the item has a simple "class" tag, use its title as the class value
      console.log(`Found simple "class" tag in item "${currentItem.title}", using title as class value`);
      return currentItem.title;
    }
  }
  
  // If no class tag found in the current item, look for it in the ancestors
  if (currentItem && allItems) {
    // Find the path from root to the current item
    const findItemPath = (items, itemId, path = []) => {
      for (const item of items) {
        if (item.id === itemId) {
          return [...path, item];
        }
        
        if (item.items && item.items.length > 0) {
          const foundPath = findItemPath(item.items, itemId, [...path, item]);
          if (foundPath) return foundPath;
        }
      }
      
      return null;
    };
    
    const path = findItemPath(allItems, currentItem.id);
    
    if (path) {
      // Check each ancestor (from parent to root) for a class tag
      for (let i = path.length - 2; i >= 0; i--) {
        const ancestor = path[i];
        if (ancestor.tags) {
          const tags = window.StruMLApp.Utils.parseTags(ancestor.tags);
          
          // Check for class tag in format "class::value"
          const classTag = tags.find(tag => tag.type === 'class');
          if (classTag && classTag.value) {
            console.log(`Found class tag "${classTag.value}" in ancestor "${ancestor.title}"`);
            return classTag.value;
          }
          
          // Check for simple "class" tag (without value)
          const simpleClassTag = tags.find(tag => tag.full === 'class');
          if (simpleClassTag) {
            // If the ancestor has a simple "class" tag, use its title as the class value
            console.log(`Found simple "class" tag in ancestor "${ancestor.title}", using title as class value`);
            return ancestor.title;
          }
        }
      }
    }
  }
  
  // If no class tag found in the item or its ancestors, return an empty string
  console.log(`No class tag found for item "${currentItem.title}" or its ancestors`);
  return '';
};

/**
 * Filter document structure excluding specific items
 * @param {Object} document - The document to filter
 * @returns {Object} Filtered document
 */
window.StruMLApp.Utils.filterDocumentStructure = function(document) {
  if (!document) return null;
  
  // Create a deep copy of the document
  const filteredDocument = window.StruMLApp.Utils.deepCopy(document);
  
  // Function to filter items recursively
  const filterItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.filter(item => {
      // Exclude items with titles "Metamodel" or "🤖 AI Chats"
      if (item.title === "Metamodel" || item.title === "🤖 AI Chats") {
        return false;
      }
      
      // Process child items recursively
      if (item.items && item.items.length > 0) {
        item.items = filterItems(item.items);
      }
      
      return true;
    });
  };
  
  // Filter the items in the document
  filteredDocument.items = filterItems(filteredDocument.items);
  
  return filteredDocument;
};

/**
 * Find or create an AI Chats parent item
 * @param {Object} document - The document
 * @param {Function} createItemFn - Function to create an item
 * @returns {Object|null} The AI Chats item or null
 */
window.StruMLApp.Utils.findOrCreateAIChatsItem = function(document, createItemFn) {
  if (!document || !document.items) return null;
  
  // Try to find the AI Chats item
  const findAIChatsItem = (items) => {
    if (!items || !Array.isArray(items)) return null;
    
    for (const item of items) {
      if (item.title === "🤖 AI Chats") {
        return item;
      }
      
      if (item.items && item.items.length > 0) {
        const found = findAIChatsItem(item.items);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // Look for the AI Chats item in the document
  let aiChatsItem = findAIChatsItem(document.items);
  
  // If not found and createItemFn is provided, create it
  if (!aiChatsItem && createItemFn) {
    const newItem = {
      id: window.StruMLApp.Utils.generateId(),
      title: "🤖 AI Chats",
      content: "This item contains all AI-generated chats.",
      tags: "system",
      items: []
    };
    
    // Create the item at the top level (no parent)
    const newItemId = createItemFn(null, newItem);
    
    // Return the newly created item
    if (newItemId) {
      aiChatsItem = newItem;
    }
  }
  
  return aiChatsItem;
};

// ====================================
// STORAGE OPERATIONS
// ====================================

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {Object} data - Data to save
 * @returns {boolean} Success status
 */
window.StruMLApp.Utils.saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    window.StruMLApp.Utils.logError('saveToLocalStorage', error);
    return false;
  }
};

/**
 * Load data from local storage
 * @param {string} key - Storage key
 * @returns {Object|null} The loaded data or null
 */
window.StruMLApp.Utils.loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    window.StruMLApp.Utils.logError('loadFromLocalStorage', error);
    return null;
  }
};

/**
 * Save chat history to localStorage
 * @param {string} itemId - ID of the item
 * @param {Array} messages - Chat messages
 * @returns {boolean} Success status
 */
window.StruMLApp.Utils.saveChatHistory = function(itemId, messages) {
  try {
    // Create a unique key for each item
    const key = `struml-chat-history-${itemId}`;
    
    // Save the messages to localStorage
    localStorage.setItem(key, JSON.stringify(messages));
    return true;
  } catch (error) {
    window.StruMLApp.Utils.logError('saveChatHistory', error);
    return false;
  }
};

/**
 * Load chat history from localStorage
 * @param {string} itemId - ID of the item
 * @returns {Array} Chat messages
 */
window.StruMLApp.Utils.loadChatHistory = function(itemId) {
  try {
    // Create a unique key for each item
    const key = `struml-chat-history-${itemId}`;
    
    // Load the messages from localStorage
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    window.StruMLApp.Utils.logError('loadChatHistory', error);
    return [];
  }
};

/**
 * Clear chat history from localStorage
 * @param {string} itemId - ID of the item
 * @returns {boolean} Success status
 */
window.StruMLApp.Utils.clearChatHistory = function(itemId) {
  try {
    // Create a unique key for each item
    const key = `struml-chat-history-${itemId}`;
    
    // Remove the messages from localStorage
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    window.StruMLApp.Utils.logError('clearChatHistory', error);
    return false;
  }
};

// ====================================
// FILE OPERATIONS
// ====================================

/**
 * Download data as a file
 * @param {string} data - The data to download
 * @param {string} filename - The filename
 * @param {string} type - The MIME type
 */
window.StruMLApp.Utils.downloadFile = (data, filename, type = 'application/json') => {
  try {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    window.StruMLApp.Utils.logError('downloadFile', error, true);
  }
};

/**
 * Export document as JSON
 * @param {Object} document - The document to export
 */
window.StruMLApp.Utils.exportAsJson = (document) => {
  try {
    const data = JSON.stringify(document, null, 2);
    window.StruMLApp.Utils.downloadFile(data, `${document.title || 'document'}.struml.json`, 'application/json');
  } catch (error) {
    window.StruMLApp.Utils.logError('exportAsJson', error, true);
  }
};

/**
 * Export document as Markdown
 * @param {Object} document - The document to export
 */
window.StruMLApp.Utils.exportAsMarkdown = (document) => {
  try {
    let markdown = `# ${document.title || 'Untitled Document'}\n\n`;
    
    const processItem = (item, level = 1) => {
      const heading = '#'.repeat(Math.min(level, 6));
      markdown += `${heading} ${item.title}\n\n`;
      
      if (item.content) {
        markdown += `${item.content}\n\n`;
      }
      
      if (item.tags) {
        markdown += `Tags: ${item.tags}\n\n`;
      }
      
      if (item.items && item.items.length > 0) {
        item.items.forEach(subItem => {
          processItem(subItem, level + 1);
        });
      }
    };
    
    if (document.items && document.items.length > 0) {
      document.items.forEach(item => {
        processItem(item);
      });
    }
    
    window.StruMLApp.Utils.downloadFile(markdown, `${document.title || 'document'}.md`, 'text/markdown');
  } catch (error) {
    window.StruMLApp.Utils.logError('exportAsMarkdown', error, true);
  }
};

/**
 * Export document as HTML
 * @param {Object} document - The document to export
 */
window.StruMLApp.Utils.exportAsHtml = (document) => {
  try {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.title || 'Untitled Document'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin-bottom: 1em; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #e5e7eb; margin-right: 5px; font-size: 0.8em; }
  </style>
</head>
<body>
  <h1>${document.title || 'Untitled Document'}</h1>
`;
    
    const processItem = (item, level = 2) => {
      const headingLevel = Math.min(level, 6);
      html += `<h${headingLevel}>${item.title}</h${headingLevel}>`;
      
      if (item.content) {
        html += `<div>${window.StruMLApp.Utils.renderMarkdown(item.content)}</div>`;
      }
      
      if (item.tags) {
        html += `<div class="tags">`;
        window.StruMLApp.Utils.parseTags(item.tags).forEach(tag => {
          html += `<span class="tag">${tag.full}</span>`;
        });
        html += `</div>`;
      }
      
      if (item.items && item.items.length > 0) {
        item.items.forEach(subItem => {
          processItem(subItem, level + 1);
        });
      }
    };
    
    if (document.items && document.items.length > 0) {
      document.items.forEach(item => {
        processItem(item);
      });
    }
    
    html += `</body></html>`;
    
    window.StruMLApp.Utils.downloadFile(html, `${document.title || 'document'}.html`, 'text/html');
  } catch (error) {
    window.StruMLApp.Utils.logError('exportAsHtml', error, true);
  }
};

/**
 * Export document as CSV
 * @param {Object} document - The document to export
 */
window.StruMLApp.Utils.exportAsCsv = (document) => {
  try {
    let csv = 'ID,Title,Parent ID,Content,Tags\n';
    
    const processItem = (item, parentId = '') => {
      // Escape content and tags for CSV
      const escapeCsv = (text) => {
        if (!text) return '';
        return `"${text.replace(/"/g, '""')}"`;
      };
      
      csv += `${item.id},${escapeCsv(item.title)},${parentId},${escapeCsv(item.content)},${escapeCsv(item.tags)}\n`;
      
      if (item.items && item.items.length > 0) {
        item.items.forEach(subItem => {
          processItem(subItem, item.id);
        });
      }
    };
    
    if (document.items && document.items.length > 0) {
      document.items.forEach(item => {
        processItem(item);
      });
    }
    
    window.StruMLApp.Utils.downloadFile(csv, `${document.title || 'document'}.csv`, 'text/csv');
  } catch (error) {
    window.StruMLApp.Utils.logError('exportAsCsv', error, true);
  }
};

// ====================================
// METAMODEL OPERATIONS
// ====================================

/**
 * Get item information from metamodel.struml.json
 * @param {string} itemTitle - Title of the item
 * @returns {string|null} Markdown content or null
 */
window.StruMLApp.Utils.getItemInfo = async function(itemTitle) {
  try {
    // Load the metamodel.struml.json file
    const response = await fetch(`./metamodels/${window.StruMLConfig.METAMODEL}/metamodel.struml.json`);
    if (!response.ok) {
      throw new Error('Could not load metamodel.struml.json file');
    }
    
    const metamodel = await response.json();
    
    // Recursive function to find item by title
    const findItemByTitle = (items, title) => {
      if (!items || !Array.isArray(items)) return null;
      
      for (const item of items) {
        if (item.title === title) {
          return item;
        }
        
        if (item.items && item.items.length > 0) {
          const found = findItemByTitle(item.items, title);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    // Find the item in the metamodel
    const foundItem = findItemByTitle(metamodel.items, itemTitle);
    
    if (!foundItem) {
      return null;
    }
    
    // Concatenate summary and description in Markdown format
    let markdownContent = '';
    
    if (foundItem.summary) {
      markdownContent += `## Summary\n\n${foundItem.summary}\n\n`;
    }
    
    if (foundItem.description) {
      markdownContent += `## Description\n\n${foundItem.description}`;
    }
    
    return markdownContent;
  } catch (error) {
    window.StruMLApp.Utils.logError('getItemInfo', error);
    return null;
  }
};

// ====================================
// JSON PROCESSING
// ====================================

/**
 * Extract and process JSON data from a webhook response
 * @param {Object|string} responseData - The response data from the webhook
 * @returns {Object} An object containing the processed message and extracted JSON data
 */
window.StruMLApp.Utils.processWebhookResponse = (responseData) => {
  try {
    // Initialize result object
    const result = {
      responseMessage: "",
      jsonData: null
    };
    
    // Extract the message from the response
    if (responseData) {
      if (responseData.json && responseData.json.message) {
        result.responseMessage = responseData.json.message;
      } else if (responseData.message) {
        result.responseMessage = responseData.message;
      } else if (responseData.text) {
        result.responseMessage = responseData.text;
      } else if (typeof responseData === 'string') {
        result.responseMessage = responseData;
      } else if (Array.isArray(responseData) && responseData[0] && responseData[0].message) {
        result.responseMessage = responseData[0].message;
      } else if (Array.isArray(responseData) && responseData[0] && responseData[0].json && responseData[0].json.message) {
        result.responseMessage = responseData[0].json.message;
      } else {
        result.responseMessage = "Received response from AI but couldn't parse the message properly.";
      }
      
      // Check if the response contains JSON data within markdown code blocks
      const jsonMatch = result.responseMessage.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          // Extract and parse the JSON
          result.jsonData = JSON.parse(jsonMatch[1].trim());
          
          // Create a formatted message without the JSON code block
          const textBeforeJson = result.responseMessage.substring(0, jsonMatch.index).trim();
          const textAfterJson = result.responseMessage.substring(jsonMatch.index + jsonMatch[0].length).trim();
          
          // Keep any text that was before or after the JSON block
          result.responseMessage = [
            textBeforeJson,
            "📋 AI-generated suggestion (see action buttons below)",
            textAfterJson
          ].filter(part => part).join("\n\n");
        } catch (err) {
          window.StruMLApp.Utils.logError('processWebhookResponse', err);
          // Keep the original message if parsing fails
        }
      }
    } else {
      result.responseMessage = "Received empty response from AI.";
    }
    
    return result;
  } catch (error) {
    window.StruMLApp.Utils.logError('processWebhookResponse', error);
    return {
      responseMessage: `Error processing response: ${error.message}`,
      jsonData: null
    };
  }
};

// ====================================
// TEMPLATE HANDLING
// ====================================

/**
 * Compile a Handlebars template with the given data
 * @param {string} templateString - The template string
 * @param {Object} data - The data to use
 * @returns {string} The compiled template
 */
window.StruMLApp.Utils.compileTemplate = (templateString, data) => {
  try {
    const template = Handlebars.compile(templateString);
    return template(data);
  } catch (error) {
    window.StruMLApp.Utils.logError('compileTemplate', error);
    return `Error compiling template: ${error.message}`;
  }
};

/**
 * Load the prompt template from file
 * @param {string} requestType - Type of request
 * @returns {Promise<string>} The template
 */
window.StruMLApp.Utils.loadPromptTemplate = async function(requestType) {
  try {
    // First, load the generic template
    const genericResponse = await fetch(`./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_generic_template.txt`);
    if (!genericResponse.ok) {
      throw new Error('Could not load generic prompt template file');
    }
    const genericTemplate = await genericResponse.text();
    
    // Determine which specific template to load
    let specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template.txt`; // Default template
    
    // Select the template based on the request type
    switch(requestType) {
      case 'create complete item':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_create_item.txt`;
        break;
      case 'suggest tags':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_suggest_tags.txt`;
        break;
      case 'suggest child items':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_suggest_children.txt`;
        break;
      case 'improve content':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_improve_content.txt`;
        break;
      default:
        // Use the default template for custom requests
        break;
    }
    
    // Load the specific template
    const specificResponse = await fetch(specificTemplatePath);
    if (!specificResponse.ok) {
      console.warn(`Could not load template ${specificTemplatePath}, falling back to default`);
      // If the specific template is not found, try to load the default template
      const defaultResponse = await fetch(`./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template.txt`);
      if (!defaultResponse.ok) {
        throw new Error('Could not load prompt template file');
      }
      return genericTemplate + "\n\n" + await defaultResponse.text();
    }
    
    // Combine the generic template with the specific template
    const specificTemplate = await specificResponse.text();
    return genericTemplate + "\n\n" + specificTemplate;
  } catch (error) {
    window.StruMLApp.Utils.logError('loadPromptTemplate', error);
    // Fallback template in case of error
    return 'Your task is to generate content for the item titled "{{itemTitle}}".';
  }
};

/**
 * Load the prompt template from file (using Handlebars templates)
 * @param {string} requestType - Type of request
 * @returns {Promise<{template: string, isHandlebars: boolean}>} The template and whether it's a Handlebars template
 */
window.StruMLApp.Utils.loadHandlebarsPromptTemplate = async function(requestType) {
  try {
    // Load the Handlebars version of the generic template
    let genericTemplate = "";
    
    try {
      const genericResponse = await fetch(`./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_generic_template_handlebars.txt`);
      if (!genericResponse.ok) {
        throw new Error('Could not load generic prompt template file');
      }
      genericTemplate = await genericResponse.text();
      console.log("Using Handlebars template");
    } catch (error) {
      window.StruMLApp.Utils.logError('loadHandlebarsPromptTemplate', error);
      throw error;
    }
    
    // Determine which specific template to load
    let specificTemplatePath = ""; // No default template
    
    // Select the template based on the request type
    switch(requestType) {
      case 'create complete item':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_create_item_handlebars.txt`;
        break;
      case 'suggest tags':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_suggest_tags_handlebars.txt`;
        break;
      case 'suggest child items':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_suggest_children_handlebars.txt`;
        break;
      case 'improve content':
        specificTemplatePath = `./metamodels/${window.StruMLConfig.METAMODEL}/prompts/prompt_template_improve_content_handlebars.txt`;
        break;
      default:
        // For custom requests, just use the generic template
        return { 
          template: genericTemplate,
          isHandlebars: true
        };
    }
    
    // Load the specific template
    const specificResponse = await fetch(specificTemplatePath);
    if (!specificResponse.ok) {
      console.warn(`Could not load template ${specificTemplatePath}`);
      // If the specific template is not found, just use the generic template
      return { 
        template: genericTemplate,
        isHandlebars: true
      };
    }
    
    // Combine the generic template with the specific template
    const specificTemplate = await specificResponse.text();
    return { 
      template: genericTemplate + "\n\n" + specificTemplate,
      isHandlebars: true
    };
  } catch (error) {
    window.StruMLApp.Utils.logError('loadHandlebarsPromptTemplate', error, true);
    // Fallback template in case of error
    return { 
      template: 'Your task is to generate content for the item titled "{{itemTitle}}".',
      isHandlebars: true
    };
  }
};

/**
 * Generate LLM prompts based on item context
 * @param {Object} inputData - Input data for the prompt
 * @returns {Promise<string>} The generated prompt
 */
window.StruMLApp.Utils.generateItemPrompt = async function(inputData) {
  try {
    // Load the template based on the request type
    const { template: promptTemplate, isHandlebars } = await window.StruMLApp.Utils.loadHandlebarsPromptTemplate(inputData.requestType);
    
    // Get the item class from the current item or its ancestors
    const itemClass = window.StruMLApp.Utils.getItemClass(
      inputData.context.currentItem, 
      inputData.context.documentStructure.items
    );
    
    // Filter the document structure to exclude specific items
    const filteredDocument = window.StruMLApp.Utils.filterDocumentStructure(inputData.context.documentStructure);
    
    // Prepare the context as string
    const contextString = JSON.stringify({
      currentItem: inputData.context.currentItem,
      userMessage: inputData.context.userMessage || "",
      // Include the filtered document structure
      documentStructure: filteredDocument
    }, null, 2);
    
    // Prepare the sample item string
    let sampleItemString = "No sample item example provided in context.";
    
    // Process the sampleItem if available
    if (inputData.sampleItem && typeof inputData.sampleItem === 'object' && Object.keys(inputData.sampleItem).length > 0) {
      try {
        sampleItemString = JSON.stringify(inputData.sampleItem, null, 2);
      } catch (e) {
        window.StruMLApp.Utils.logError('generateItemPrompt', e);
        sampleItemString = "Error processing sample item example.";
      }
    }
    
    // Create template data object
    const templateData = {
      itemTitle: inputData.itemTitle,
      itemClass: itemClass,
      itemInfo: inputData.markdownDescription || "No description available",
      context: contextString,
      sampleItem: sampleItemString
    };
    
    let processedTemplate;
    
    if (isHandlebars) {
      // Use Handlebars to compile the template with the data
      // Register block helpers for the special sections
      Handlebars.registerHelper('item_info_block', function(options) {
        return options.fn(this);
      });
      
      Handlebars.registerHelper('context_block', function(options) {
        return options.fn(this);
      });
      
      Handlebars.registerHelper('sample_item_block', function(options) {
        return options.fn(this);
      });
      
      // Compile the template with Handlebars
      const template = Handlebars.compile(promptTemplate);
      processedTemplate = template(templateData);
    } else {
      // For backward compatibility, handle the old-style replacements
      processedTemplate = promptTemplate
        .replace(/{{ITEM_TITLE}}/g, templateData.itemTitle)
        .replace(/{{ITEM_CLASS}}/g, templateData.itemClass)
        .replace(/<ITEM_INFO>[\s\S]*?<\/ITEM_INFO>/g, `<ITEM_INFO>\n${templateData.itemInfo}\n</ITEM_INFO>`)
        .replace(/<CONTEXT>[\s\S]*?<\/CONTEXT>/g, `<CONTEXT>\n${templateData.context}\n</CONTEXT>`)
        .replace(/<SAMPLE_ITEM>[\s\S]*?<\/SAMPLE_ITEM>/g, `<SAMPLE_ITEM>\n${templateData.sampleItem}\n</SAMPLE_ITEM>`);
    }
    
    return processedTemplate;
  } catch (error) {
    window.StruMLApp.Utils.logError('generateItemPrompt', error, true);
    return `Error generating prompt: ${error.message}`;
  }
};
