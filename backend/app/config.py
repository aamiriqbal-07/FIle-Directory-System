import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:12345@db/file_directory")
    APP_NAME = "File Directory API"
    DEBUG = True
