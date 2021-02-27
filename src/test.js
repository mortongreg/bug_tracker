console.log(fetch("http://127.0.0.1:5000/get_issue", {
  body: "id=1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  method: "POST"
}))