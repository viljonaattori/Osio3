require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;
//const url = `mongodb+srv://1234:${password}@testicluster.tcwr09x.mongodb.net/osio3backend?retryWrites=true&w=majority&appName=testiCluster`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Jos annetaan vain kaksi argumenttia, listaamme kaikki numerot
if (process.argv.length === 3) {
  console.log("Puhelinluettelo:");

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

// Jos annetaan kolme argumenttia niin lisätään uusi numero
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(() => {
    console.log(`Lisättiin ${name} numero ${number} puhelinluetteloon`);
    mongoose.connection.close();
  });
}
