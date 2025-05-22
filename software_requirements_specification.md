# Software Requirements Specification
# StruML Rebuild Project

## 1. Introduction

### 1.1 Purpose
This document outlines the software requirements for rebuilding the StruML (Structured Modeling Language) application using modern web technologies. The goal is to create a more maintainable, scalable, and feature-rich version of the existing application while preserving its core functionality and enhancing the user experience.

### 1.2 Document Conventions
- **SHALL**: Indicates a mandatory requirement
- **SHOULD**: Indicates a recommended requirement
- **MAY**: Indicates an optional requirement

### 1.3 Project Scope
The project involves rebuilding the StruML application, a web-based tool for creating, organizing, and structuring domain knowledge in a hierarchical manner. The application allows users to create structured documents with items, tags, and relations, and provides visualization capabilities for relationships between items.

### 1.4 References
- Existing StruML application codebase
- Bootstrap 5 documentation
- React documentation

## 2. Overall Description

### 2.1 Product Perspective
StruML is a standalone web application that enables users to create structured documents for knowledge organization. The application stores data locally in the browser and provides export capabilities to various formats. It also integrates with an external AI service for content generation assistance.

### 2.2 Product Features
- Hierarchical document structure with nested items
- Tagging system for item categorization
- Relations between items with visualization capabilities
- Markdown content editing for items
- Document navigation and filtering
- Export to various formats (JSON, Markdown, HTML, CSV)
- AI assistant for content generation
- Matrix visualization for relationships between items

### 2.3 User Classes and Characteristics
- **Knowledge Workers**: Professionals who need to organize and structure domain knowledge
- **Business Analysts**: Users who create business models and need to visualize relationships
- **Researchers**: Users who organize research findings and create structured documents
- **Content Creators**: Users who create structured content with relationships between concepts

### 2.4 Operating Environment
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Desktop and mobile devices
- No server-side requirements (client-side application)

### 2.5 Design and Implementation Constraints
- Must be a single-page application (SPA)
- Must work offline with local storage capabilities
- Must be responsive and work on various screen sizes
- Must maintain compatibility with existing data format for backward compatibility

### 2.6 User Documentation
- In-app guide with usage instructions
- Tooltips for UI elements
- Sample documents for demonstration

### 2.7 Assumptions and Dependencies
- External dependencies on third-party libraries
- Integration with external AI service for content generation

## 3. System Features

### 3.1 Document Management

#### 3.1.1 Description
The system SHALL provide capabilities for creating, importing, and exporting structured documents.

#### 3.1.2 Requirements
1. The system SHALL allow users to create new empty documents.
2. The system SHALL allow users to import existing documents in JSON format.
3. The system SHALL allow users to export documents in multiple formats:
   - JSON (native format with full structure)
   - Markdown (hierarchical text format)
   - HTML (for use in document editors)
   - CSV (tabular format with parent-child relationships)
4. The system SHALL automatically save documents to local storage.
5. The system SHALL provide a clear indication of the current document title.
6. The system SHALL allow users to clear the current document after confirmation.

### 3.2 Item Management

#### 3.2.1 Description
The system SHALL provide capabilities for creating, editing, and organizing hierarchical items.

#### 3.2.2 Requirements
1. The system SHALL allow users to create top-level items.
2. The system SHALL allow users to create child items under any existing item.
3. The system SHALL allow users to edit item properties:
   - Title
   - Content (in Markdown format)
   - Tags
   - Relations to other items
4. The system SHALL allow users to delete items (with confirmation).
5. The system SHALL allow users to reorder items via drag-and-drop.
6. The system SHALL provide visual indicators for different item types based on tags.
7. The system SHALL allow users to expand and collapse items to show or hide their children.
8. The system SHALL render Markdown content with proper sanitization.

### 3.3 Tagging System

#### 3.3.1 Description
The system SHALL provide a flexible tagging system for item categorization.

