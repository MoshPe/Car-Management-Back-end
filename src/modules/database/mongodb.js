const { connect} = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverApi: ServerApiVersion.v1,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri =
//   'mongodb+srv://clientServerCourse:ffn5y3MVWFVfJmaf@cluster0.sm1lwcg.mongodb.net/?retryWrites=true&w=majority';
// module.exports = client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });


// module.exports = {
//   treatmentsCollection: client
//     .db('car_treatments')
//     .collection('car_treatments'),
//   usersCollection: client.db('car_treatments').collection('users'),
// };


