from sqlalchemy.orm import Session
from app.models import Node
from fastapi import HTTPException

def create_node(db: Session, name: str, type: str, parent_id: int = None):
    # Validate type
    if type not in ["file", "folder"]:
        raise HTTPException(status_code=400, detail="Invalid node type. Must be 'file' or 'folder'.")

    # If the database is empty and parent_id is None, allow creating the first node
    if parent_id is None and not db.query(Node).first():
        node = Node(name=name, type=type, parent_id=None)
    else:
        # Ensure parent exists if parent_id is specified
        if parent_id is not None and not db.query(Node).filter(Node.id == parent_id).first():
            raise HTTPException(status_code=404, detail="Parent node not found.")
        node = Node(name=name, type=type, parent_id=parent_id)

    db.add(node)
    db.commit()
    db.refresh(node)
    return node


def get_nodes(db: Session, parent_id: int = None):
    return db.query(Node).filter(Node.parent_id == parent_id).all()

def update_node(db: Session, node_id: int, new_name: str, new_type: str):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Content node not found")

    if new_type != node.type:
        raise HTTPException(status_code=422, detail="Cannot change the type of the node")

    node.name = new_name
    node.type = new_type
    db.commit()
    db.refresh(node)

    return node

def migrate_node(db: Session, node_id: int, parent_id: int):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Content node not found")

    if parent_id == node.parent_id:
        raise HTTPException(status_code=405, detail="Content already present in the directory")

    node.parent_id = parent_id

    db.commit()
    db.refresh(node)

    return node

def delete_node(db: Session, node_id: int):
    """
    Deletes a node. If the node is a directory, recursively deletes all its children and sub-children.

    :param db: Database session
    :param node_id: ID of the node to be deleted
    """
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Content node not found")

    if node.type == "folder":
        children = db.query(Node).filter(Node.parent_id == node.id).all()
        for child in children:
            delete_node(db, child.id)

    # Delete the node itself
    db.delete(node)
    db.commit()

def get_nodes_recursively(db: Session, parent_id: int = None):
    nodes = db.query(Node).filter(Node.parent_id == parent_id).all()
    for node in nodes:
        if node.type == "folder":
            node.children = get_nodes_recursively(db, node.id)
    return nodes