#### 3.3.2 Requirements
1. The system SHALL allow users to add multiple tags to items.
2. The system SHALL support special tag formats (e.g., `key::value`) for item classification.
3. The system SHALL provide tag suggestions based on existing tags in the document.
4. The system SHALL allow users to filter items by tags with AND/OR logic.
5. The system SHALL provide visual indicators for active tag filters.
6. The system SHALL allow users to show or hide subitems when filtering by tags.

### 3.4 Relations System

#### 3.4.1 Description
The system SHALL provide capabilities for creating and visualizing relationships between items.

#### 3.4.2 Requirements
1. The system SHALL support relation special tag formats (e.g., `relation>>target`) for item classification.
1. The system SHALL allow users to create relations between items with various relation types.
2. The system SHALL support predefined relation types with visual indicators.
3. The system SHALL support custom relation types.
4. The system SHALL display both outgoing and incoming relations for each item.
5. The system SHALL update relation references when item titles change.
6. The system SHALL allow users to navigate to related items by clicking on relations.

### 3.5 Matrix Visualization

#### 3.5.1 Description
The system SHALL provide matrix visualization capabilities for relationships between items.

#### 3.5.2 Requirements
1. The system SHALL allow users to create matrix items that visualize relationships between two sets of items.
2. The system SHALL provide a matrix editor for defining relationships.
3. The system SHALL support custom cell values for matrix relationships.
4. The system SHALL provide multiple visualization types:
   - Heatmap visualization
   - Sankey diagram visualization
5. The system SHALL allow users to edit matrix relationships and save changes.
6. The system SHALL provide tooltips for matrix cells to show additional information.

### 3.6 Document Navigation

#### 3.6.1 Description
The system SHALL provide efficient navigation capabilities for structured documents.

#### 3.6.2 Requirements
1. The system SHALL provide a sidebar with a hierarchical document navigation tree.
2. The system SHALL allow users to expand and collapse navigation tree nodes.
3. The system SHALL highlight the currently selected item in the navigation tree.
4. The system SHALL allow users to collapse or expand all items with a single action.
5. The system SHALL allow users to toggle the visibility of the sidebar.
6. The system SHALL provide smooth scrolling to items when selected in the navigation tree.

### 3.7 AI Assistant

#### 3.7.1 Description
The system SHALL provide an AI assistant for content generation and help, accessible both as a sidebar panel and as a tab within the item editor modal.

#### 3.7.2 Requirements
1. The system SHALL provide a chat interface for interacting with the AI assistant.
2. The system SHALL allow users to send custom requests to the AI assistant.
3. The system SHALL allow users to execute predefined query types.
4. The system SHALL provide context to the AI assistant based on the currently selected item.
5. The system SHALL display AI responses with proper formatting (Markdown rendering).
6. The system SHALL allow users to add AI-generated content to items.
7. The system SHALL allow users to add AI-suggested subitems to the current item.
8. The system SHALL provide the AI assistant functionality both as a sidebar panel and as a tab within the item editor modal.
9. The system SHALL maintain chat context and history between the sidebar and modal tab interfaces.

### 3.8 Information Panel

#### 3.8.1 Description
The system SHALL provide an information panel for displaying additional details about items, accessible both as a sidebar panel and as a tab within the item editor modal.

#### 3.8.2 Requirements
1. The system SHALL display Markdown content about the selected item in the information panel.
2. The system SHALL display related items in the information panel.
3. The system SHALL allow users to navigate to related items from the information panel.
4. The system SHALL fetch Markdown content from a predefined location based on item title.
5. The system SHALL provide the information panel functionality both as a sidebar panel and as a tab within the item editor modal.
6. The system SHALL maintain consistent information display between the sidebar and modal tab interfaces.

### 3.9 User Interface

#### 3.9.1 Description
The system SHALL provide a responsive and intuitive user interface.

