const express = require("express");
const fs      = require("fs")
const mysql       = require('mysql');
const { resolve } = require("path");
const { getDataFromServer } = require("../models/server");

const productsQueryText = fs.readFileSync('./SQLRequests/products.sql', 'utf8')
const goodsQueryText = fs.readFileSync('./SQLRequests/goods.sql', 'utf8')
const servicesQueryText = fs.readFileSync('./SQLRequests/services.sql', 'utf8')

const router = express.Router()

const SIGN_UP = "Sign_up"
const SIGN_IN = "Sign_in"
const PRODUCTS = "products"
const SERVICES = "services"
const GOODS = "goods"
const IMAGE = "image"
const UPDATE_USER = "user_info"

const postDataToDatabase = (req, res, query, handler) => {
  const { 
      usr = process.env.SQL_USR, 
      pwd = process.env.SQL_PWD,
      table,
      data
  } = req.body;
   

  if(!data) {
    res.send(req.body);
    return
  }


  handler = handler || (dbResult => {
    res.send(dbResult)
  })

  query = query || replaceData(table, data)

  sendSqlRequest(usr, pwd, query)
  .then(handler)
  .catch(err => console.log(err))
}

const loginUser = (res, data) => {
  const {login, pwd} = data

  const  query = `
    SELECT * 
    FROM users
    WHERE login="${login}" AND pwd="${pwd}"
  `

  const handler = (dbResult) => {
    console.log(dbResult)
    if(dbResult.length === 0){
      res.status(401).json({message: "Вказані невірні дані для входу"})
      return
    }
    res.json(dbResult[0])
  }

  return {query, handler}
}

const loginOrRegisterUser = (req, res) => {
  const {type, data} = req.body;
  
  const {query, handler} = (() => {
    switch(type){
      case SIGN_UP:
        return createUser(req, res, data)
      case SIGN_IN:
        return loginUser(res, data)
    }
  })()

  postDataToDatabase(req, res, query, handler)
}

const createUser = (req, res, data) => {

  const colums = Object.keys(data)

  let query = `INSERT INTO users(${colums.join(',')})
    VALUES(${colums.map(col => {
      switch (typeof data[col]) {
        case 'string':
          return `"${data[col]}"`
        case 'number':
          return data[col]
        default:
          return data[col] === null ? "NULL": data[col]
      }
  })
  .join(',')})`

  const handler = (dbResult) => {
    const {query, handler} = loginUser(res, data)
    postDataToDatabase(req, res, query, handler)
  }

  return {query, handler}
}

const replaceData = (table, data) => {

  const colums = Object.keys(data[0])
  let query = `REPLACE INTO ${table}(${colums.join(',')})
    VALUES${data.map(item => `(${colums.map(col => {
        switch (typeof item[col]) {
          case 'string':
            return `"${item[col]}"`
          case 'number':
            return item[col]
          default:
            return item[col] === null ? "NULL": item[col]
        }
      })
      .join(',')})`)
  .join(',')}`
  return query
} 

const getDataFromDatabase = (req, res) => {
  const usr = process.env.SQL_USR
  const pwd = process.env.SQL_PWD

  const serializeProducts = (responce) => {
    const [products, params] = responce
    const nomenclatureWithParams = products.map(item => {
        item.params = params.reduce((acc, param) => {
            if(param.productId === item.id){
              acc[param.name] = param.value
            }
            return acc
          },{})
        return item
      })
    res.json({type: req.params[0], data: nomenclatureWithParams})
  }

  let query
  switch(req.params[0]){
    case PRODUCTS:
      query = productsQueryText
      break;
    case GOODS:
      query = goodsQueryText
      break;
    case SERVICES:
      query = servicesQueryText
      break;
    case IMAGE:
      getDataFromServer(req, res)
      return
    default:
      console.log("unknown request: " + req.params[0])
      return
  }
  sendSqlRequest(usr, pwd, query)
  .then(serializeProducts)
}

const updateUser = (req, res) => {
  const {userId, id, value} = req.body.data
  const changeRow = (() => {
    switch (typeof value) {
      case 'string':
        return `${id}="${value}"`
      case 'number':
        return `${id}=${value}`
      default:
        return value === null ? `${id}=NULL`: `${id}=${value}`
    }
  })()

  let query = `UPDATE users SET
  ${changeRow}
  WHERE (userId = ${userId});`

  const handler = (dbResult) => {
    res.send(dbResult)
  }

  postDataToDatabase(req, res, query, handler)
}

const sendSqlRequest = (usr, pwd, query) => {
    var mysqlConnection = mysql.createConnection({
      host     : process.env.SQL_ADR,
      user     : usr,
      password : pwd,
      database : 'sklobudresurs',
      multipleStatements: true
    });
  
    mysqlConnection.connect();
    return new Promise((resolve, reject) => {
      mysqlConnection.query(query, (error, results, fields) => {
        if (error) return reject(error);
        resolve(results);
      });
    
      mysqlConnection.end();
    })
    
}
  
router.post("/user", loginOrRegisterUser)

router.put("/user", updateUser)

router.post("/*", postDataToDatabase)
  
router.get("/*", getDataFromDatabase)



module.exports = router