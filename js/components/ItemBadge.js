const ItemBadge = ({ targetItemTitle, document, selectItem }) => { // document and selectItem are now props
  // const { state, actions } = useAppContext(); // REMOVE this
  // const { document } = state; // REMOVE this
  // const { selectItem } = actions; // REMOVE this

  const [showPopover, setShowPopover] = React.useState(false);
  const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });
  const badgeRef = React.useRef(null);
  const popoverTimeoutRef = React.useRef(null);

  const targetItem = React.useMemo(() => {
    if (!document || !targetItemTitle) return null;
    return window.StruMLApp.Utils.findItemByTitle(document.items, targetItemTitle);
  }, [document, targetItemTitle]);

  React.useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (popoverTimeoutRef.current) {
        clearTimeout(popoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
      popoverTimeoutRef.current = null;
    }
    if (badgeRef.current && targetItem) {
      const rect = badgeRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY + 5, // 5px offset
        left: rect.left + window.scrollX,
      });
      setShowPopover(true);
    }
  };

  const handleMouseLeave = (isLeavingPopover = false) => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }
    popoverTimeoutRef.current = setTimeout(() => {
      setShowPopover(false);
    }, isLeavingPopover ? 50 : 200); // Shorter delay if leaving popover itself
  };
  
  const handlePopoverMouseEnter = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
      popoverTimeoutRef.current = null;
    }
  };

  const navigateToItem = () => {
    if (targetItem) {
      selectItem(targetItem.id);
      setShowPopover(false);
    }
  };

  if (!targetItem) {
    return (
      <span className="inline-block bg-red-100 text-red-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded line-through" title={`Item not found: ${targetItemTitle}`}>
        [[{targetItemTitle}]]
      </span>
    );
  }

  let contentSnippet = targetItem.content || "";
  if (contentSnippet.length > 150) {
    contentSnippet = contentSnippet.substring(0, 150) + "...";
  }

  return (
    <>
      <span
        ref={badgeRef}
        className="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded cursor-pointer hover:bg-gray-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => handleMouseLeave(false)}
        onClick={navigateToItem} // Allow direct click on badge to navigate
        title={targetItem.title}
      >
        [[{targetItem.title}]]
      </span>

      {showPopover && (
        <div
          style={{ position: 'absolute', top: popoverPosition.top, left: popoverPosition.left }}
          className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 w-80 z-50"
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={() => handleMouseLeave(true)}
        >
          <h3 className="text-md font-bold mb-2">{targetItem.title}</h3>
          {contentSnippet ? (
            <div
              className="text-xs max-h-32 overflow-y-auto mb-2 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: window.StruMLApp.Utils.renderMarkdown(contentSnippet) }}
            />
          ) : (
            <p className="text-xs text-gray-500 mb-2 italic">No content.</p>
          )}
          <button
            onClick={navigateToItem}
            className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
          >
            Go to item
          </button>
        </div>
      )}
    </>
  );
};

if (window.StruMLApp) {
  window.StruMLApp.Components = window.StruMLApp.Components || {};
  window.StruMLApp.Components.ItemBadge = ItemBadge;
}