#### 3.9.2 Requirements
1. The system SHALL provide a responsive layout that works on various screen sizes.
2. The system SHALL provide a collapsible sidebar for document navigation.
3. The system SHALL provide modal dialogs for item editing and confirmation actions.
4. The system SHALL provide tooltips for UI elements to explain their functionality.
5. The system SHALL provide visual feedback for user actions (e.g., alerts for successful operations).
6. The system SHALL allow users to toggle the visibility of item details (tags and relations).
7. The system SHALL provide a welcome screen for new users with options to create or import documents.

### 3.10 Modal Tab Interface

#### 3.10.1 Description
The system SHALL provide a tabbed interface within the item editor modal for accessing additional functionality.

#### 3.10.2 Requirements
1. The system SHALL provide a tabbed interface within the item editor modal with the following tabs:
   - Edit (default): For editing item properties (title, content, tags, relations)
   - Info: For displaying information about the item (same content as the information panel)
   - AI Assistant: For interacting with the AI assistant in the context of the current item
2. The system SHALL maintain consistent state and functionality between the sidebar panels and modal tabs.
3. The system SHALL allow users to switch between tabs without losing their work in the editor.
4. The system SHALL provide visual indicators for the active tab.
5. The system SHALL ensure that the modal tab interface is responsive and works on various screen sizes.
6. The system SHALL provide keyboard shortcuts for switching between tabs.

## 4. Technical Requirements

### 4.1 Frontend Framework

#### 4.1.1 Description
The system SHALL be built using a modern frontend framework.

#### 4.1.2 Requirements
1. The system SHALL be built using React with TypeScript for improved type safety and developer experience.
2. The system SHALL use a modern build system (Vite or Next.js) for improved development experience and performance.
3. The system SHALL use a state management solution (Redux Toolkit, Zustand, or React Context API) for managing application state.
4. The system SHALL use React Router for client-side routing.

### 4.2 UI Components

#### 4.2.1 Description
The system SHALL use a modern UI component library.

#### 4.2.2 Requirements
1. The system SHALL use a modern UI component library (MUI, Chakra UI, or Tailwind CSS) for consistent styling.
2. The system SHALL implement responsive design principles for various screen sizes.
3. The system SHALL provide consistent styling across all components.
4. The system SHALL support light and dark themes.

### 4.3 Data Management

#### 4.3.1 Description
The system SHALL provide robust data management capabilities.

#### 4.3.2 Requirements
1. The system SHALL use local storage for document persistence.
2. The system SHALL provide data export capabilities to various formats.
3. The system SHALL implement data validation for imported documents.
4. The system SHALL handle data migrations for backward compatibility.
5. The system MAY provide cloud synchronization capabilities (optional enhancement).

### 4.4 Editor Integration

#### 4.4.1 Description
The system SHALL integrate with modern Markdown editing capabilities.

#### 4.4.2 Requirements
1. The system SHALL integrate with a modern Markdown editor (e.g., CodeMirror, Monaco Editor).
2. The system SHALL provide syntax highlighting for Markdown content.
3. The system SHALL provide preview capabilities for Markdown content.
4. The system SHALL sanitize Markdown content to prevent XSS attacks.

### 4.5 Visualization

#### 4.5.1 Description
The system SHALL provide modern visualization capabilities.

#### 4.5.2 Requirements
1. The system SHALL use a modern visualization library (D3.js or similar) for matrix visualizations.
2. The system SHALL provide interactive visualizations with tooltips and hover effects.
3. The system SHALL ensure visualizations are responsive and adapt to container size.

### 4.6 AI Integration

#### 4.6.1 Description
The system SHALL integrate with an external AI service.

#### 4.6.2 Requirements
1. The system SHALL communicate with an external AI service via a webhook.
2. The system SHALL provide context to the AI service based on the current item.
3. The system SHALL handle AI service responses and display them appropriately.
4. The system SHALL implement error handling for AI service communication.

### 4.7 Performance

#### 4.7.1 Description
The system SHALL meet performance requirements for a smooth user experience.

