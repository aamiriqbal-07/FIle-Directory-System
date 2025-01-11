from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crud import create_node, get_nodes, update_node, delete_node, migrate_node, get_nodes_recursively
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from typing import Literal
class NodeCreate(BaseModel):
    name: str
    type: Literal['file', 'folder']
    parent_id: Optional[int] = None  # Allow parent_id to be optional and None

class NodeUpdate(BaseModel):
    name: str
    type: str

class NodeMigrate(BaseModel):
    parent_id: int

@router.get("/nodes/")
def read_nodes(parent_id: int = None, db: Session = Depends(get_db)):
    return get_nodes(db, parent_id)

@router.get("/expand-nodes/")
def read_nodes(parent_id: int = None, db: Session = Depends(get_db)):
    return get_nodes_recursively(db, parent_id)

@router.post("/nodes/")
def add_node(node: NodeCreate, db: Session = Depends(get_db)):
    return create_node(db, node.name, node.type, node.parent_id)

@router.put("/nodes/{node_id}/")
def modify_node(node_id: int, node: NodeUpdate, db: Session = Depends(get_db)):
    updated_node = update_node(db, node_id, node.name, node.type)  # Pass both name and type
    if not updated_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return updated_node

@router.delete("/nodes/{node_id}/")
def remove_node(node_id: int, db: Session = Depends(get_db)):
    delete_node(db, node_id)
    return {"message": "Node deleted"}

@router.put("/migrate-node/{node_id}/")
def migrate_node(node_id: int, node: NodeMigrate, db: Session = Depends(get_db)):
    migrate_node(db, node_id, node.parent_id)
    return {"message": "Node moved"}


