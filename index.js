const express = require('express');
const app = express();
const path = require('path');
const mySql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override for the Updata and Delete

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  database: "userdb",
  password: "Crestre18$"
});
// Count on Home Page
app.get('/', (req, res) => {
  const q1 = 'SELECT COUNT(*) AS count FROM USER';
  connection.query(q1, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Database Error');
    }
    const count = result[0].count;
    res.render('home.ejs', { count });
  });
});

// Show data from filter and Get data from Search
app.get("/view", (req, res) => {
  const role = req.query.role;
  const search = req.query.search;

  let q2 = 'SELECT * FROM user';
  let params = [];

  if (search) {
  q2 += ` WHERE email LIKE ? OR name LIKE ?`;
  params.push(`%${search}%`, `%${search}%`);
}

  else if (role) {
    q2 += ` WHERE role = ?`;
    params.push(role);
  }

  connection.query(q2, params, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).send("Database Error");
    }
    res.render("view.ejs", { users: result });
  });
});

// Add new User
app.get("/newUser", (req, res)=>{
  res.render('newUser.ejs');
})

app.post("/newUser", (req, res)=>{
  let {name, email, address, role} = req.body;
  const id = uuidv4();
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ')

  let values = [id, name, email, address, role, created_at];

  let q3 = `INSERT INTO USER(id, name, email, address, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(q3, values, (err, result)=>{
    if(err){
      console.error("Error:", err);
      return res.status(500).send("Database Error");
    }
    res.redirect("/view");
  })
});

// Updata the user

app.get("/edit/:id", (req, res)=>{
  const userId = req.params.id;
  const q4 = `SELECT * FROM USER WHERE id = ?`;
  connection.query(q4, [userId], (err, result)=>{
    if(err){
      console.error("Error:", err);
      return res.status(500).send("Database Error");
    }
    if (result.length === 0) {
      return res.status(404).send("User not found");
    }
    res.render("edit.ejs", {user : result[0]})
  })
})

app.post("/edit/:id", (req, res)=>{
  const { id } = req.params;
  const{name, email, address, role} = req.body;
  const q5 = `UPDATE USER SET name = ?, email = ?, address = ?, role = ? WHERE id = ?`;
  let values = [name, email, address, role, id];
  connection.query(q5, values, (err, result)=>{
    if(err){
      console.error("Error:", err);
      return res.status(500).send("Database Error");
    }
    res.redirect("/view");
  })
})

// Delete the user that you want

app.post("/delete/:id", (req, res)=>{
  const {id} = req.params;
  const q = 'DELETE FROM USER WHERE id = ?'
  
  connection.query(q, [id], (err, result)=>{
    if(err){
      console.error("Error:", err);
      return res.status(500).send("Database Error");
    }
    res.redirect("/view");
  })
})

// Start Server
let port = 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
