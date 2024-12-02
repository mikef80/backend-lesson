const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Hello World!
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Query Parameter
app.get("/greeting", (req, res) => {
  const query = req.query;
  console.log(query, " <--query");

  if (query.name) {
    res.send("Hello " + query.name);
  } else {
    res.send("Hello World!");
  }
});

// Route Parameter
app.get("/greeting/:name", (req, res) => {
  const params = req.params;

  res.send("Hello " + params.name);
});

// HTML example
app.get("/html", (req, res) => {
  const { name = "Anonymous" } = req.query;

  res.send(`
    <h1 style="color:red;font-weight:bold;font-family:Arial;">
      Hello ${name}!
    </h1>
    <p style="color:blue;font-style:italic;font-family:Arial;">
      This is an HTML response, styled with inline CSS!
    </p>
    `);
});

// FizzBuzz
app.get("/fizzbuzz/:n", (req, res) => {
  const { n } = req.params;

  if (n <= 0) {
    return res.send("<p>You must provide a positive integer</p>");
  }

  let answer = "<ul>";

  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      answer += "<li>FizzBuzz</li>";
    } else if (i % 3 === 0) {
      answer += "<li>Fizz</li>";
    } else if (i % 5 === 0) {
      answer += "<li>Buzz</li>";
    } else {
      answer += `<li>${i}</li>`;
    }
  }

  answer += "</ul>";

  res.send(answer);
});

// CSV rendering
app.get("/csv", (req, res) => {
  const data = fs.readFileSync("data.csv", "utf-8");
  const dataLines = data.split("\n");

  const headingsArray = dataLines[0].split(",");
  const contentArray = dataLines.slice(1);

  const response = `
    <style>
      table, th, td {
        border: 1px solid black;
        padding: 5px;
        text-align: center;
      }

      table {
        border-collapse: collapse;
      }

      tbody > tr:nth-child(odd) {
        background-color: lightgrey;
      }
    </style>
    <table>
      <thead>
        <tr>
          ${headingsArray.map((heading) => `<th>${heading}</th>`).join("")} 
        </tr>
      </thead>
      <tbody>
        ${contentArray
          .map((row) => {
            const rowData = row.split(",");
            return `<tr>
              ${rowData.map((cell) => `<td>${cell.trim()}</td>`).join("")}
          </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;

  res.send(response);
});

// Fetch JSON from public REST API and return HTML
app.get("/public-api", async (req, res) => {
  const joke = await fetch("https://official-joke-api.appspot.com/random_joke").then(
    (response) => {
      if (!response.ok) {
        throw new Error("Error whilst fetching joke!");
      }
      return response.json();
    }
  );

  const html = `
    <h1>Joke #${joke.id}</h1>
    <h2>${joke.setup}</h2>
    <h3>${joke.punchline}</h3>
    <br>
    <code>API return: ${JSON.stringify(joke)}</code>
  `;

  res.send(html);
});

// REST API for data filtering/modification
app.get("/data-filtering", async (req, res) => {
  const { name, id, email } = req.query;

  let query = "";

  if (name || id || email) query += "?";

  if (name) query += "name=" + name;
  if (id) query += "id=" + id;
  if (email) query += "email=" + email;

  const data = await fetch(`https://jsonplaceholder.typicode.com/users${query}`).then(
    (response) => response.json()
  );

  res.send(data);
});

// REST API for data filtering/modification
app.get("/data-filtering/:id", async (req, res) => {
  const { id } = req.params;

  const data = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(
    (response) => response.json()
  );

  res.send(data);
});

// REST API for data filtering/modification
app.patch("/data-filtering/:id", async (req, res) => {
  const { name, email } = req.query;
  const { id } = req.params;

  const patchBody = {};

  if (name) patchBody.name = name;
  if (email) patchBody.email = email;

  const newData = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchBody),
    headers: { "Content-type": "application/json;charset=UTF-8" },
  }).then((response) => {
    return response.json();
  });

  res.send(newData);
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
