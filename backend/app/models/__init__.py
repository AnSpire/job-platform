# app/models/__init__.py
from .Base import Base, DCBase
from .User import User
from .Student import Student
from .Company import Company
from .Employer import Employer
from .Resume import Resume
from .Vacancy import Vacancy
from .Application import Application

__all__ = [
    "Base",
    "DCBase",
    "User",
    "Student",
    "Company",
    "Employer",
    "Resume",
    "Vacancy",
    "Application",
]
