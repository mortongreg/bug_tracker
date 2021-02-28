import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/Button';
import Media from 'react-bootstrap/Media';
import React, { Component } from 'react'


export class Issue extends React.Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
            <tr onClick={this.props.onClick} >
                <td>{this.props.id}</td>
                <td>{this.props.title}</td>
                <td>{this.props.status}</td>
                <td>{this.props.user}</td>
            </tr>
        );
    }
}

export class IssueTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isFetching: false,
            issues: [],
        };
    }
    componentDidMount() {
        this.fetchIssues();
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    fetchIssuesWithAPI = () => {
        this.setState({ ...this.state, isFetching: true });

        fetch("http://127.0.0.1:5000/list_issues", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            mode: "cors"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ issues: result, isFetching: false })
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });
    }
    fetchIssues = this.fetchIssuesWithAPI;


    render() {
        if (this.state.isFetching == false) {
            return (
                <div className="Content col-8" >
                    <header className="Content-header">
                        <input type="text" placeholder="Search.." />
                    </header>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Case #</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.issues.map((issue) => (
                                    <Issue
                                        onClick={() => { this.props.issueClicked(issue.id) }}
                                        id={issue.id}
                                        title={issue.title}
                                        status={issue.status}
                                        user={issue.assigned_to}
                                        key={issue.id}
                                    />
                                ))
                            }

                        </tbody>
                    </Table>
                </div>
            );
        }
        else {

            return (
                <p>LoadingTable...</p>
            );
        }
    }
}


export class ViewIssueForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isFetching: false,
            issueID: props.issueID,
            issueTitle: props.title,
            issueStatus: props.status,
            issueUser: props.user,
            editingIssue: false,
            editingComment: false,
            editingCommentID: null,
            editingCommentData:"",
            comments: [],
            commenting: false,
            commentSubmitted: false,
            commentData: ""

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);

        //this.handleIssueChange = this.handleIssueChange.bind(this);
        this.handleIssueSubmit = this.handleIssueSubmit.bind(this);
        this.handleEditCommentSubmit = this.handleEditCommentSubmit.bind(this);


    }
    componentDidMount() {
        this.fetchIssueWithAPI();
        this.fetchCommentsWithAPI();
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    handleIssueSubmit(event) {
        console.log("CLICKED " + this.state.commentData + "ID: " + this.state.issueID);
        event.preventDefault();
        fetch("http://127.0.0.1:5000/update_issue", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "id=" + this.state.issueID + "&title=" + this.state.issueTitle + "&description=" + this.state.issueDescription,
            method: "POST",
            mode: "cors"
        })
            .then(result => {
                this.setState({ editingIssue: false })
                this.fetchIssueWithAPI();
                this.fetchCommentsWithAPI();
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });


    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleCommentSubmit(event) {

        console.log("CLICKED " + this.state.commentData + "ID: " + this.state.issueID);
        event.preventDefault();
        fetch("http://127.0.0.1:5000/create_comment", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "left_by=1&issue=" + this.state.issueID + "&data='" + this.state.commentData + "'",
            method: "POST",
            mode: "cors"
        })
            .then(result => {
                this.setState({ commentSubmitted: true, commenting: false })
                this.fetchCommentsWithAPI();
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });

    }



    /////////////////

    fetchIssueWithAPI = () => {
        this.setState({ ...this.state, isFetching: true });

        fetch("http://127.0.0.1:5000/get_issue", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "id=" + this.state.issueID,
            method: "POST",
            mode: "cors"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ issueTitle: result.title, issueDescription: result.description, issueStatus: result.status })
                console.log("HERE:" + this.state.issueTitle);
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });

    }
    fetchIssue = this.fetchIssueWithAPI;


    ///////////////////////////////

    fetchCommentsWithAPI = () => {
        this.setState({ ...this.state, isFetching: true });

        fetch("http://127.0.0.1:5000/list_comments", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "issue_id=" + this.state.issueID,
            method: "POST",
            mode: "cors"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ comments: result, isFetching: false })
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });

    }
    fetchComments = this.fetchCommentsWithAPI;


    addComment(event) {
        console.log("CLICKED THE ADD COMMENT")
        this.setState({ commenting: !this.state.commenting })
    }

    editIssue(event) {
        this.setState({ editingIssue: !this.state.editingIssue })
    }

    Commenting(id) {
        if (this.state.commenting) {
            return (
                <Form onSubmit={this.handleCommentSubmit}>
                    <Form.Group controlId="formBasicText">
                        <Form.Control name="commentData" value={this.state.commentData} onChange={this.handleChange} type="text" placeholder="data" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
              </Button>
                </Form>
            );

        }
        else {
            return (<Button className="button" onClick={this.addComment.bind(this)}>Add Comment</Button>);
        }
    }
    EditingIssue() {
        if (this.state.editingIssue == true) {
            return (
                <div>
                    <Form onSubmit={this.handleIssueSubmit}>
                        <Form.Group controlId="formBasicText">

                            <Form.Control name="issueTitle" value={this.state.issueTitle} onChange={this.handleChange} type="text" placeholder="data" />
                            <Form.Control name="issueDescription" value={this.state.issueDescription} onChange={this.handleChange} type="text" placeholder="data" />

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button variant="primary" type="cancel">Cancel</Button>
                        </Form.Group>
                    </Form>
                </div>
            );

        }
        else {
            return (
                <div>
                    <h5>
                        {this.state.issueTitle}
                    </h5>
                    <p>
                        {this.state.issueDescription}
                    </p>

                    <Button className="button" onClick={this.editIssue.bind(this)}>Edit Issue</Button>
                </div>
            );
        }
    }

    onEditComment(id) {

        this.setState({ editingComment: true, editingCommentID: id })
        console.log(id);
    }

    handleEditCommentSubmit(event,data) {
        event.preventDefault();
        console.log("Frick"+data +" " + this.state.editingCommentID)

        /*console.log("Submit this edit event" + data);
        */

        fetch("http://127.0.0.1:5000/update_comment", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "id=" + this.state.editingCommentID + "&data=" + data,
            method: "POST",
            mode: "cors"
        })
            .then(result => {
                this.setState({ editingComment: false,editingCommentID: null })
                this.fetchIssueWithAPI();
                this.fetchCommentsWithAPI();
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });

    }

    render() {
        if (this.state.isFetching == false) {
            const commenting = this.Commenting(this.state.issueID);
            const editingIssue = this.EditingIssue();
            return (
                <div className="Content col-8" >
                    <Media>
                        {/*        <img
                                width={64}
                                height={64}
                                className="mr-3"
                                src="holder.js/64x64"
                                alt="Generic placeholder"
                    />*/}
                        <Media.Body>
                            {editingIssue}
                            <hr />
                            {
                                this.state.comments.map((comment) => (
                                    this.state.editingCommentID == comment.id ?
                                        <Comment
                                            data={comment.data}
                                            id={comment.id}
                                            key={comment.id}
                                            onEditComment={() => this.onEditComment(comment.id)}
                                            editing={true}
                                            handleEditSubmit={this.handleEditCommentSubmit}
                                        />
                                        :
                                        <Comment
                                            data={comment.data}
                                            id={comment.id}
                                            key={comment.id}
                                            onEditComment={() => this.onEditComment(comment.id)}
                                            editing={false}
                                        />

                                ))

                            }
                        </Media.Body>
                    </Media>
                    {commenting}
                </div>
            );
        }
        else {
            return (<p> Fetching comments... </p>);
        }
    }
}


