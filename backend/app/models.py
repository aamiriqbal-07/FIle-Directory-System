from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # Specify length for VARCHAR
    type = Column(String(50), nullable=False)   # Specify length for VARCHAR
    parent_id = Column(Integer, ForeignKey("nodes.id"), nullable=True)

    parent = relationship("Node", remote_side=[id], backref="children")
