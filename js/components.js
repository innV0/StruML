/**
 * StruML React Components
 */

// Header component
const Header = () => {
  const { state, actions } = useAppContext();
  const { document } = state;
  const { updateDocumentTitle, createNewDocument, importDocument, toggleSidebar } = actions;
  
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(document.title);
  
  React.useEffect(() => {
    setTitleValue(document.title);
  }, [document.title]);
  
  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
  };
  
  const handleTitleSubmit = () => {
    updateDocumentTitle(titleValue);
    setIsEditingTitle(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitleValue(document.title);
      setIsEditingTitle(false);
    }
  };
  
  const handleImportClick = () => {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.struml.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedDocument = JSON.parse(event.target.result);
          importDocument(importedDocument);
        } catch (error) {
          alert('Error importing document: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  const handleExportClick = (format) => {
    switch (format) {
      case 'json':
        window.StruMLApp.Utils.exportAsJson(document);
        break;
      case 'markdown':
        window.StruMLApp.Utils.exportAsMarkdown(document);
        break;
      case 'html':
        window.StruMLApp.Utils.exportAsHtml(document);
        break;
      case 'csv':
        window.StruMLApp.Utils.exportAsCsv(document);
        break;
      default:
        break;
    }
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
          title="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        {isEditingTitle ? (
          <input
            type="text"
            value={titleValue}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
            className="border border-gray-300 rounded-md px-2 py-1 text-lg font-medium"
          />
        ) : (
          <div className="flex items-center">
            <h1 
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-medium cursor-pointer hover:text-primary-600"
              title="Click to edit document title"
            >
              <img src="logo.svg" alt="Logo" className="w-12 h-12 inline mr-2" />
              <span className="text-red-500 font-bold mr-1" title="This is an experimental version of the application">experimental</span>
              <span className="inline mr-1" title="This is an experimental version of the application">🧪</span>
              {document.title}
            </h1>
            {window.StruMLConfig.METAMODEL && (
              <span className="ml-2 text-sm text-gray-500">
                {window.StruMLConfig.METAMODEL}
                {window.StruMLConfig.METAMODEL_VERSION && ` V${window.StruMLConfig.METAMODEL_VERSION}`}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative dropdown">
          <button 
            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
            onClick={(e) => {
              const dropdown = e.currentTarget.nextElementSibling;
              if (!dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
              } else {
                dropdown.classList.remove('hidden');
                const closeDropdown = () => {
                  dropdown.classList.add('hidden');
                  document.removeEventListener('click', closeDropdown);
                };
                document.addEventListener('click', closeDropdown);
              }
              e.stopPropagation();
            }}
          >
            File
          </button>
          <div 
            className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 hidden z-10"
            onMouseLeave={(e) => {
              e.currentTarget.classList.add('hidden');
            }}
          >
            <ul className="py-1">
              <li>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    createNewDocument();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  New Document
                </button>
              </li>
              <li>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImportClick();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Import Document
                </button>
              </li>
              <li className="border-t border-gray-200 mt-1 pt-1">
                <div className="px-4 py-1 text-xs text-gray-500">Export As</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportClick('json');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  JSON
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportClick('markdown');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Markdown
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportClick('html');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  HTML
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportClick('csv');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  CSV
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="relative dropdown">
          <button 
            className="px-3 py-1 rounded-md border border-gray-300 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => window.open("https://struml-view.vercel.app/", "_blank")}
          >
            Viewer
          </button>
        </div>
      </div>
    </header>
  );
};
window.Header = Header;
  
// Tag component
const Tag = ({ tag }) => {
  const { state, actions } = useAppContext();
  const { document } = state;
  const { selectItem } = actions;
  
  let tagClass = 'tag tag-default';
  
  if (tag.type === 'relation') {
    tagClass = 'tag tag-relation';
  } else if (tag.type !== 'default') {
    tagClass = `tag tag-${tag.type}`;
  }
  
  // For relation tags, add a link icon and popover
  if (tag.type === 'relation') {
    // Find the target item
    const targetItem = window.StruMLApp.Utils.findItemByTitle(document.items, tag.target);
    
    // State for popover visibility
    const [showPopover, setShowPopover] = React.useState(false);
    const popoverRef = React.useRef(null);
    const buttonRef = React.useRef(null);
    
    // Handle click outside to close popover
    React.useEffect(() => {
      if (!showPopover) return;
      function handleClickOutside(event) {
        if (popoverRef.current && !popoverRef.current.contains(event.target) && 
            buttonRef.current && !buttonRef.current.contains(event.target)) {
          setShowPopover(false);
        }
      }
      window.addEventListener('click', handleClickOutside, true);
      return () => {
        window.removeEventListener('click', handleClickOutside, true);
      };
    }, [showPopover]);
    
    const handleNavigate = () => {
      if (targetItem) {
        setShowPopover(false);
        selectItem(targetItem.id);
      }
    };
    
    const togglePopover = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPopover(!showPopover);
    };
    
    return (
      <span className={tagClass} title={tag.full}>
        {tag.full}
        {targetItem && (
          <span className="relative inline-block">
            <button 
              ref={buttonRef}
              onClick={togglePopover}
              className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showPopover && (
              <div 
                ref={popoverRef}
                className="fixed z-50 w-64 bg-white rounded-md shadow-lg border border-gray-200"
                style={{ 
                  top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 0,
                  left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left + window.scrollX - 32 : 0
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
                  <h3 className="text-sm font-medium">{targetItem.title}</h3>
                  <button 
                    onClick={handleNavigate}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    title="Navigate to item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </button>
                </div>
                <div className="p-2">
                  <div className="item-card-preview border border-gray-200 rounded-md p-2">
                    {targetItem.tags && (
                      <div className="mb-1 text-xs">
                        {targetItem.tags}
                      </div>
                    )}
                    {targetItem.content && (
                      <div 
                        className="text-xs text-gray-600 mt-1 prose prose-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: window.StruMLApp.Utils.renderMarkdown(
                            targetItem.content.length > 100 
                              ? targetItem.content.substring(0, 100) + "..." 
                              : targetItem.content
                          )
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </span>
        )}
      </span>
    );
  }
  
  return (
    <span className={tagClass} title={tag.full}>
      {tag.full}
    </span>
  );
};

// Tags list component
const TagsList = ({ tagsString }) => {
  const tags = window.StruMLApp.Utils.parseTags(tagsString);
  
  if (!tags.length) return null;
  
  return (
    <div className="flex flex-wrap mt-1">
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </div>
  );
};

// Tree item component with drag and drop functionality
const TreeItem = ({ item, level = 0, filteredItems }) => {
  const { state, actions } = useAppContext();
  const { selectedItemId, document } = state;
  const { selectItem, reorderItems } = actions;
  
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dropPosition, setDropPosition] = React.useState(null);
  
  const itemId = String(item.id);
  
  const hasChildren = item.items && item.items.length > 0;
  const isSelected = selectedItemId === item.id;
  
  const isVisible = (currentItem) => {
    if (!filteredItems) return true;
    if (filteredItems.includes(currentItem.id)) return true;
    
    if (currentItem.items && currentItem.items.length > 0) {
      return currentItem.items.some(isVisible);
    }
    
    return false;
  };
  
  const visibleChildren = hasChildren && filteredItems
    ? item.items.filter(isVisible)
    : item.items;
  
  const hasVisibleChildren = visibleChildren && visibleChildren.length > 0;
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const handleSelect = () => {
    selectItem(item.id);
  };
  
  const isHighlighted = filteredItems && filteredItems.includes(item.id);
  
  const watchdogTimerRef = React.useRef(null);
  
  const resetDragDropStates = () => {
    setIsDragging(false);
    setDropPosition(null);
    console.log('Drag-drop states reset for item:', item.title);
  };
  
  const dragElementRef = React.useRef(null);
  
  React.useEffect(() => {
    return () => {
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
      }
    };
  }, []);
  
  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', String(item.id));
    e.dataTransfer.effectAllowed = 'move';
    
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    
    if (e.target && e.target.closest('.tree-item')) {
      dragElementRef.current = e.target.closest('.tree-item').cloneNode(true);
      
      if (dragElementRef.current) {
        dragElementRef.current.style.position = 'absolute';
        dragElementRef.current.style.zIndex = '9999';
        dragElementRef.current.style.opacity = '0.8';
        dragElementRef.current.style.pointerEvents = 'none';
        dragElementRef.current.style.width = e.target.closest('.tree-item').offsetWidth + "px";
        dragElementRef.current.style.transform = 'translateY(-50%)';
        dragElementRef.current.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        
        document.body.appendChild(dragElementRef.current);
        
        const updateOverlayPosition = (moveEvent) => {
          if (dragElementRef.current) {
            dragElementRef.current.style.left = moveEvent.clientX + 10 + "px";
            dragElementRef.current.style.top = moveEvent.clientY + "px";
          }
        };
        
        document.addEventListener('dragover', updateOverlayPosition);
        
        const removeOverlay = () => {
          if (dragElementRef.current && dragElementRef.current.parentNode) {
            dragElementRef.current.parentNode.removeChild(dragElementRef.current);
            dragElementRef.current = null;
          }
          document.removeEventListener('dragover', updateOverlayPosition);
          document.removeEventListener('dragend', removeOverlay);
          document.removeEventListener('drop', removeOverlay);
        };
        
        document.addEventListener('dragend', removeOverlay);
        document.addEventListener('drop', removeOverlay);
      }
    }
    
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
    
    console.log('Drag started for item:', item.title);
    
    watchdogTimerRef.current = setTimeout(() => {
      console.log('Watchdog: Forcing drag-drop state reset');
      resetDragDropStates();
    }, 3000);
  };
  
  const handleDragEnd = (e) => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    
    setTimeout(() => {
      resetDragDropStates();
    }, 100);
    
    console.log('Drag ended for item:', item.title);
  };
  
  const [stableDropPosition, setStableDropPosition] = React.useState(null);
  const debounceTimerRef = React.useRef(null);
  const lockTimerRef = React.useRef(null);
  const [positionLocked, setPositionLocked] = React.useState(false);
  
  const updateDropPositionWithDebounce = (position) => {
    if (positionLocked) return;
    if (position === 'inside') {
      setPositionLocked(true);
      setDropPosition('inside');
      setStableDropPosition('inside');
      
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
      lockTimerRef.current = setTimeout(() => {
        setPositionLocked(false);
      }, 1000);
      
      return;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDropPosition(position);
      setStableDropPosition(position);
    }, 100);
  };
  
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const relativeY = mouseY - rect.top;
    
    const insideThreshold = 0.6;
    
    if (stableDropPosition === 'inside' && 
        relativeY > rect.height * 0.2 && 
        relativeY < rect.height * 0.8) {
      updateDropPositionWithDebounce('inside');
    } else if (relativeY < rect.height * ((1 - insideThreshold) / 2)) {
      updateDropPositionWithDebounce('before');
    } else if (relativeY > rect.height * (1 - (1 - insideThreshold) / 2)) {
      updateDropPositionWithDebounce('after');
    } else {
      updateDropPositionWithDebounce('inside');
    }
    
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragLeave = (e) => {
    if (!positionLocked) {
      const relatedTarget = e.relatedTarget;
      if (!e.currentTarget.contains(relatedTarget)) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          setDropPosition(null);
          setStableDropPosition(null);
        }, 100);
      }
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    
    setPositionLocked(false);
    
    const finalDropPosition = stableDropPosition || dropPosition;
    
    console.log('Drop detected for item:', item.title, 'at position:', finalDropPosition);
    
    let jsonData = null;
    try {
      const jsonString = e.dataTransfer.getData('application/json');
      if (jsonString) {
        jsonData = JSON.parse(jsonString);
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
    
    if (jsonData) {
      let targetParentId = null;
      
      if (finalDropPosition === 'inside') {
        targetParentId = item.id;
      } else {
        const parentInfo = window.StruMLApp.DndUtils.findParentItem(document.items, item.id);
        if (parentInfo) {
          targetParentId = parentInfo.parent ? parentInfo.parent.id : null;
        } else {
          targetParentId = null;
        }
      }
      
      const newItem = {
        id: window.StruMLApp.Utils.generateId(),
        title: jsonData.title || "New Item",
        content: jsonData.content || "",
        tags: jsonData.tags || "",
        items: []
      };
      
      if (jsonData.items && Array.isArray(jsonData.items)) {
        newItem.items = jsonData.items.map(childItem => ({
          id: window.StruMLApp.Utils.generateId(),
          title: childItem.title || "Child Item",
          content: childItem.content || "",
          tags: childItem.tags || "",
          items: []
        }));
      }
      
      actions.createItem(targetParentId, newItem);
      window.StruMLApp.Utils.showAlert(`Added "${newItem.title}" to the document`, "success");
      
    } else {
      const draggedItemId = String(e.dataTransfer.getData('text/plain'));
      if (!draggedItemId || draggedItemId === item.id) {
        setDropPosition(null);
        return;
      }
      
      const draggedItem = window.StruMLApp.DndUtils.findItemById(document.items, draggedItemId)?.item;
      if (!draggedItem) {
        setDropPosition(null);
        return;
      }
      
      if (!window.StruMLApp.DndUtils.canDropItem(document.items, draggedItemId, item.id)) {
        setDropPosition(null);
        return;
      }
      
      let targetParentId = null;
      let newIndex = 0;
      
      if (finalDropPosition === 'inside') {
        targetParentId = item.id;
        newIndex = 0;
      } else {
        const parentInfo = window.StruMLApp.DndUtils.findParentItem(document.items, item.id);
        if (parentInfo) {
          targetParentId = parentInfo.parent ? parentInfo.parent.id : null;
          newIndex = finalDropPosition === 'before' ? parentInfo.index : parentInfo.index + 1;
        } else {
          targetParentId = null;
          const topLevelIndex = document.items.findIndex(i => i.id === item.id);
          newIndex = finalDropPosition === 'before' ? topLevelIndex : topLevelIndex + 1;
        }
      }
      
      window.StruMLApp.DndUtils.confirmItemMove(
        draggedItem,
        targetParentId ? window.StruMLApp.DndUtils.findItemById(document.items, targetParentId)?.item : null,
        () => {
          reorderItems(draggedItemId, targetParentId, newIndex);
          window.StruMLApp.Utils.showAlert(`Item "${draggedItem.title}" moved successfully.`, "success");
        },
        () => {
          window.StruMLApp.Utils.showAlert("Move cancelled.", "info");
        }
      );
    }
    
    setDropPosition(null);
  };
  
  return (
    <div>
      <div 
        className={'tree-item flex items-center px-2 py-1 cursor-pointer ' +
          (isSelected ? 'selected ' : '') +
          (isHighlighted ? 'bg-blue-50 ' : '') +
          (isDragging ? 'is-dragging ' : '') +
          (dropPosition ? ('drop-' + dropPosition) : '')
        }
        style={{ paddingLeft: (level * 16 + 8) + "px" }}
        onClick={handleSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-item-id={item.id}
      >
        {dropPosition && (
          <div className={'drop-indicator ' + dropPosition + ' ' + (dropPosition === 'inside' ? 'active' : '')}></div>
        )}
        
        <div 
          className="drag-handle mr-1"
          draggable="true"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          title="Drag from here"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grip-vertical" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </div>
        
        {hasVisibleChildren && (
          <button 
            onClick={toggleExpand}
            className="mr-1 p-1 rounded-md hover:bg-gray-200 doc-nav-toggle"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
className={'h-3 w-3 transform ' + (isExpanded ? 'rotate-90' : '')}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {!hasVisibleChildren && <div className="w-5"></div>}
        <span className="truncate">{item.title}</span>
        {item.items && item.items.length > 0 && (
          <span className="ml-1 text-xs text-gray-500">
            ({item.items.length})
          </span>
        )}
      </div>
      
      {hasVisibleChildren && isExpanded && (
        <div>
          {visibleChildren.map(childItem => (
            <TreeItem 
              key={childItem.id} 
              item={childItem} 
              level={level + 1}
              filteredItems={filteredItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar component
const Sidebar = () => {
  const { state, actions } = useAppContext();
  const { document, filteredItems, showTagFilter } = state;
  const { createItem, toggleTagFilter } = actions;
  
  const [allExpanded, setAllExpanded] = React.useState(true);
  
  const isItemVisible = (item) => {
    if (!filteredItems) return true;
    const isVisible = (currentItem) => {
      if (filteredItems.includes(currentItem.id)) return true;
      if (currentItem.items && currentItem.items.length > 0) {
        return currentItem.items.some(isVisible);
      }
      return false;
    };
    return isVisible(item);
  };
  
  const visibleItems = filteredItems 
    ? document.items.filter(isItemVisible)
    : document.items;
  
  const sidebarRef = React.useRef(null);
  
  const handleExpandCollapseAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    if (sidebarRef.current) {
      const toggleButtons = sidebarRef.current.querySelectorAll('.doc-nav-toggle');
      toggleButtons.forEach((btn) => {
        const icon = btn.querySelector('svg');
        const isExpanded = icon && icon.classList.contains('rotate-90');
        
        if (newExpandedState && !isExpanded) {
          btn.click();
        } else if (!newExpandedState && isExpanded) {
          btn.click();
        }
      });
    }
  };
  
  return (
    <div ref={sidebarRef} className="w-96 border-r border-gray-200 bg-white h-full overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Document Structure</h2>
          <div className="flex items-center">
            <button 
              onClick={toggleTagFilter}
              className={`p-1 rounded-md hover:bg-gray-100 mr-1 ${showTagFilter ? 'text-blue-600' : ''}`}
              title="Toggle tag filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => createItem()}
              className="p-1 rounded-md hover:bg-gray-100"
              title="Add top-level item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <button 
          onClick={handleExpandCollapseAll}
          className="w-full py-1 px-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
          title={allExpanded ? "Collapse all items" : "Expand all items"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            {allExpanded ? (
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            )}
          </svg>
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>
      
      {showTagFilter && <TagFilter />}
      
      <div className="py-2 flex-1 overflow-y-auto">
        {visibleItems.map(item => (
          <TreeItem 
            key={item.id} 
            item={item} 
            filteredItems={filteredItems}
          />
        ))}
        {visibleItems.length === 0 && (
          <div className="px-4 py-3 text-gray-500 text-sm">
            {document.items.length === 0 
              ? "No items in this document. Click the + button to add an item."
              : "No items match the current filter."}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to find the path from root to an item
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

// Breadcrumbs component
const Breadcrumbs = ({ item, document }) => {
  const { actions } = useAppContext();
  const { selectItem } = actions;
  
  const path = findItemPath(document.items, item.id);
  
  if (!path || path.length <= 1) return null;
  
  return (
    <div className="flex items-center text-sm text-gray-500 mb-3 overflow-x-auto">
      {path.map((pathItem, index) => (
        <React.Fragment key={pathItem.id}>
          {index > 0 && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span 
            className={`hover:text-primary-600 cursor-pointer ${index === path.length - 1 ? 'font-medium text-gray-700' : ''}`}
            onClick={() => index < path.length - 1 && selectItem(pathItem.id)}
          >
            {pathItem.title}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

// Item view component
const ItemView = ({ item }) => {
  const { state, actions } = useAppContext();
  const { document, isChatbotOpen } = state;
  const { startEditingItem, deleteItem, createItem, selectItem, toggleChatbot } = actions;
  
  const handleEdit = () => {
    startEditingItem(item.id);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(item.id);
    }
  };
  
  const handleAddChild = () => {
    createItem(item.id);
  };
  
  const handleToggleChatbot = () => {
    toggleChatbot();
  };
  
  return (
    <div className="p-4">
      <Breadcrumbs item={item} document={document} />
      
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{item.title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleEdit}
            className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            title="Edit this item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={handleAddChild}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            title="Add a child item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            title="Delete this item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleToggleChatbot}
            className={`px-3 py-1 ${isChatbotOpen ? 'bg-purple-500 hover:bg-purple-600' : 'bg-purple-400 hover:bg-purple-500'} text-white rounded-md`}
            title={isChatbotOpen ? "Close AI Assistant" : "Open AI Assistant"}
          >
            {isChatbotOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <TagsList tagsString={item.tags} />
      
      {item.content && (
        <div 
          className="markdown-content mt-4 prose"
          dangerouslySetInnerHTML={{ __html: window.StruMLApp.Utils.renderMarkdown(item.content) }}
        ></div>
      )}
      
      <ItemViewMermaid item={item} />
      
      <RelationsView item={item} allItems={document.items} />
      
      {item.items && item.items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Child Items</h3>
          <div className="space-y-4">
            {item.items.map(childItem => (
              <ItemCard 
                key={childItem.id}
                item={childItem}
                onClick={() => selectItem(childItem.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Welcome screen component
const WelcomeScreen = () => {
  const { actions } = useAppContext();
  const { createItem } = actions;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to StruML</h2>
      <p className="text-gray-600 mb-6 max-w-lg">
        StruML helps you create structured documents with hierarchical items, tags, and relations.
        Get started by creating your first item or selecting an existing one from the sidebar.
      </p>
      <button 
        onClick={() => createItem()}
        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        Create First Item
      </button>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-lg">
        <h3 className="font-medium mb-2">Quick Tips:</h3>
        <ul className="text-left text-gray-600 space-y-2">
          <li>• Use the sidebar to navigate through your document structure</li>
          <li>• Add tags to items for better organization and filtering</li>
          <li>• Create relations between items to show connections</li>
          <li>• Use Markdown in the content field for rich formatting</li>
        </ul>
      </div>
    </div>
  );
};

// Item editor component (modified with Add Tag modal)
const ItemEditor = () => {
  const { state, actions } = useAppContext();
  const { editingItem } = state;
  const { updateEditingItem, saveEditingItem, cancelEditingItem } = actions;
  
  // New state for tag modal
  const [showTagModal, setShowTagModal] = React.useState(false);
  const [newTagType, setNewTagType] = React.useState("normal");
  const [newNormalTagOption, setNewNormalTagOption] = React.useState("NEW");
  const [newNormalTagValue, setNewNormalTagValue] = React.useState("");
  const [newKeyOption, setNewKeyOption] = React.useState("NEW");
  const [newKeyText, setNewKeyText] = React.useState("");
  const [newValueText, setNewValueText] = React.useState("");
  const [newRelNameOption, setNewRelNameOption] = React.useState("NEW");
  const [newRelNameValue, setNewRelNameValue] = React.useState("");
  const [newRelTarget, setNewRelTarget] = React.useState("");
  
  if (!editingItem) return null;
  
  // Helper functions to get dropdown options
  const getNormalTagOptions = () => {
    const allTags = window.StruMLApp.Utils.extractAllTags(state.document.items) || [];
    const normalTags = allTags.filter(tag => !tag.includes("::") && !tag.includes(">>"));
    return ["NEW", ...normalTags];
  };
  
  const getKeyOptions = () => {
    const allTags = window.StruMLApp.Utils.extractAllTags(state.document.items) || [];
    const keys = new Set();
    allTags.forEach(tag => {
      if (tag.includes("::")) {
        const parts = tag.split("::");
        keys.add(parts[0]);
      }
    });
    return ["NEW", ...Array.from(keys)];
  };
  
  const getRelationNameOptions = () => {
    const allTags = window.StruMLApp.Utils.extractAllTags(state.document.items) || [];
    const relNames = new Set();
    allTags.forEach(tag => {
      if (tag.includes(">>")) {
        const parts = tag.split(">>");
        relNames.add(parts[0]);
      }
    });
    return ["NEW", ...Array.from(relNames)];
  };
  
  const getAllItems = () => {
    const flattenItems = (items) => {
      let result = [];
      items.forEach(item => {
        result.push(item);
        if (item.items && item.items.length > 0) {
          result = result.concat(flattenItems(item.items));
        }
      });
      return result;
    };
    return flattenItems(state.document.items);
  };
  
  const handleTitleChange = (e) => {
    updateEditingItem({ title: e.target.value });
  };
  
  const handleTagsChange = (e) => {
    const tagsValue = typeof e === "string" ? e : (e.target ? e.target.value : "");
    updateEditingItem({ tags: tagsValue });
  };
  
  const handleContentChange = (value) => {
    updateEditingItem({ content: value });
  };
  
  const handleSave = () => {
    saveEditingItem();
  };
  
  const handleCancel = () => {
    cancelEditingItem();
  };
  
  const handleInsertTag = () => {
    let newTag = "";
    if (newTagType === "normal") {
      newTag = newNormalTagOption === "NEW" ? newNormalTagValue : newNormalTagOption;
    } else if (newTagType === "key-value") {
      const key = newKeyOption === "NEW" ? newKeyText : newKeyOption;
      newTag = key + "::" + newValueText;
    } else if (newTagType === "relation") {
      const relName = newRelNameOption === "NEW" ? newRelNameValue : newRelNameOption;
      newTag = relName + ">>" + newRelTarget;
    }
    const currentTags = editingItem.tags ? editingItem.tags.trim() : "";
    const updatedTags = currentTags ? currentTags + "," + newTag : newTag;
    updateEditingItem({ tags: updatedTags });
    setShowTagModal(false);
    setNewTagType("normal");
    setNewNormalTagOption("NEW");
    setNewNormalTagValue("");
    setNewKeyOption("NEW");
    setNewKeyText("");
    setNewValueText("");
    setNewRelNameOption("NEW");
    setNewRelNameValue("");
    setNewRelTarget("");
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Item</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editingItem.title || ""}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div className="mb-4 flex items-center">
            <TagSelector
              value={editingItem.tags || ""}
              onChange={handleTagsChange}
              allTags={window.StruMLApp.Utils.extractAllTags(state.document.items)}
            />
            <button
              onClick={() => setShowTagModal(true)}
              className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              title="Add New Tag"
            >
              +
            </button>
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <MarkdownEditor value={editingItem.content || ""} onChange={handleContentChange} />
          </div>
        </div>
  
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">Save Changes</button>
          <button
            onClick={() => {
              handleSave();
              setTimeout(() => {
                window.StruMLApp.Utils.exportAsJson(state.document);
              }, 100);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save and Export
          </button>
        </div>
      </div>
  
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-96 p-4">
            <h3 className="text-lg font-semibold mb-4">Add New Tag</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Type</label>
              <select
                value={newTagType}
                onChange={(e) => setNewTagType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="normal">Normal</option>
                <option value="key-value">Key-Value</option>
                <option value="relation">Relation</option>
              </select>
            </div>
  
            {newTagType === "normal" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Normal Tag</label>
                <select
                  value={newNormalTagOption}
                  onChange={(e) => setNewNormalTagOption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
                >
                  {getNormalTagOptions().map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {newNormalTagOption === "NEW" && (
                  <input
                    type="text"
                    value={newNormalTagValue}
                    onChange={(e) => setNewNormalTagValue(e.target.value)}
                    placeholder="Enter new tag"
                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                  />
                )}
              </div>
            )}
  
            {newTagType === "key-value" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                <select
                  value={newKeyOption}
                  onChange={(e) => setNewKeyOption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
                >
                  {getKeyOptions().map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {newKeyOption === "NEW" && (
                  <input
                    type="text"
                    value={newKeyText}
                    onChange={(e) => setNewKeyText(e.target.value)}
                    placeholder="Enter new key"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
                  />
                )}
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={newValueText}
                  onChange={(e) => setNewValueText(e.target.value)}
                  placeholder="Enter value"
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
            )}
  
            {newTagType === "relation" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Relation Name</label>
                <select
                  value={newRelNameOption}
                  onChange={(e) => setNewRelNameOption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
                >
                  {getRelationNameOptions().map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {newRelNameOption === "NEW" && (
                  <input
                    type="text"
                    value={newRelNameValue}
                    onChange={(e) => setNewRelNameValue(e.target.value)}
                    placeholder="Enter new relation name"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
                  />
                )}
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <select
                  value={newRelTarget}
                  onChange={(e) => setNewRelTarget(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">Select target</option>
                  {getAllItems().map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
  
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowTagModal(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleInsertTag} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main content component
const MainContent = () => {
  const { state } = useAppContext();
  const { document, selectedItemId, isEditing, isChatbotOpen } = state;
  
  const selectedItem = selectedItemId 
    ? window.StruMLApp.Utils.findItemById(document.items, selectedItemId)
    : null;
  
  return (
    <div className="flex-1 overflow-hidden bg-white flex">
      <div className={`flex-1 overflow-y-auto ${isChatbotOpen ? 'w-2/3' : 'w-full'}`}>
        {selectedItem ? (
          <ItemView item={selectedItem} />
        ) : (
          document.items.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No Item Selected</h2>
              <p className="text-gray-600 mb-6 max-w-lg">
                Please select an item from the sidebar to view or edit its content.
              </p>
            </div>
          )
        )}
        
        {isEditing && <ItemEditor />}
      </div>
      
      {isChatbotOpen && (
        <div className="w-1/3 border-l border-gray-200">
          <ChatbotPanel />
        </div>
      )}
    </div>
  );
};
