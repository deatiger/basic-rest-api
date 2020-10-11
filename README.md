## LICENSE
The source code is licensed MIT.

## Create users table
```
CREATE TABLE users (  
  id INTEGER NOT NULL PRIMARY KEY, 
  name TEXT NOT NULL, 
  profile TEXT, 
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
  date_of_birth TEXT
);
```

## Create a sample data
`INSERT INTO users (name, profile) VALUES ("torahack", "I am the front-end engineer!");`

## Fetch all data from users table
`SELECT * FROM users;`