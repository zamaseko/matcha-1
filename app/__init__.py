from flask import Flask
from config import Config
from db import DB

app = Flask(__name__)
app.config.from_object(Config)
db = DB(Config.logins, Config.db)

from app.models import user
u = user()
from app import commands
from app import routes
