const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = process.env.MONGODB_URI;
// mongodb+srv://1234:${password}@testicluster.tcwr09x.mongodb.net/noteApp?retryWrites=true&w=majority&appName=testiCluster
//const url = `mongodb+srv://1234:${password}@testicluster.tcwr09x.mongodb.net/noteApp?retryWrites=true&w=majority&appName=testiCluster`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: String,
});

// Poistaa kentät _id ja _v
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
