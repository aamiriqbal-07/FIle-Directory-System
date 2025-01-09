import React, { useState, useEffect } from "react";
import { getContents, createNode, deleteNode, updateNode } from "../services/api";
import File from "./File";


const FileDirectory = () => {
  const [contents, setContents] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);

  const fetchContents = async () => {
    const { data } = await getContents(parentId);
    setContents(data);
  };

  useEffect(() => {
    fetchContents();
  }, [parentId]);

  const handleCreate = async () => {
    const name = prompt("Enter name:");
    const type = prompt("Enter type (file/folder):");
    if (name && type) {
      await createNode({ name, type, parent_id: parentId });
      fetchContents();
    }
  };

  const handleRename = async (node) => {
    const name = prompt("Enter new name:", node.name);
    if (name) {
      await updateNode(node.id, { ...node, name });
      fetchContents();
    }
  };

  const handleDelete = async (id) => {
    await deleteNode(id);
    fetchContents();
  };

  const handleExpand = (node) => {
    if (node.type === "folder") {
      setParentId(node.id);
      setBreadcrumbs([...breadcrumbs, { id: node.id, name: node.name }]);
    }
  };

  const handleGoBack = () => {
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    setParentId(newBreadcrumbs[newBreadcrumbs.length - 1]?.id || null);
    setBreadcrumbs(newBreadcrumbs);
  };

  return (
    <div className="file-directory">
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id} onClick={() => setParentId(crumb.id)}>
            {crumb.name}
            {index < breadcrumbs.length - 1 && " > "}
          </span>
        ))}
      </div>
      <button onClick={handleCreate} className="create-button">Create</button>
      {breadcrumbs.length > 1 && (
        <button onClick={handleGoBack} className="back-button">Go Back</button>
      )}
      <div className="contents">
        {contents.map((node) => (
          <File
            key={node.id}
            node={node}
            onDelete={handleDelete}
            onRename={handleRename}
            onExpand={handleExpand}
          />
        ))}
      </div>
    </div>
  );
};

export default FileDirectory;
