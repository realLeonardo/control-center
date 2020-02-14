
      use site_3002

      db.dropDatabase()

      use site_3002

      db.organizations.insert({"name": "123", "subName": ""})

      db.users.insert({
        "email" : "111",
        "name" : "111",
        "password" : "ruler2019",
        "level" : 2
      })
    