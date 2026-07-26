# Tiling Window Manager Simulator

A dynamic, interactive simulator of a tiling window manager using Binary Space Partition (BSP) layout algorithms, similar to popular Linux window managers like [i3](https://i3wm.org/), [dwm](https://dwm.suckless.org/), and [bspwm](https://github.com/baskerville/bspwm).

## Features

- **Binary Space Partition (BSP) Algorithm**: Windows are organized in a binary tree structure where each node represents a split (either horizontal or vertical)
- **Interactive Canvas**: Real-time visualization of window layout with color-coded windows
- **Dynamic Splitting**: Add windows and watch as they automatically split and resize based on the BSP algorithm
- **Layout Modes**: Switch between different layout strategies (BSP, Columns, Rows)
- **Live Statistics**: Track window count, tree depth, active split direction, and current layout mode
- **Grid Visualization**: Optional grid overlay for better understanding of layout structure
- **Click-to-Focus**: Click on windows to focus them (visual indicator with golden border)

## What is a Tiling Window Manager?

A tiling window manager is a system that automatically arranges windows on the screen without overlapping. Instead of manually dragging and resizing windows, the manager handles placement automatically based on predefined algorithms.

**Key Characteristics:**
- Windows never overlap (fully tiled)
- Keyboard-driven instead of mouse-driven
- Highly scriptable and customizable
- Automatic window management reduces manual overhead

## How BSP Works

The Binary Space Partition algorithm recursively divides screen space into rectangles:

1. Start with the entire screen as a single rectangle
2. When adding a window, split the focused area either vertically or horizontally
3. Each split creates two child nodes (left/right for vertical, top/bottom for horizontal)
4. Continue until all windows are placed in leaf nodes

**Advantages:**
- Maximizes screen usage with no wasted space
- Predictable and controllable window placement
- Supports arbitrary window sizes and ratios
- Balanced tree structure for consistent performance

## Usage

### Getting Started

1. Open `index.html` in a modern web browser
2. Use the control buttons to add windows and explore the layout

### Controls

- **Add Window**: Click the button or press Enter to add a new window
- **Clear All**: Reset the layout and remove all windows
- **Toggle Layout**: Switch between layout modes (BSP, Columns, Rows)
- **Toggle Grid**: Show/hide the visualization grid
- **Click Window**: Click on any window to focus it (shown with golden border)
- **Keyboard**: Press 'v' for vertical split, 'h' for horizontal split

### Understanding the Visualization

- **Colored Rectangles**: Each window with a unique color
- **Golden Border**: Indicates the currently focused window
- **Blue Dashed Lines**: Show split boundaries in the tree structure
- **Grid Background**: Optional grid to show alignment

## Technical Details

### File Structure

- `index.html`: Main HTML interface with canvas and controls
- `tiling-manager.js`: Core implementation of the tiling window manager
- `package.json`: Project metadata and dependencies

### Key Classes

**TreeNode**
- Represents a node in the BSP tree
- Stores rectangle boundaries, split direction, and window data
- Methods: `isLeaf()`, `getDepth()`, `countWindows()`

**TilingWindowManager**
- Main orchestrator for window management
- Handles adding windows, splitting, and rendering
- Supports multiple layout modes
- Methods: `addWindow()`, `splitNode()`, `toggleLayout()`, `drawOnCanvas()`

### Rendering

- Uses HTML5 Canvas API for efficient rendering
- Draws windows with distinct colors for visual clarity
- Renders split boundaries with dashed lines
- Scales viewport to fit browser window

## Algorithm Complexity

- **Add Window**: O(log n) where n is the number of windows (tree operations)
- **Render**: O(n) where n is the number of windows (visit each node)
- **Layout Change**: O(n) for collecting and redistributing windows
- **Space**: O(n) for storing the tree structure

## Design Decisions

1. **Single Tree Per Manager**: One global BSP tree manages all windows (simpler than per-monitor trees)
2. **Color Scheme**: Predefined palette for consistent, distinguishable colors
3. **Canvas Rendering**: Direct canvas drawing provides smooth performance vs. DOM manipulation
4. **Alternating Split Direction**: Simplifies decision logic (could be enhanced with smarter heuristics)
5. **No Window Persistence**: Windows exist only in the current session (educational simulator, not a production WM)

## Future Enhancements

- Persistent window state (localStorage)
- Advanced split algorithms (golden ratio, Fibonacci)
- Window drag-and-drop reordering
- Multi-monitor support
- Configurable keybindings
- Test suite for tree operations
- Animation transitions during splits
- Master/stack ratio adjustments

## Learning Resources

- [i3 Documentation](https://i3wm.org/docs/)
- [bspwm Manual](https://github.com/baskerville/bspwm/blob/master/README.md)
- [Binary Search Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BST.html)
- [Tree Data Structures in JavaScript](https://www.geeksforgeeks.org/implementation-binary-search-tree-javascript/)

## License

MIT License - Feel free to use, modify, and distribute

---

**Author**: Mohammad Hossinzehi

Inspired by modern tiling window managers and the elegance of algorithmic layout design.