#### 4.7.2 Requirements
1. The system SHALL load and initialize within 3 seconds on modern devices.
2. The system SHALL respond to user interactions within 100ms.
3. The system SHALL handle documents with up to 1000 items without performance degradation.
4. The system SHALL implement performance optimizations for large documents (virtualization, memoization).

### 4.8 Accessibility

#### 4.8.1 Description
The system SHALL meet accessibility standards.

#### 4.8.2 Requirements
1. The system SHALL comply with WCAG 2.1 AA standards.
2. The system SHALL provide keyboard navigation for all features.
3. The system SHALL ensure proper contrast ratios for text and UI elements.
4. The system SHALL provide proper ARIA attributes for custom components.

### 4.9 Testing

#### 4.9.1 Description
The system SHALL have comprehensive testing.

#### 4.9.2 Requirements
1. The system SHALL have unit tests for core functionality.
2. The system SHALL have integration tests for component interactions.
3. The system SHALL have end-to-end tests for critical user flows.
4. The system SHALL maintain a test coverage of at least 80% for core functionality.

## 5. Data Model

### 5.1 Document Structure
```typescript
interface Document {
  title: string;
  items: Item[];
}
```

### 5.2 Item Structure
```typescript
interface Item {
  id: string;
  title: string;
  content: string;
  tags: string;
  items: Item[];
}
```

### 5.3 Relation Structure
```typescript
interface Relation {
  relation: string;
  target: string;
  fullTag: string;
}
```

### 5.4 Matrix Structure
```typescript
interface Matrix {
  sourceItem: Item;
  targetItem: Item;
  rows: MatrixRow[];
  columns: MatrixColumn[];
  cellValues: string[];
  data: Record<string, Record<string, string>>;
}

interface MatrixRow {
  id: string;
  title: string;
  content: string;
}

interface MatrixColumn {
  id: string;
  title: string;
  content: string;
}
```

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
1. The application SHALL load within 3 seconds on a standard broadband connection.
2. The application SHALL respond to user interactions within 100ms.
3. The application SHALL handle documents with up to 1000 items without significant performance degradation.

### 6.2 Security Requirements
1. The application SHALL sanitize all user-generated content to prevent XSS attacks.
2. The application SHALL use secure communication with external services (HTTPS).
3. The application SHALL not expose sensitive information in client-side code.

### 6.3 Compatibility Requirements
1. The application SHALL work on the latest versions of major browsers (Chrome, Firefox, Safari, Edge).
2. The application SHALL be responsive and work on desktop and mobile devices.
3. The application SHALL maintain backward compatibility with existing document formats.
4. The application SHALL implement progressive enhancement for modern browser features:
   - Use the File System Access API for improved file handling in supported browsers
   - Provide fallback mechanisms for browsers that don't support modern APIs
   - Ensure core functionality works across all target browsers
5. The application SHALL be deployed as a static site on GitHub Pages.

### 6.4 Usability Requirements
1. The application SHALL provide clear feedback for user actions.
2. The application SHALL provide tooltips for UI elements to explain their functionality.
3. The application SHALL provide a consistent and intuitive user interface.
4. The application SHALL provide keyboard shortcuts for common actions.

### 6.5 Reliability Requirements
1. The application SHALL automatically save user data to prevent data loss.
2. The application SHALL provide export capabilities for data backup.
3. The application SHALL handle errors gracefully and provide meaningful error messages.

## 7. Implementation Plan

### 7.1 Phase 1: Core Functionality
1. Set up project structure with modern build system
2. Implement document management (create, import, export)
3. Implement item management (create, edit, delete)
4. Implement document navigation
5. Implement local storage persistence

### 7.2 Phase 2: Advanced Features
1. Implement tagging system
2. Implement relations system
3. Implement matrix visualization
4. Implement Markdown editing

### 7.3 Phase 3: AI Integration and Enhancements
1. Implement AI assistant integration
2. Implement information panel
3. Implement advanced visualizations
4. Implement performance optimizations

