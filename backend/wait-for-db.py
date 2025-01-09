import time
import pymysql
from app.config import Config

def wait_for_database():
    while True:
        try:
            # Try to connect to the database
            connection = pymysql.connect(
                host="db",
                user="root",
                password="12345",
                database="file_directory"
            )
            connection.close()
            print("Database connection successful!")
            break
        except pymysql.Error as e:
            print("Waiting for database...")
            time.sleep(1)

if __name__ == "__main__":
    wait_for_database()