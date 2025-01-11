import React, { useState, useEffect } from "react";
import { getContents, createNode, deleteNode, updateNode } from "../services/api";
import { 
  FolderIcon, 
  FileIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  ChevronRightIcon 
} from "lucide-react";
import "../styles/FileDirectory.css";

const FileDirectory = () => {
  const [contents, setContents] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchContents = async () => {
      const { data } = await getContents();
      setContents(data);
    };
    fetchContents();
  }, []);

  
  const toggleExpand = async (node) => {
    if (expanded[node.id]) {
      setExpanded((prev) => ({ ...prev, [node.id]: false }));
    } else {
      try {
        const { data } = await getContents(node.id);
        const updateNodeInTree = (nodes, targetId, newChildren) => {
          return nodes.map(n => {
            if (n.id === targetId) {
              return { ...n, children: newChildren };
            }
            if (n.children) {
              return { ...n, children: updateNodeInTree(n.children, targetId, newChildren) };
            }
            return n;
          });
        };

        setContents(prevContents => updateNodeInTree(prevContents, node.id, data));
        setExpanded((prev) => ({ ...prev, [node.id]: true }));
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    }
  };

  // Helper function to recursively expand all parent folders
  const expandParents = async (parentId) => {
    if (!parentId) return;
  
    try {
      const { data } = await getContents(parentId);
      setContents((prevContents) => {
        const updateNodeInTree = (nodes, targetId, newChildren) => {
          return nodes.map((node) => {
            if (node.id === targetId) {
              return { ...node, children: newChildren };
            }
            if (node.children) {
              return { ...node, children: updateNodeInTree(node.children, targetId, newChildren) };
            }
            return node;
          });
        };
        return updateNodeInTree(prevContents, parentId, data);
      });
  
      setExpanded((prev) => ({ ...prev, [parentId]: true }));
  
      // Recursively expand parents
      const findNodeById = (nodes, targetId) => {
        for (const node of nodes) {
          if (node.id === targetId) return node;
          if (node.children) {
            const found = findNodeById(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };
  
      const parentNode = findNodeById(contents, parentId);
      if (parentNode?.parent_id) {
        await expandParents(parentNode.parent_id);
      }
    } catch (error) {
      console.error("Error expanding parents:", error);
    }
  };
  

  const handleCreate = async (parentId = null) => {
    const name = prompt("Enter name:");
    const type = prompt("Enter type (file/folder):");
    if (name && (type === "file" || type === "folder")) {
      try {
        await createNode({ name, type, parent_id: parentId });
        if (parentId === null) {
          const { data } = await getContents(null);
          setContents(data);
        } else {
          // Ensure parent folder is expanded and its contents are updated
          await expandParents(parentId);
        }
      } catch (error) {
        console.error("Error creating node:", error);
      }
    }
  };

  const handleRename = async (node) => {
    const newName = prompt("Enter new name:", node.name);
    if (newName && newName !== node.name) {
      try {
        await updateNode(node.id, { name: newName, type: node.type });
  
        setContents((prevContents) => {
          const updateNodeInTree = (nodes) => {
            return nodes.map((n) => {
              if (n.id === node.id) {
                return { ...n, name: newName };
              }
              if (n.children) {
                return { ...n, children: updateNodeInTree(n.children) };
              }
              return n;
            });
          };
          return updateNodeInTree(prevContents);
        });
      } catch (error) {
        console.error("Error renaming node:", error);
      }
    }
  };
  

  const handleDelete = async (node) => {
    if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
      try {
        await deleteNode(node.id);
        if (node.parent_id) {
          // Ensure parent folder is expanded and its contents are updated
          await expandParents(node.parent_id);
        } else {
          const { data } = await getContents(null);
          setContents(data);
        }
      } catch (error) {
        console.error("Error deleting node:", error);
      }
    }
  };

  const renderNode = (node) => (
    <div key={node.id} className="node-group">
      <div className="node-content">
        <div className="node-main">
          {node.type === "folder" ? (
            <button
              onClick={() => toggleExpand(node)}
              className="node-button"
            >
              <span>
                {expanded[node.id] ? (
                  <ChevronDownIcon className="chevron-icon folder-icon" />
                ) : (
                  <ChevronRightIcon className="chevron-icon folder-icon" />
                )}
              </span>
              <FolderIcon className="node-icon folder-icon" />
              <span className="node-text">{node.name}</span>
            </button>
          ) : (
            <div className="node-button">
              <FileIcon className="node-icon file-icon" />
              <span className="node-text">{node.name}</span>
            </div>
          )}
        </div>
        
        <div className="node-actions">
          <button
            onClick={() => handleRename(node)}
            className="action-button"
          >
            <PencilIcon className="action-icon" />
          </button>
          <button
            onClick={() => handleDelete(node)}
            className="action-button"
          >
            <TrashIcon className="action-icon" />
          </button>
          {node.type === "folder" && (
            <button
              onClick={() => handleCreate(node.id)}
              className="action-button"
            >
              <PlusIcon className="action-icon" />
            </button>
          )}
        </div>
      </div>
      
      {expanded[node.id] && node.children && (
        <div className="children-container">
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="file-directory-container">
      <div className="file-directory-wrapper">
        <div className="file-directory-header">
          <h1 className="file-directory-title">File Directory</h1>
          <button
            onClick={() => handleCreate(null)}
            className="root-create-button"
          >
            <PlusIcon className="action-icon" />
            Create New
          </button>
        </div>
        <div className="file-directory-content">
          <div className="file-list">
            {contents.map((node) => renderNode(node))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDirectory;