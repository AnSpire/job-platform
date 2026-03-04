# app/models/__init__.py
from .Base import Base, DCBase
from .User import User
from .Student import Student
from .Company import Company
from .Employer import Employer
from .Resume import Resume
from .Vacancy import Vacancy
from .VacancyTranslation import VacancyTranslation
from .Application import Application
from .SavedVacancy import SavedVacancy
from .Interview import Interview
from .Notification import Notification

__all__ = [
    "Base",
    "DCBase",
    "User",
    "Student",
    "Company",
    "Employer",
    "Resume",
    "VacancyTranslation",
    "Vacancy",
    "Application",
    "SavedVacancy",
    "Interview",
    "Notification",
]
