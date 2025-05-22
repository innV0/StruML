/**
 * ItemViewMermaid Component
 * Renders Mermaid flowchart diagrams based on the subitems of the current item
 * Processes relation tags (containing ">>") to create connections between nodes
 * Groups diagrams by the parent of the target items
 */

const ItemViewMermaid = ({ item }) => {
  const { state, actions } = useAppContext();
  const { document } = state;
  const { selectItem } = actions;
  const [diagramsData, setDiagramsData] = React.useState([]);
  const [diagramKey, setDiagramKey] = React.useState(Date.now());
  
  // Set up click handler for Mermaid nodes
  React.useEffect(() => {
    // Define a global function to handle clicks on Mermaid nodes
    window.handleMermaidClick = (itemId) => {
      if (itemId) {
        selectItem(itemId);
      }
    };
    
    // Clean up the global function when component unmounts
    return () => {
      delete window.handleMermaidClick;
    };
  }, [selectItem]);
  
  // Helper function to find an item by title in the document
  const findItemByTitle = (title) => {
    return window.StruMLApp.Utils.findItemByTitle(document.items, title);
  };
  
  // Helper function to find the parent of an item
  const findParent = (items, targetTitle, parent = null) => {
    if (!items) return null;
    
    for (const currentItem of items) {
      // Check if this item contains the target as a direct child
      if (currentItem.items && currentItem.items.some(child => child.title === targetTitle)) {
        return currentItem;
      }
      
      // Recursively check children
      if (currentItem.items && currentItem.items.length > 0) {
        const foundParent = findParent(currentItem.items, targetTitle, currentItem);
        if (foundParent) return foundParent;
      }
    }
    
    return null;
  };
  
  // Helper function to find all items in the document that have relations to a specific item
  const findIncomingRelations = (items, targetSubItems) => {
    const incomingRelations = [];
    const targetTitles = targetSubItems.map(item => item.title);
    
    // Define a recursive function to search through all items
    function processItems(itemsToSearch, parentItem = null) {
      if (!itemsToSearch || !Array.isArray(itemsToSearch)) return;
      
      itemsToSearch.forEach(sourceItem => {
        if (sourceItem.tags) {
          // Extract all relation tags
          const relationTags = window.StruMLApp.Utils.parseTags(sourceItem.tags)
            .filter(tag => tag.full && tag.full.includes('>>'));
          
          relationTags.forEach(relationTag => {
            // Split the relation tag to get the relation name and target
            const parts = relationTag.full.split('>>');
            if (parts.length !== 2) return;
            
            const relationName = parts[0].trim();
            const targetTitle = parts[1].trim();
            
            // Check if this relation points to one of our subitems
            if (targetTitles.includes(targetTitle)) {
              // Find the target subitem
              const targetSubItem = targetSubItems.find(subItem => subItem.title === targetTitle);
              
              if (targetSubItem && sourceItem.title !== targetSubItem.title) { // Avoid self-references
                incomingRelations.push({
                  sourceItem: sourceItem,
                  targetItem: targetSubItem,
                  relationName: relationName,
                  parentItem: parentItem
                });
              }
            }
          });
        }
        
        // Recursively search child items
        if (sourceItem.items && sourceItem.items.length > 0) {
          processItems(sourceItem.items, sourceItem);
        }
      });
    }
    
    // Start the search from the top level
    processItems(items);
    
    return incomingRelations;
  };
  
  // Generate Mermaid diagrams based on item's subitems and their relations
  React.useEffect(() => {
    if (!item || !item.items || item.items.length === 0) {
      setDiagramsData([]);
      return;
    }
    
    // Extract all relations from subitems
    const relationsByParent = {};
    
    // Process each subitem to extract outgoing relations
    item.items.forEach((subItem) => {
      if (!subItem.tags) return;
      
      // Extract all relation tags (those containing ">>")
      const relationTags = window.StruMLApp.Utils.parseTags(subItem.tags)
        .filter(tag => tag.full && tag.full.includes('>>'));
      
      relationTags.forEach(relationTag => {
        // Split the relation tag to get the relation name and target
        const parts = relationTag.full.split('>>');
        if (parts.length !== 2) return;
        
        const relationName = parts[0].trim();
        const targetTitle = parts[1].trim();
        
        // Find the target item and its parent
        const targetItem = findItemByTitle(targetTitle);
        if (!targetItem) return;
        
        const parentItem = findParent(document.items, targetTitle);
        if (!parentItem) return;
        
        // Group relations by parent
        const parentId = parentItem.id;
        if (!relationsByParent[parentId]) {
          relationsByParent[parentId] = {
            parent: parentItem,
            relations: []
          };
        }
        
        // Add this relation to the parent's group
        relationsByParent[parentId].relations.push({
          sourceItem: subItem,
          targetItem: targetItem,
          relationName: relationName,
          isOutgoing: true
        });
      });
    });
    
    // Find incoming relations (where subitems are targets)
    const incomingRelations = findIncomingRelations(document.items, item.items);
    
    // Process incoming relations and add them to the appropriate parent groups
    incomingRelations.forEach(relation => {
      const parentItem = relation.parentItem || findParent(document.items, relation.sourceItem.title);
      if (!parentItem) return;
      
      // Group by parent
      const parentId = parentItem.id;
      if (!relationsByParent[parentId]) {
        relationsByParent[parentId] = {
          parent: parentItem,
          relations: []
        };
      }
      
      // Add this incoming relation to the parent's group
      relationsByParent[parentId].relations.push({
        sourceItem: relation.sourceItem,
        targetItem: relation.targetItem,
        relationName: relation.relationName,
        isIncoming: true
      });
    });
    
    // Generate a diagram for each parent
    const diagrams = Object.values(relationsByParent).map((group, groupIndex) => {
      const { parent, relations } = group;
      
      // Start with flowchart definition (LR = left to right)
      let code = 'flowchart LR\n';
      
      // Map to track node IDs for items
      const nodeIds = {};
      let nodeCounter = 0;
      
      // Helper to get or create a node ID for an item
      const getNodeId = (itemTitle) => {
        if (!nodeIds[itemTitle]) {
          nodeIds[itemTitle] = `node${nodeCounter++}`;
        }
        return nodeIds[itemTitle];
      };
      
      // Create a set of unique items involved in this diagram
      const uniqueItems = new Set();
      relations.forEach(relation => {
        uniqueItems.add(relation.sourceItem);
        uniqueItems.add(relation.targetItem);
      });
      
      // Create nodes for all unique items
      uniqueItems.forEach(uniqueItem => {
        const nodeId = getNodeId(uniqueItem.title);
        code += `  ${nodeId}(["${uniqueItem.title}"])\n`;
        code += `  click ${nodeId} "javascript:window.handleMermaidClick('${uniqueItem.id}')" "Navigate to ${uniqueItem.title}"\n`;
      });
      
      // Create edges for all relations
      relations.forEach(relation => {
        const sourceNodeId = getNodeId(relation.sourceItem.title);
        const targetNodeId = getNodeId(relation.targetItem.title);
        
        if (relation.isIncoming) {
          // For incoming relations, invert the direction (target -> source)
          code += `  ${targetNodeId} -- ${relation.relationName} --> ${sourceNodeId}\n`;
        } else {
          // For outgoing relations, keep the original direction (source -> target)
          code += `  ${sourceNodeId} -- ${relation.relationName} --> ${targetNodeId}\n`;
        }
      });
      
      return {
        parent: parent,
        code: code,
        key: `diagram-${groupIndex}-${diagramKey}`
      };
    });
    
    setDiagramsData(diagrams);
  }, [item, document.items]);
  
  // Initialize Mermaid when the component mounts
  React.useEffect(() => {
    if (window.mermaid) {
      // Configure Mermaid
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          useMaxWidth: false
        }
      });
    }
  }, []);
  
  // Re-process Mermaid diagrams when diagrams data changes
  React.useEffect(() => {
    if (diagramsData.length > 0 && window.mermaid) {
      // Use a short timeout to ensure the DOM is ready
      setTimeout(() => {
        try {
          // Process all Mermaid diagrams in the document
          window.mermaid.init(undefined, window.document.querySelectorAll('.mermaid:not(.mermaid-processed)'));
          
          // Mark processed diagrams to avoid re-processing
          window.document.querySelectorAll('.mermaid:not(.mermaid-processed)').forEach(el => {
            el.classList.add('mermaid-processed');
          });
        } catch (error) {
          console.error('Error processing Mermaid diagrams:', error);
        }
      }, 100);
    }
  }, [diagramsData]);
  
  // Don't render anything if there are no diagrams
  if (diagramsData.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      {diagramsData.map((diagram, index) => (
        <div key={diagram.key} className="p-4 border border-gray-200 rounded-lg bg-white mb-4">
          <h3 className="text-lg font-medium mb-2">Flowchart Diagram: {diagram.parent.title}</h3>
          <div className="mermaid">
            {diagram.code}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export the component
window.StruMLApp = window.StruMLApp || {};
window.StruMLApp.Components = window.StruMLApp.Components || {};
window.StruMLApp.Components.ItemViewMermaid = ItemViewMermaid;