export class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            data: props.data,
        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleEditSubmit = (e,data) => {
        this.props.handleEditSubmit(e,data)
    }
    render() {
        
        return (
            <Media>
                {/*        <img
                                width={64}
                                height={64}
                                className="mr-3"
                                src="holder.js/64x64"
                                alt="Generic placeholder"
                    />*/}
                <Media.Body>
                    {
                        this.props.editing == true &&
                        <Form onSubmit={(e) => this.handleEditSubmit(e,this.state.data)}>
                            <Form.Group controlId="formBasicText">

                                <Form.Control name="data" value={this.state.data} onChange={this.handleChange} type="text" />

                                <Button variant="primary" type="submit">
                                    Submit
                            </Button>
                                <Button variant="primary" type="cancel">Cancel</Button>
                            </Form.Group>
                        </Form>

                    }
                    {
                        this.props.editing == false &&
                        <div>
                            <p>
                                {this.props.data}
                            </p>
                            <Button onClick={this.props.onEditComment} variant="primary" value={this.props.id} type="submit" >
                                Edit Comment
                          </Button>
                        </div>
                    }
                </Media.Body>
            </Media>

        );

    }
}

export class NewIssueForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            assigned_to: 1
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.title + " " + this.state.description);
        this.setState({ ...this.state, isFetching: true });

        fetch("http://127.0.0.1:5000/create_issue", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "title=" + this.state.title + "&description=" + this.state.description + "&status=1",
            method: "POST",
            mode: "cors"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ comments: result, isFetching: false })
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });

    }

    render() {

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicText1">
                    <Form.Label>Issue Title</Form.Label>
                    <Form.Control name="title" value={this.state.title} onChange={this.handleChange} type="text" placeholder="Bug Title" />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicText">
                    <Form.Label>Issue Description</Form.Label>
                    <Form.Control name="description" value={this.state.description} onChange={this.handleChange} type="text" placeholder="Description" />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
  </Button>
            </Form>
        );
    }
}
