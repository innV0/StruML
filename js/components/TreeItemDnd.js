/**
 * TreeItemDnd Component
 * A tree item component that uses dnd for drag and drop functionality
 */

const TreeItemDnd = ({ item, level = 0, filteredItems }) => {
  const { state, actions } = useAppContext();
  const { selectedItemId, document } = state;
  const { selectItem, reorderItems } = actions;
  
  const [isExpanded, setIsExpanded] = React.useState(true);
  // State to store the current drop position with debounce
  const [stableDropPosition, setStableDropPosition] = React.useState(null);
  // Reference to store the timeout ID for debounce
  const debounceTimerRef = React.useRef(null);
  
  // Get references to dnd libraries
  const { useDraggable, useDroppable } = DndKit;
  
  // Function to determine drop position with hysteresis and debounce
  const updateDropPosition = (position) => {
    // Si la posición es 'inside', aplicamos menos debounce para que sea más responsivo
    const debounceTime = position === 'inside' ? 50 : 150;
    
    // If the position has changed, set up a debounce timer
    if (position !== stableDropPosition) {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set a new timer to update the stable position after a delay
      debounceTimerRef.current = setTimeout(() => {
        setStableDropPosition(position);
      }, debounceTime); // Debounce delay ajustado según la posición
    }
  };
  
  // Cleanup function to clear the timer when component unmounts
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Referencia para el handle de arrastre
  const dragHandleRef = React.useRef(null);
  
  // Set up draggable - IMPORTANTE: No asignamos el ref al nodo completo, sino que lo haremos manualmente al handle
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item }
  });
  
  // Asignar el ref al handle cuando esté disponible
  React.useEffect(() => {
    if (dragHandleRef.current) {
      setNodeRef(dragHandleRef.current);
    }
  }, [setNodeRef]);
  
  // Set up droppable for before position
  const { setNodeRef: setBeforeDroppableRef, isOver: isOverBefore } = useDroppable({
    id: `${item.id}-before`,
    data: { 
      itemId: item.id,
      position: 'before'
    }
  });
  
  // Set up droppable for after position
  const { setNodeRef: setAfterDroppableRef, isOver: isOverAfter } = useDroppable({
    id: `${item.id}-after`,
    data: { 
      itemId: item.id,
      position: 'after'
    }
  });
  
  // Set up droppable for inside position
  const { setNodeRef: setInsideDroppableRef, isOver: isOverInside } = useDroppable({
    id: `${item.id}-inside`,
    data: { 
      itemId: item.id,
      position: 'inside'
    }
  });
  
  // Update drop position when any of the isOver states change
  React.useEffect(() => {
    // Priorizar la zona "inside" para reducir el parpadeo
    if (isOverInside) {
      // Dar prioridad a la zona inside
      updateDropPosition('inside');
    } else if (isOverBefore) {
      updateDropPosition('before');
    } else if (isOverAfter) {
      updateDropPosition('after');
    } else if (!isOverBefore && !isOverAfter && !isOverInside && stableDropPosition) {
      // Delay clearing the position to avoid flickering when the drag hovers around the node.
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setStableDropPosition(null);
      }, 300); // Aumentar el tiempo de debounce para mayor estabilidad
    }
  }, [isOverBefore, isOverAfter, isOverInside]);
  
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
  
  // Use the stable drop position instead of directly checking isOver states
  const dropPosition = stableDropPosition;
  
  return (
    <div>
      {/* Before drop area */}
      <div 
        ref={setBeforeDroppableRef}
        className={`drop-zone drop-zone-before ${stableDropPosition === 'before' ? 'active' : ''}`}
      >
        {stableDropPosition === 'before' && (
          <div className="drop-indicator before"></div>
        )}
      </div>
      
      <div 
        className={`tree-item flex items-center px-2 py-1 cursor-pointer ${isSelected ? 'selected' : ''} ${isHighlighted ? 'bg-blue-50' : ''} ${isDragging ? 'is-dragging' : ''} ${dropPosition ? `drop-${dropPosition}` : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
        data-item-id={item.id}
      >
        {/* Drop indicator */}
        {dropPosition && (
          <div className={`drop-indicator ${dropPosition} ${dropPosition === 'inside' ? 'active' : ''}`}></div>
        )}
        
        {/* Drag handle - SOLO este elemento es arrastrable */}
        <div 
          ref={dragHandleRef}
          className="drag-handle mr-1"
          title="Arrastrar desde aquí"
          {...attributes}
          {...listeners}
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
              className={`h-3 w-3 transform ${isExpanded ? 'rotate-90' : ''}`} 
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
      
      {/* Inside drop area - siempre visible para facilitar el drop */}
      <div 
        ref={setInsideDroppableRef}
        className={`drop-zone drop-zone-inside ${stableDropPosition === 'inside' ? 'active' : ''}`}
        style={{ display: 'block', minHeight: '30px' }}
      >
        {stableDropPosition === 'inside' && (
          <div className="drop-indicator inside"></div>
        )}
      </div>
      
      {/* After drop area */}
      <div 
        ref={setAfterDroppableRef}
        className={`drop-zone drop-zone-after ${stableDropPosition === 'after' ? 'active' : ''}`}
      >
        {stableDropPosition === 'after' && (
          <div className="drop-indicator after"></div>
        )}
      </div>
      
      {hasVisibleChildren && isExpanded && (
        <div>
          {visibleChildren.map(childItem => (
            <TreeItemDnd 
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

// Export the component
window.StruMLApp.Components = window.StruMLApp.Components || {};
window.StruMLApp.Components.TreeItemDnd = TreeItemDnd;
