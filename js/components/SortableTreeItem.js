/**
 * SortableTreeItem Component
 * A tree item component that uses dnd for drag and drop functionality
 */

const SortableTreeItem = ({ item, level = 0, filteredItems }) => {
  const { state, actions } = useAppContext();
  const { selectedItemId } = state;
  const { selectItem } = actions;
  
  const [isExpanded, setIsExpanded] = React.useState(true);
  // State to store the current drop position with debounce
  const [stableDropPosition, setStableDropPosition] = React.useState(null);
  // Reference to store the timeout ID for debounce
  const debounceTimerRef = React.useRef(null);
  
  // Define position types
  const POSITION_TYPES = {
    BEFORE: 'before',
    AFTER: 'after',
    INSIDE: 'inside'
  };
  
  // Get references to dnd libraries
  const { useSortable } = Sortable;
  const { CSS } = DndKit.utilities;
  
  // Set up sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    over,
    node
  } = useSortable({
    id: item.id,
    data: { item, level }
  });
  
  // Function to determine drop position with hysteresis
  React.useEffect(() => {
    if (isOver && over?.data?.current) {
      // Get the current position from the over data
      const currentPosition = over.data.current.position;
      
      // If the position has changed, set up a debounce timer
      if (currentPosition !== stableDropPosition) {
        // Clear any existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        // Set a new timer to update the stable position after a delay
        debounceTimerRef.current = setTimeout(() => {
          setStableDropPosition(currentPosition);
        }, 100); // 100ms debounce delay
      }
    } else if (!isOver && stableDropPosition) {
      // Clear the position when not over any droppable
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setStableDropPosition(null);
    }
    
    // Cleanup function to clear the timer when component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isOver, over, stableDropPosition]);
  
  // Styles for the draggable item
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative'
  };
  
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
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Select item
      selectItem(item.id);
    } else if (e.key === 'ArrowRight') {
      // Expand item
      if (hasVisibleChildren && !isExpanded) {
        setIsExpanded(true);
      }
    } else if (e.key === 'ArrowLeft') {
      // Collapse item
      if (isExpanded) {
        setIsExpanded(false);
      }
    }
  };
  
  return (
    <div className="tree-item-container">
      {/* Drop zone for BEFORE position */}
      <div 
        className={`drop-zone drop-zone-before ${stableDropPosition === POSITION_TYPES.BEFORE ? 'active' : ''}`}
      >
        {stableDropPosition === POSITION_TYPES.BEFORE && (
          <div className="drop-indicator before"></div>
        )}
      </div>
      
      <div 
        ref={setNodeRef}
        className={`tree-item flex items-center px-2 py-1 cursor-pointer ${isSelected ? 'selected' : ''} ${isHighlighted ? 'bg-blue-50' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{ ...style, paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        data-item-id={item.id}
        aria-label={`Item: ${item.title}`}
        aria-grabbed={isDragging}
        role="treeitem"
        tabIndex={0}
      >
        {/* Drag handle */}
        <div className="drag-handle mr-1" {...listeners} {...attributes}>
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
        
        {/* Drop zone for INSIDE position (visible only when dragging) */}
        {isDragging && (
          <div 
            className={`drop-zone drop-zone-inside ${stableDropPosition === POSITION_TYPES.INSIDE ? 'active' : ''}`}
          >
            {stableDropPosition === POSITION_TYPES.INSIDE && (
              <div className="drop-indicator inside"></div>
            )}
          </div>
        )}
      </div>
      
      {/* Drop zone for AFTER position */}
      <div 
        className={`drop-zone drop-zone-after ${stableDropPosition === POSITION_TYPES.AFTER ? 'active' : ''}`}
      >
        {stableDropPosition === POSITION_TYPES.AFTER && (
          <div className="drop-indicator after"></div>
        )}
      </div>
      
      {/* Render children if expanded */}
      {hasVisibleChildren && isExpanded && (
        <div className="tree-item-children">
          {visibleChildren.map(childItem => (
            <SortableTreeItem 
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
window.StruMLApp.Components.SortableTreeItem = SortableTreeItem;
