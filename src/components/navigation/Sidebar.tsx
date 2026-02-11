import { useStore } from '../../store';
import type { OrgNode, HealthStatus } from '../../types';

function HealthDot({ status }: { status: HealthStatus }) {
  return <span className={`health-dot health-${status}`} title={status} />;
}

function filterTree(nodes: OrgNode[], query: string): OrgNode[] {
  if (!query) return nodes;
  const q = query.toLowerCase();
  return nodes.reduce<OrgNode[]>((acc, node) => {
    const childMatches = node.children ? filterTree(node.children, query) : [];
    if (node.name.toLowerCase().includes(q) || childMatches.length > 0) {
      acc.push({
        ...node,
        children: childMatches.length > 0 ? childMatches : node.children,
      });
    }
    return acc;
  }, []);
}

function TreeNode({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const {
    selectedOrgNodeId,
    setSelectedOrgNodeId,
    sidebarCollapsed,
    toggleSidebarNode,
    getBasketsForNode,
  } = useStore();
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = !sidebarCollapsed[node.id];
  const isSelected = selectedOrgNodeId === node.id;
  const basketCount = getBasketsForNode(node.id).length;

  return (
    <div className="tree-node">
      <div
        className={`tree-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => setSelectedOrgNodeId(node.id)}
      >
        {hasChildren ? (
          <button
            className="tree-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebarNode(node.id);
            }}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className="tree-toggle-spacer" />
        )}
        <HealthDot status={node.health} />
        <span className="tree-label">{node.name}</span>
        {basketCount > 0 && <span className="tree-badge">{basketCount}</span>}
      </div>
      {hasChildren && isExpanded && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { orgTree, sidebarSearchQuery, setSidebarSearchQuery, selectedOrgNodeId, setSelectedOrgNodeId } = useStore();
  const filtered = filterTree(orgTree, sidebarSearchQuery);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Organization</h3>
      </div>
      <div className="sidebar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search units..."
          value={sidebarSearchQuery}
          onChange={(e) => setSidebarSearchQuery(e.target.value)}
        />
      </div>
      {selectedOrgNodeId && (
        <button className="sidebar-clear" onClick={() => setSelectedOrgNodeId(null)}>
          Show all units
        </button>
      )}
      <div className="sidebar-tree">
        {filtered.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
        {filtered.length === 0 && (
          <div className="tree-empty">No matching units</div>
        )}
      </div>
    </aside>
  );
}
