from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    issues = db.relationship('Issue',backref="user",lazy=True)
    comments = db.relationship('Comment',backref="user",lazy=True)
       
    def __repr__(self):
        return '<User %r>' % self.username

class Issue(db.Model):
    """Data model for Issues"""
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    title = db.Column(
        db.String(255),
        nullable=False
    )
    status = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )
    description = db.Column(
        db.String(255),
        nullable=False
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=True
    )
 
    comments = db.relationship('Comment',backref="Issue",lazy=True,cascade="all, delete-orphan")
    
    date_created = db.Column(
        db.DateTime(),
        default=datetime.now(),
        nullable=False
    )
    date_modified = db.Column(
        db.DateTime(),
        default=datetime.now(),
        nullable=False
    )
    date_complete = db.Column(
        db.DateTime(),
        nullable=True
    )

    def __repr__(self):
            return str(self.id) + " " + self.title

class Comment(db.Model):
    """Data model for Comments"""
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    #Will need to create some check
    left_by = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )
    issue = db.Column(
        db.Integer,
        db.ForeignKey('issue.id'),
        nullable=False
    )
    data = db.Column(
        db.String(1024),
    )
    date_created = db.Column(
        db.DateTime(),
        default=datetime.now(),
        nullable=False
    )
    date_modified = db.Column(
        db.DateTime(),
        default=datetime.now(),
        nullable=False
    )
    
