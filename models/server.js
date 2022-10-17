
const http        = require('http');
const https       = require('https');
const fs          = require("fs")

const testing = process.argv.some((val) => val === "test");
const telegrmId = testing ? "430227172": "5214832303"
const connection = testing ? http: https

const defaultOptions = {
    host: testing ? '192.168.0.5': 'test.sklobudresurs.com',
    path: '/sklobudresurs/hs/shop/'
};
const defaultTelegramOptions = {
    host: 'api.telegram.org',
    path: `/bot${process.env.TELEGRAM_TOKEN}/`
};

const getImage = (req, res) => {

    const fileName = "loaded/" + req.query.ImageGUID + ".jpg"
  
    const resBody = {
      loaded: true,
      data:{
        img: fileName
      }
    }
  
    try {
      if (fs.existsSync("build/" + fileName)) {
        res.send(JSON.stringify(resBody))
        return
      }
    } catch(err) {
      console.error(err)
    }
  
    return (result, responce) => {
  
      try{
        let jsonResult= JSON.parse(result.trim())
        let base64Data = jsonResult.data.img;
  
        fs.writeFile("build/" + fileName, base64Data, 'base64', function(err) {
          console.log(err);
        });
        responce.send(JSON.stringify(resBody))
      }catch(e){
        console.log(e)
        resBody.loaded = false
        responce.send(JSON.stringify(resBody))
      }
    }
}
  
const getDataFromServer = (req, res) => {

  let resultHandler = (result, responce) => {
    responce.send(result)
  }

  if(req.query.hasOwnProperty("ImageGUID") && req.query.ImageGUID !== null && req.query.ImageGUID !== "null"){
    resultHandler = getImage(req, res)
    if(!resultHandler) return
  }



  const options = {}
  Object.assign(options, defaultOptions)
  options.path += req.params[0]

  const searchParams = new URLSearchParams()
  Object.keys(req.query).forEach(key => searchParams.append(key, req.query[key]))
  options.path += [...searchParams].length > 0 ? "?" + searchParams.toString(): ""
  options.method = req.method

  const requestCallback = function(response) {
    let data = ""
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      resultHandler(data, res)
      // res.send(data)
    });
    response.on('error', error => {
      console.error(error);
      // res.error(error)
    })
  }
  connection.request(options, requestCallback).end();
}

const postDataToServer = (req, res) => {

  const requestCallback = function(response) {
    let data = ""
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      res.send(data)
    });
    response.on('error', error => {
      console.error(error);
      // res.error(error)
    })
  }

  const options = {}
  Object.assign(options, defaultOptions)
  options.path += req.params[0]
  options.method = req.method

  const searchParams = new URLSearchParams()
  Object.keys(req.query).forEach(key => searchParams.append(key, req.query[key]))
  options.path += [...searchParams].length > 0 ? "?" + searchParams.toString(): ""

  const request = connection.request(options, requestCallback);
  request.write(JSON.stringify(req.body))
  request.end()
}

const postDataToTelegram = (req, res) => {

  req.query.chat_id = telegrmId

  const requestCallback = (rq) => {
    res.send(`{"statusMessage": "${rq.statusMessage}"}`);
  }

  const options = {}
  Object.assign(options, defaultTelegramOptions)
  options.path += req.params[0]
  options.method = req.method

  const searchParams = new URLSearchParams()
  Object.keys(req.query).forEach(key => searchParams.append(key, req.query[key]))
  options.path += [...searchParams].length > 0 ? "?" + searchParams.toString(): ""

  const request = https.request(options, requestCallback);
  // request.write(JSON.stringify(req.body))
  request.end()
}


module.exports = {
    postDataToTelegram,
    postDataToServer,
    getDataFromServer
}