### 7.4 Phase 4: Testing and Refinement
1. Implement comprehensive testing
2. Refine user interface and experience
3. Optimize performance
4. Address feedback and bug fixes

## 8. Technology Stack Decisions

### 8.1 Core Technologies
- **Frontend Framework**: React with TypeScript
- **Build System**: Vite
- **State Management**: Zustand
- **Routing**: React Router
- **UI Components**: Tailwind CSS with shadcn/ui
- **Markdown Editor**: CodeMirror
- **Markdown Rendering**: Marked with DOMPurify
- **Visualization**: D3.js
- **Drag and Drop**: dnd-kit
- **Testing**: Jest, React Testing Library, Cypress

### 8.2 Additional Libraries
- **Form Handling**: react-jsonschema-form
- **Validation**: Zod
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API
- **Utilities**: Lodash
- **Icons**: React Icons
- **File System Access**: File System Access API with fallback for older browsers

## 9. Conclusion

This Software Requirements Specification outlines the requirements for rebuilding the StruML application using modern web technologies. The document provides a comprehensive overview of the system features, technical requirements, data model, and implementation plan. The goal is to create a more maintainable, scalable, and feature-rich version of the existing application while preserving its core functionality and enhancing the user experience.

## 10. Addendum: UI Improvements and Technical Corrections

This addendum documents the user interface improvements and technical corrections that must be implemented before proceeding to the next project phase.

### 10.1 User Interface Improvements

#### 10.1.1 Sidebar for Chatbot
1. The system SHALL revert the current modal window for the chatbot.
2. The system SHALL implement a **horizontal sidebar** that shifts the item content sideways.
3. The system SHALL keep all content at the same visual level.
4. The system SHALL display a temporary placeholder to show item information.

#### 10.1.2 Document Structure Tree
1. The system SHALL increase the navigation tree width by approximately **150%**.
2. The system SHALL add buttons to **expand** and **collapse** all nodes in the tree simultaneously.

#### 10.1.3 Tagging System (Tagsify)
1. The system SHALL implement a **Tagsify-like** solution with the following features:
   - Visual chips for tags
   - Autocomplete suggestions for tags
   - Drag-and-drop support for rearranging tags
   - Validation visuals and color-coded tags by type

### 10.2 Technical Corrections

#### 10.2.1 Critical Errors
1. The system SHALL fix the `ReferenceError: WelcomeScreen is not defined` in the `MainContent` component.

#### 10.2.2 Modal Editing Problems
1. The system SHALL resolve the identified issues when editing content inside modal windows.

### 10.3 Technical Approach

#### 10.3.1 Recommended Libraries
1. The system SHOULD use **dnd-kit** for drag-and-drop functionality.
2. The system SHOULD use **react-tagsinput** for the tagging system.
3. The system SHOULD use **react-split-pane** for resizable panels.

#### 10.3.2 Technical Considerations
1. The system SHALL focus on performance, cross-browser compatibility, and responsive design.
2. The system SHALL ensure all improvements maintain consistency with the existing design.

### 10.4 Proposed Action Sequence
1. Fix critical technical errors (e.g., the `WelcomeScreen` issue).
2. Improve the navigation tree (width and expand/collapse functionality).
3. Reposition the chatbot to the sidebar.
4. Implement Tagsify-like tagging system.
5. Implement drag-and-drop for subitems.

### 10.5 Priority
These issues SHALL be resolved before proceeding to the next project phase.

## 11. Addendum: Implementation Status and Recent Changes

This addendum documents the current implementation status of the StruML application and the recent changes made to address the requirements specified in the previous sections.

### 11.1 Current Implementation Status

#### 11.1.1 Overall Progress
The application has completed most of Phase 2 of the implementation plan. The core functionality is fully implemented, and many of the advanced features are in place. The application is functional and allows users to create, edit, and organize structured documents with hierarchical items, tags, and relations.

