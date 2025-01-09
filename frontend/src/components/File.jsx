import React from "react";
import { FaFolder, FaFile, FaTrash, FaEdit } from "react-icons/fa";

const File = ({ node, onDelete, onRename, onExpand }) => {
  return (
    <div className="file-item">
      {node.type === "folder" ? (
        <FaFolder onClick={() => onExpand(node)} className="icon folder-icon" />
      ) : (
        <FaFile className="icon file-icon" />
      )}
      <span className="file-name">{node.name}</span>
      <FaEdit onClick={() => onRename(node)} className="icon edit-icon" />
      <FaTrash onClick={() => onDelete(node.id)} className="icon delete-icon" />
    </div>
  );
};

export default File;
