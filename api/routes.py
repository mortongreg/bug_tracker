from flask import request
from pprint import pprint
from datetime import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
import json
from .model import Issue
from .model import Comment
db = SQLAlchemy()


@app.route('/create_user', methods=["POST", "GET"])
def create_user():
    return "USer Created"


@app.route('/change_password', methods=["POST", "GET"])
def set_password():
    return "Password Change"


@app.route('/get_user', methods=["POST", "GET"])
def get_user():
    return "User gotten"


@app.route('/update_user', methods=["POST", "GET"])
def update_user():
    return "User updated"


@app.route('/delete_user', methods=["POST", "GET"])
def delete_user():
    return "User delted"


@app.route('/list_users', methods=["POST", "GET"])
def list_users():
    return "Users listed"


@app.route('/create_issue', methods=["POST", "GET"])
def create_issue():
    if request.method == "POST":
        pprint(request.form)
        issue = Issue()

        issue.title = request.form['title']
        issue.status = request.form['status']
        issue.description = request.form['description']
        issue.assigned_to = request.form['assigned_to'] if "assigned_to" in request.form != None else None

        db.session.add(issue)
        db.session.commit()

        return "Issue created"
    else:
        return "YOU ARE FORBIDDEN FROM THIS"


@app.route('/get_issue', methods=["POST", "GET"])
def get_issue():
    if request.method == "POST":
        pprint(request.form)
        id = request.form['id'] if "id" in request.form else None
        issue = Issue.query.get(id).__dict__
        issue.pop('_sa_instance_state', None)
        issue_json = json.dumps(issue, indent=4, sort_keys=True, default=str)
        pprint(issue_json)
        return issue_json
    else:
        return "YOU ARE FORBIDDEN FROM THIS"

    return "Issue gotten"


@app.route('/update_issue', methods=["POST", "GET"])
def update_issue():
    return "Updated Issue"


@app.route('/delete_issue', methods=["POST", "GET"])
def delete_issue():
    if request.method == "POST":
        pprint(request.form)
        issue_id = request.form['id'] if "id" in request.form else None
        issue = db.session.query(Issue).filter_by(id=issue_id).one()
        db.session.delete(issue)
        db.session.commit()
        return str(issue_id) + " has been deleted"
    else:
        return "YOU ARE FORBIDDEN FROM THIS"

    return "YOU ARE FORBIDDEN FROM THIS"


@app.route('/list_issues', methods=["POST", "GET"])
def list_issues():
    if request.method == "POST":
        json_result = "[ \n"
        issues = Issue.query.all()
        for issue in issues:
            issue = issue.__dict__
            issue.pop('_sa_instance_state', None)
            issue_json = json.dumps(
                issue, indent=4, sort_keys=True, default=str)
            json_result += issue_json+","
        json_result = json_result[:-1] + "\n]"
        return json_result
    else:
        return "YOU ARE FORBIDDEN FROM THIS"


@app.route('/create_comment', methods=["POST", "GET"])
def create_comment():
    if request.method == "POST":
        pprint(request.form)
        comment = Comment()

        comment.left_by = request.form['left_by']
        comment.data = request.form['data']
        comment.issue = request.form['issue']

        db.session.add(comment)
        db.session.commit()

        return "Comment Created"
    else:
        return "YOU ARE FORBIDDEN FROM THIS"


@app.route('/get_comment', methods=["POST", "GET"])
def get_comment():
    if request.method == "POST":
        pprint(request.form)
        id = request.form['id'] if "id" in request.form else None
        comment = Comment.query.get(id).__dict__
        comment.pop('_sa_instance_state', None)
        comment_json = json.dumps(
            comment, indent=4, sort_keys=True, default=str)
        pprint(comment_json)
        return comment_json
    else:
        return "YOU ARE FORBIDDEN FROM THIS"

    return "Comment gotten"


@app.route('/update_comment', methods=["POST", "GET"])
def update_comment():
    return "Comment updated"


@app.route('/delete_comment', methods=["POST", "GET"])
def delete_comment():
    if request.method == "POST":
        pprint(request.form)
        comment_id = request.form['id'] if "id" in request.form else None
        comment = db.session.query(Comment).filter_by(id=comment_id).one()
        db.session.delete(comment)
        db.session.commit()
        return str(comment_id) + " has been deleted"
    else:
        return "YOU ARE FORBIDDEN FROM THIS"

    return "YOU ARE FORBIDDEN FROM THIS"


@app.route('/list_comments', methods=["POST", "GET"])
def list_comments():
    if request.method == "POST":
        json_result = "[ \n"
        comments = Comment.query.filter_by(issue=request.form['issue_id'])
        for comment in comments:
            comment = comment.__dict__
            comment.pop('_sa_instance_state', None)
            comment_json = json.dumps(
                comment, indent=4, sort_keys=True, default=str)
            json_result += comment_json+","
        json_result = json_result[:-1] + "\n]"
        print(json_result)
        return json_result
    else:
        return "YOU ARE FORBIDDEN FROM THIS"

    return "Comments listed"


@app.route('/')
def hello_world():
    return 'Hello, World!'
