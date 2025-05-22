# StruML: Structured Modeling Language

StruML is a comprehensive single-page application designed to empower users to create, manage, and visualize structured documents with hierarchical items, tags, and inter-item relationships. This document provides end users and developers with an in-depth understanding of the application’s functionality, setup, code organization, and architectural design.

--------------------------------------------------

## Table of Contents

- [StruML: Structured Modeling Language](#struml-structured-modeling-language)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [User Guide](#user-guide)
    - [Getting Started](#getting-started)
    - [Document Management](#document-management)
    - [Item and Tag Management](#item-and-tag-management)
    - [Relations and Matrix Visualization](#relations-and-matrix-visualization)
    - [Saving and Exporting](#saving-and-exporting)
  - [Application Architecture \& Code Structure](#application-architecture--code-structure)
    - [Entry Point and Global Configuration](#entry-point-and-global-configuration)
    - [JavaScript Modules and Components](#javascript-modules-and-components)
    - [CSS and Styling](#css-and-styling)
    - [Metamodels and Templates](#metamodels-and-templates)
  - [Technical Details](#technical-details)
    - [Technologies Used](#technologies-used)
    - [Design and State Management](#design-and-state-management)
    - [File System \& Deployment](#file-system--deployment)
  - [Developer Guidelines](#developer-guidelines)
    - [Installation and Setup](#installation-and-setup)
    - [Code Organization \& Contributing](#code-organization--contributing)
    - [Troubleshooting \& Future Enhancements](#troubleshooting--future-enhancements)
  - [License](#license)
  - [Contact \& Support](#contact--support)

--------------------------------------------------

## Overview

StruML offers a modern and intuitive interface for organizing domain knowledge through structured documents. It facilitates the creation and management of documents via a tree-like organization of items, enriched by tagging, relational linking, and detailed matrix visualizations. The application is designed to work out-of-the-box directly from the `V0.2.0` folder, providing offline capabilities and seamless local storage integration.

--------------------------------------------------

## Key Features

- **Document Management**  
  - **Creation & Deletion**: Easily create new documents or remove outdated ones.
  - **Import/Export**: Supports JSON for internal use, along with Markdown, HTML, and CSV formats for sharing.
  - **Auto-Save**: Persists changes via browser local storage.

- **Item Management**  
  - **Hierarchical Structure**: Create nested items for a detailed hierarchical document structure.
  - **Rich Content Editing**: Integrated Markdown editor powered by CodeMirror enables formatted content with real-time preview.
  - **Drag-and-Drop Reordering**: Intuitive reordering using dnd-kit enhancements.

- **Tagging System**  
  - **Multi-tag Support**: Assign single or multiple tags to items.
  - **Enhanced Filtering**: Use special tag syntax (e.g., `type::value`) for advanced filtering and categorization.

- **Relations & Visualizations**  
  - **Interactive Relations**: Link items dynamically and reflect those relationships on an interactive graph.
  - **Matrix & Heatmap Views**: Leverage D3.js-powered visualizations to analyze complex connections.

- **Extensible UI**  
  - **Sidebar Navigation**: Collapsible navigation sidebar for fast document browsing.
  - **Modal Dialogs**: Dedicated modals for in-depth item editing, information panels, and AI-driven content suggestions.
  - **Responsive Design**: Optimized for various screen sizes and devices.

--------------------------------------------------

## User Guide

### Getting Started

1. **Launching the Application**:  
   - Open the `index.html` file (located within the `V0.2.0` folder) in your preferred web browser.
   - The application is entirely self-contained and does not require any external dependencies or installations.

2. **Initial Setup**:  
   - Once loaded, the application automatically retrieves any previously saved documents from local storage.
   - You may start by selecting “New Document” to create a fresh workspace.

### Document Management

- **Creating and Editing Documents**:  
  - Enter the document title and populate the content through the hierarchical item editor.
  - Modification of documents is facilitated by inline editing mechanisms and modal dialogs for advanced options.

- **Import and Export Options**:  
  - Use the Import functionality to load existing documents in JSON format.
  - The Export options allow you to save your work as JSON, Markdown, HTML, or CSV.

### Item and Tag Management

- **Managing Items**:  
  - Click on any item on the tree structure to view a details modal.
  - In the modal, use the *Edit Tab* to update the title and Markdown content.
  - Rearrange items using drag-and-drop actions provided by the UI.

- **Tagging and Filtering**:  
  - Assign contextual tags to items to aid in classification.
  - Filter items based on specific tags using the intuitive tag filter component.

### Relations and Matrix Visualization

- **Creating Relations**:  
  - Establish bidirectional or unidirectional links between items using the relations view.
  - Visual cues and interactive elements help trace these relationships.

- **Matrix Visualization**:  
  - Access the matrix view to see a detailed visualization of inter-item relationships.
  - Hover over cells to view tooltips that provide additional context and linkage details.

### Saving and Exporting

- **Auto-Save Feature**:  
  - Changes to documents are saved in real time using the browser's local storage.
  
- **Manual Exports**:  
  - Use the export function available in the UI to create backups or shareable documents in multiple formats.

--------------------------------------------------

## Application Architecture & Code Structure

A careful review of the application code reveals a modular and organized architecture that supports both clarity and scalability.

### Entry Point and Global Configuration

- **index.html**:  
  - Serves as the main entry point for the application.
  - Links to external resources such as CSS stylesheets and JavaScript modules.
  
- **config.js**:  
  - Contains global configuration variables and initialization settings.
  - Defines constants used throughout the app, ensuring that parameters like API endpoints and theme configurations are centralized.

### JavaScript Modules and Components

The core functionality is distributed across several JavaScript modules:

- **js/app.js**:  
  - Initializes the application and sets up the main event listeners.
  - Orchestrates data flow between the UI components and the underlying data store.

- **js/store.js**:  
  - Implements state management. While current code is written in plain JavaScript, it lays the groundwork for using state management libraries like Zustand.
  
- **js/utils.js**:  
  - Provides a set of helper functions used across the application for tasks like string manipulation, formatting, and data validation.

- **js/dnd-utils.js**:  
  - Contains utility functions specifically for managing drag-and-drop operations within the application, ensuring smooth item reordering.

- **js/components.js**:  
  - Registers and initializes various UI components.
  - Handles integration between components and the global state.

- **js/components/**:  
  This directory encapsulates all individual UI components. Key files include:
  - **ChatbotPanel.js**: Manages the AI Assistant panel for content suggestions.
  - **DraggableItemBadge.js**: Implements visual representations for draggable item elements.
  - **ItemCard.js**: Renders individual items in the document with interactive elements.
  - **MarkdownEditor.js**: Integrates CodeMirror for markdown editing, providing both editing and preview functionalities.
  - **MatrixEditor.js** & **MatrixVisualization.js**: Handle configuration and visual rendering of matrix views respectively.
  - **RelationsView.js**: Displays and manages relationships between items.
  - **TagEditor.js, TagFilter.js, and TagSelector.js**: Implement the tagging functionality, covering creation, editing, filtering, and selection operations.
  - **TreeItemDndKit.js**: Provides drag-and-drop behavior specific to the hierarchical tree structure of the items.

### CSS and Styling

- **css/styles.css**:  
  - Contains the core styling for the application.
  - Utilizes responsive design principles to ensure usability across devices.
  - Complements the visual components defined in JavaScript by providing necessary layout, positioning, and theme specifics.

### Metamodels and Templates

- **metamodels/**:  
  - This folder houses various blueprint templates and model definitions used by StruML.
  - Files under `metamodels/bm/` (e.g., `artifacts.html`, `prompt_template.txt`, `metamodel.struml.json`) serve as examples and starting points for custom document creation.
  - These serve dual functions: as documentation on how to structure documents and as working templates for users and developers.

--------------------------------------------------

## Technical Details

### Technologies Used

- **Frontend**:  
  - The application is built as a single-page application (SPA) using modern JavaScript (with plans for React and TypeScript integration).
  - Emphasis on modularity and scalability.

- **UI and Styling**:  
  - Utilizes Tailwind CSS for rapid and responsive UI development.
  - shadcn/ui components provide a consistent, modern visual language.

- **Data Visualization**:  
  - D3.js is employed for interactive visualizations, allowing for dynamic matrix and heatmap presentations.

- **Drag and Drop**:  
  - dnd-kit libraries are utilized to handle drag-and-drop functionalities within the hierarchical item list.

- **Markdown Processing**:  
  - CodeMirror provides a rich text editing experience.
  - Markdown rendering is handled by Marked in combination with DOMPurify to ensure security and sanitized output.

### Design and State Management

- **Modular Architecture**:  
  - The code is organized in a modular fashion where each component or utility serves a distinct purpose. This promotes reusability and easier debugging.
  
- **State Handling**:  
  - Although currently based on plain JavaScript, the application’s state management approach is structured to transition into more robust libraries like Zustand.

### File System & Deployment

- **Local Storage**:  
  - The application stores documents and settings locally in the browser. This offers offline capability and instant load times for user data.
  
- **Deployment Strategy**:  
  - StruML is fully self-contained inside the `V0.2.0` folder.
  - Designed for deployment on GitHub Pages, ensuring users can simply open `index.html` without requiring a complex development server setup.

--------------------------------------------------

## Developer Guidelines

### Installation and Setup

1. **Cloning the Repository**:  
   - Clone the repository from GitHub into your local environment.
   - All core components adhere to the structure outlined above.

2. **Running the Application**:  
   - Open `index.html` directly in a modern web browser.
   - For development, ensure any changes are made to individual modules within the `js/` or `css/` directories, and refresh the browser to see updates.

### Code Organization & Contributing

- **Modularity**:  
  - Follow the established directory structure: keep UI components in the `js/components/` directory, state management in `js/store.js`, and core utilities in `js/utils.js`.
  
- **Coding Standards**:  
  - All code comments and documentation should be written in English.
  - Maintain consistency in style and function naming conventions.
  
- **Pull Requests & Code Reviews**:  
  - Contribute via pull requests on GitHub where detailed code reviews ensure adherence to the project’s guidelines.
  - Developers are encouraged to write tests and maintain documentation for new features or significant changes.

### Troubleshooting & Future Enhancements

- **Common Issues**:  
  - Check the browser console for error messages. Many issues stem from improper state updates or missing configuration values in `config.js`.
  
- **Future Roadmap**:  
  - Integration of React and migration to TypeScript for enhanced type safety.
  - Improvement of AI Assistant functionalities for smarter content suggestions.
  - Enhanced performance optimizations and expanded accessibility features.

--------------------------------------------------

## License

StruML is released under the MIT License. See the [LICENSE](LICENSE) file for details.

--------------------------------------------------

## Contact & Support

For issues, enhancements, or general inquiries, please open an issue on GitHub or contact the development team via the project’s support channels.

--------------------------------------------------

End of README.
