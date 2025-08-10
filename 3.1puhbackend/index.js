require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

// JSON muotoisen pyynnön käsittely.
app.use(express.json());

// Otetaan morgani käyttöön myös POST pyynnöissä
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("dist"));
app.use(morgan("tiny"));

// Ei käytössä oleva taulukko
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
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Haku id perusteella
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// Poisto id perusteella
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end(); // 204 No Content: Merkki siitä, että poisto onnistui
    })
    .catch((error) => {
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Tarkastetaan onko nimi ja numero annettu
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // Tarkastetaan onko nimi jo olemassa
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({
          error: "name must be unique",
        });
      }

      // Luodaan uusi henkilö
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      // Tallennetaan henkilö tietokantaan
      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((error) => {
          response.status(500).json({
            error: "saving person failed",
          });
        });
    })
    .catch((error) => {
      response.status(500).json({
        error: "database error",
      });
    });
});

app.get("/info", (request, response) => {
  const date = new Date();

  Person.countDocuments({})
    .then((count) => {
      response.send(`
        <div>Phonebook has info for ${count} people</div>
        <div>${date}</div>
      `);
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Error retrieving data from database" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
