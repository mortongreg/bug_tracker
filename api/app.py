from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .model import db
import pprint

def create_app():
    """Construct the core application."""
    app = Flask(__name__)
    app.secret_key = "hello"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    
    db.init_app(app)


    with app.app_context():
        from . import routes  # Import routes
        from .model import Issue
        from .model import User 
        

        db.create_all()  # Create database tables for our data models
        db.session.commit()
        return app

app = create_app()

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)