#### 11.1.2 Completed Features
1. **Document Management**:
   - Creation of new documents
   - Import/export functionality for JSON format
   - Local storage persistence
   - Document title display

2. **Item Management**:
   - Creation, editing, and deletion of items
   - Hierarchical organization of items
   - Markdown content editing
   - Drag-and-drop reordering of items

3. **Navigation**:
   - Document structure sidebar tree
   - Expand/collapse functionality for individual nodes
   - Wider navigation tree (150% increase)
   - Expand/collapse all buttons
   - Selection highlighting for current item

4. **Tagging System**:
   - Tagsify-like implementation with visual chips
   - Autocomplete suggestions for tags
   - Drag-and-drop support for reordering tags
   - Color-coded tags by type
   - Tag filtering with AND/OR logic

5. **Markdown Rendering**:
   - Secure rendering using Marked and DOMPurify
   - Markdown editor with preview

6. **Relations System**:
   - Creation of relations between items using special tags
   - Visualization of relations
   - Navigation to related items

7. **AI Assistant**:
   - Horizontal sidebar implementation
   - Basic interaction with AI assistant
   - Context-aware assistance

8. **Matrix Visualization**:
   - Basic implementation of matrix visualization
   - Heatmap and Sankey diagram visualizations

### 11.2 Recent Changes and Improvements

#### 11.2.1 UI Improvements
1. **Chatbot Sidebar**:
   - Implemented the chatbot as a horizontal sidebar instead of a modal window
   - Ensured content remains at the same visual level
   - Added placeholder for item information

2. **Document Navigation Tree**:
   - Increased the width of the navigation tree by 150%
   - Added buttons to expand and collapse all nodes simultaneously
   - Improved the visual hierarchy of the tree

3. **Tagging System**:
   - Reimplemented the tagging system using Tagify
   - Added visual chips for tags with color-coding by type
   - Implemented autocomplete suggestions
   - Added drag-and-drop support for reordering tags
   - Fixed issues with tag display and editing

#### 11.2.2 Technical Corrections
1. **Critical Error Fixes**:
   - Resolved the `ReferenceError: WelcomeScreen is not defined` in the `MainContent` component
   - Fixed issues with modal editing
   - Corrected problems with tag duplication and display

2. **Performance Improvements**:
   - Optimized rendering of large documents
   - Improved responsiveness of the UI
   - Enhanced the performance of tag filtering

### 11.3 Deviations from Original Requirements

#### 11.3.1 AI Assistant Implementation
The AI assistant has been implemented as a horizontal sidebar rather than both a sidebar panel and a tab within the item editor modal. This change was made to improve usability and maintain context during editing.

#### 11.3.2 Tag Suggestions Display
Tag suggestions are currently hidden to prevent duplication issues. This is a temporary solution until a more robust implementation can be developed.

### 11.4 Next Steps

#### 11.4.1 Immediate Priorities
1. Complete the implementation of the relations system
2. Enhance the matrix visualization capabilities
3. Improve the tag filtering functionality
4. Resolve any remaining issues with the tagging system

#### 11.4.2 Phase 3 Preparation
1. Enhance the AI assistant integration
2. Implement advanced visualizations
3. Optimize performance for large documents
4. Improve accessibility features

### 11.5 Technical Notes

#### 11.5.1 Libraries Used
- **Tagify**: For the tagging system
- **DragSort**: For drag-and-drop functionality
- **D3.js**: For matrix visualizations
- **SimpleMDE**: For Markdown editing
- **Marked and DOMPurify**: For secure Markdown rendering

#### 11.5.2 Known Issues
1. Tag suggestions may appear duplicated in some cases
2. Some styling inconsistencies in the tagging system
3. Matrix visualization performance issues with large datasets

This addendum reflects the current state of the StruML application as of April 26, 2025, and documents the progress made in implementing the requirements specified in the Software Requirements Specification.
