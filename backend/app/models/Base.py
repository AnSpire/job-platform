from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass

class Base(DeclarativeBase):
    pass

class DCBase(MappedAsDataclass, Base):
    __abstract__ = True



    