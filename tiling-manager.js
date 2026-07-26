// Tiling Window Manager Simulator
// Implements a Binary Space Partition (BSP) tiling algorithm

class TreeNode {
  constructor(rect, parent = null) {
    this.rect = rect;
    this.parent = parent;
    this.left = null;
    this.right = null;
    this.window = null;
    this.split = null; // 'v' for vertical, 'h' for horizontal
  }

  isLeaf() {
    return !this.left && !this.right;
  }

  getDepth() {
    if (this.isLeaf()) return 0;
    return 1 + Math.max(this.left.getDepth(), this.right.getDepth());
  }

  countWindows() {
    if (this.isLeaf()) return this.window ? 1 : 0;
    return (this.left?.countWindows() || 0) + (this.right?.countWindows() || 0);
  }
}

class TilingWindowManager {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.root = new TreeNode({ x: 0, y: 0, w: width, h: height });
    this.focusedNode = this.root;
    this.nextSplitDir = 'v'; // 'v' for vertical, 'h' for horizontal
    this.layoutMode = 'BSP'; // 'BSP', 'Columns', 'Rows'
    this.colorScheme = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    this.windowId = 0;
    this.showGrid = false;
  }

  addWindow() {
    if (!this.focusedNode.isLeaf()) {
      this.focusedNode = this.getFirstLeaf(this.focusedNode);
    }

    if (!this.focusedNode.window) {
      this.focusedNode.window = {
        id: this.windowId++,
        color: this.colorScheme[this.windowId % this.colorScheme.length]
      };
    } else {
      this.splitNode(this.focusedNode, this.nextSplitDir);
    }
  }

  splitNode(node, direction) {
    if (!node.isLeaf()) return;

    const { x, y, w, h } = node.rect;
    node.split = direction;
    node.window = null;

    if (direction === 'v') {
      const mid = x + w / 2;
      node.left = new TreeNode({ x, y, w: w / 2, h }, node);
      node.right = new TreeNode({ x: mid, y, w: w / 2, h }, node);
    } else {
      const mid = y + h / 2;
      node.left = new TreeNode({ x, y, w, h: h / 2 }, node);
      node.right = new TreeNode({ x, y: mid, w, h: h / 2 }, node);
    }

    node.left.window = { id: this.windowId++, color: this.colorScheme[this.windowId % this.colorScheme.length] };
    this.focusedNode = node.right;
  }

  getFirstLeaf(node) {
    if (node.isLeaf()) return node;
    return this.getFirstLeaf(node.left);
  }

  clear() {
    this.root = new TreeNode({ x: 0, y: 0, w: this.width, h: this.height });
    this.focusedNode = this.root;
    this.windowId = 0;
  }

  toggleLayout() {
    const layouts = ['BSP', 'Columns', 'Rows'];
    const idx = layouts.indexOf(this.layoutMode);
    this.layoutMode = layouts[(idx + 1) % layouts.length];
    this.rebalance();
  }

  rebalance() {
    // Simple rebalancing: collect all windows and redistribute
    const windows = this.collectAllWindows(this.root);
    this.clear();
    windows.forEach(() => this.addWindow());
  }

  collectAllWindows(node) {
    if (node.isLeaf() && node.window) return [node.window];
    if (node.isLeaf()) return [];
    return [...(this.collectAllWindows(node.left) || []), ...(this.collectAllWindows(node.right) || [])];
  }

  drawOnCanvas(ctx, w, h) {
    ctx.fillStyle = '#252526';
    ctx.fillRect(0, 0, w, h);

    if (this.showGrid) {
      ctx.strokeStyle = '#3e3e42';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    }

    this.drawNode(ctx, this.root, w, h);
  }

  drawNode(ctx, node, w, h) {
    const { x, y, w: nw, h: nh } = node.rect;
    const scale = Math.min(w / this.width, h / this.height);
    const sx = x * scale, sy = y * scale;
    const sw = nw * scale, sh = nh * scale;

    if (node.isLeaf()) {
      if (node.window) {
        ctx.fillStyle = node.window.color;
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = node === this.focusedNode ? '#FFD700' : '#666';
        ctx.lineWidth = node === this.focusedNode ? 3 : 1;
        ctx.strokeRect(sx, sy, sw, sh);

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.fillText('Window #' + node.window.id, sx + 10, sy + 20);
      } else {
        ctx.fillStyle = '#3e3e42';
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, sy, sw, sh);
      }
    } else {
      this.drawNode(ctx, node.left, w, h);
      this.drawNode(ctx, node.right, w, h);
      ctx.strokeStyle = '#007acc';
      ctx.lineWidth = 2;
      if (node.split === 'v') {
        const mid = (sx + sx + sw) / 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(mid, sy);
        ctx.lineTo(mid, sy + sh);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        const mid = (sy + sy + sh) / 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(sx, mid);
        ctx.lineTo(sx + sw, mid);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  getStats() {
    return {
      windows: this.root.countWindows(),
      depth: this.root.getDepth(),
      split: this.nextSplitDir === 'v' ? 'Vertical' : 'Horizontal',
      layout: this.layoutMode
    };
  }
}

// Global manager instance
const canvas = document.getElementById('canvas');
const canvasContainer = canvas.parentElement;
const manager = new TilingWindowManager(800, 600);

function resizeCanvas() {
  canvas.width = canvasContainer.clientWidth;
  canvas.height = 600;
}

function render() {
  resizeCanvas();
  const ctx = canvas.getContext('2d');
  manager.drawOnCanvas(ctx, canvas.width, canvas.height);
  updateStats();
}

function updateStats() {
  const stats = manager.getStats();
  document.getElementById('windowCount').textContent = stats.windows;
  document.getElementById('treeDepth').textContent = stats.depth;
  document.getElementById('activeSplit').textContent = stats.split;
  document.getElementById('layoutMode').textContent = stats.layout;
}

function addWindow() {
  manager.addWindow();
  render();
}

function clearAll() {
  manager.clear();
  render();
}

function toggleLayout() {
  manager.toggleLayout();
  render();
}

function toggleVisualization() {
  manager.showGrid = !manager.showGrid;
  render();
}

// Event listeners
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Focus window at click location
  const node = manager.findNodeAt(x / canvas.width * 800, y / canvas.height * 600);
  if (node) manager.focusedNode = node;
  render();
});

// Add findNodeAt method to manager
TilingWindowManager.prototype.findNodeAt = function(x, y) {
  const find = (node) => {
    const { rect } = node;
    if (x < rect.x || x > rect.x + rect.w || y < rect.y || y > rect.y + rect.h) return null;
    if (node.isLeaf()) return node;
    const left = find(node.left);
    return left || find(node.right);
  };
  return find(this.root);
};

window.addEventListener('resize', render);
document.addEventListener('keydown', (e) => {
  if (e.key === 'v') manager.nextSplitDir = 'v';
  if (e.key === 'h') manager.nextSplitDir = 'h';
  if (e.key === 'Enter') addWindow();
  if (e.key === 'Escape') clearAll();
});

// Initial render
render();
