from passlib.context import CryptContext

pwd_contex = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_contex.hash(password)

def check_password(password:str, password_hash: str) -> bool:
    return pwd_contex.verify(password, password_hash)