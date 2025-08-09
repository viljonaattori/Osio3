const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

// JSON muotoisen pyynnön käsittely
app.use(express.json());
app.use(cors());

// Otetaan morgani käyttöön myös POST pyynnöissä
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("dist"));
// Tiny konfiguraatio
app.use(morgan("tiny"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello Puhelinluettelo!</h1>");
});

// Hakee kaikki
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Haku id perusteella
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Poisto id perusteella
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// Generoi satunnainen id
const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Tarkastetaan onko nimi ja numero annettu
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // Tarkastetaan onko nimi jo olemassa
  const nameExists = persons.some((p) => p.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<div>Phonebook has info for ${persons.length} people</div>
    <div>${date}</div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
