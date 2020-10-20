const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const bodyParser = require('body-parser')

const dbPath = "app/db/database.sqlite3"

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

// Get all users
app.get('/api/v1/users', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)

  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows)
  })

  db.close()
})

// Get a user
app.get('/api/v1/users/:id', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    res.json(row)
  })

  db.close()
})

// Search users matching keyword
app.get('/api/v1/search', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const keyword = req.query.q

  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows)
  })

  db.close()
})

const run = async (sql, db, res, message) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        res.status(500).send(err)
        return reject()
      } else {
        res.json({message: message})
        return resolve()
      }
    })
  })
}

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)

  const name = req.body.name
  const profile = req.body.profile ? req.body.profile : ""
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

  await run(
    `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
    db,
    res,
    "新規ユーザーを作成しました！"
  )

  db.close()
})

// Update user data
app.put('/api/v1/users/:id', async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  // 現在のユーザー情報を取得する
  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    const name = req.body.name ? req.body.name : row.name
    const profile = req.body.profile ? req.body.profile : row.profile
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth

    await run(
      `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
      db,
      res,
      "ユーザー情報を更新しました！"
    )
  })

  db.close()
})

// Delete user data
app.delete('/api/v1/users/:id', async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  await run(
    `DELETE FROM users WHERE id=${id}`,
    db,
    res,
    "ユーザー情報を削除しました！"
  )

  db.close()
})

const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port)