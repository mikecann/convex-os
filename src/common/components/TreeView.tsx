import React from 'react';

interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
  expandable?: boolean;
  defaultExpanded?: boolean;
}

interface TreeViewProps {
  nodes: TreeNode[];
  className?: string;
}

interface TreeNodeProps {
  node: TreeNode;
  level?: number;
}

function TreeNodeComponent({ node, level = 0 }: TreeNodeProps) {
  if (!node.children || node.children.length === 0) 
    return <li>{node.label}</li>;
  

  if (node.expandable) 
    return (
      <li>
        <details open={node.defaultExpanded}>
          <summary>{node.label}</summary>
          <ul>
            {node.children.map(child => (
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </ul>
        </details>
      </li>
    );
  

  return (
    <li>
      {node.label}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map(child => (
            <TreeNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({ nodes, className = '' }: TreeViewProps) {
  return (
    <ul className={`tree-view ${className}`}>
      {nodes.map(node => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </ul>
  );
}
