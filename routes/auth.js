var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var fee = 500;
var carIdState = "";
var passState = "";
let nowDate = new Date();
let year = nowDate.getFullYear(); // 년도
let month = ("0" + (nowDate.getMonth() + 1)).slice(-2); // 월
let date = ("0" + nowDate.getDate()).slice(-2); // 날짜
let day = nowDate.getDay(); // 요일
let hours = nowDate.getHours(); // 시
let minutes = nowDate.getMinutes(); // 분
let seconds = nowDate.getSeconds(); // 초
var moment = require("moment");
var now = moment();
// const timeBundle = {};
/* GET home page. */
router.get("/", function (req, res, next) {
  var carNumState = carNumState ? "이미 있는 차량번호입니다" : "";
  var display = display ? "dnone" : "";
  let displayReverse = "";
  res.render("auth", {
    title: "login",
    main: "main",
    fee: fee,
    carNumState: carNumState,
    display: display,
    displayReverse: displayReverse,
    carIdState: carIdState,
    passState: passState,
  });
});

// login_process
router.post("/auth/login_process", function (req, res, next) {
  var post = req.body;
  var password = post.password;
  var carNumber = post.car_number;
  var insertIntime = `
  insert into parking(car_number, in_time) VALUES(?,NOW())
  `;
  var sqlCarnumber = `
  select car_number from users where car_number = '${carNumber}'
  `;
  var sqlPass = `
  select password from users where password='${password}'
  `;
  let carNumState = "";
  let display = "";
  let displayReverse = "";
  let intime = {};
  let conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "beom",
    password: "111111",
    database: "parking",
    dateStrings: "date",
  });
  // conn.connect();
  conn.query(sqlCarnumber, carNumber, function (err, rows, fields) {
    console.log(rows.length);
    if (rows.length) {
      conn.query(sqlPass, password, function (err, rows, fields) {
        if (rows.length) {
          req.session.isLogined = true;
          req.session.carNumber = carNumber;
          console.log(req.session);

          conn.query(
            "select in_time from parking where car_number = ? order by in_time desc limit 1",
            carNumber,
            function (err, rows) {
              // console.log(JSON.parse(JSON.stringify(rows))[0]["in_time"]);
              console.log(rows.length);
              if (rows.length === 0) {
                conn.query(
                  insertIntime,
                  carNumber,
                  function (err, rows, fields) {
                    console.log(err, rows);
                    conn.query(
                      "select in_time from parking where car_number = ? order by in_time desc limit 1",
                      carNumber,
                      function (err, rows) {
                        intime["intime"] = JSON.parse(JSON.stringify(rows))[0][
                          "in_time"
                        ];
                        res.render("index", {
                          title: "Hello",
                          carNumber: req.session.carNumber,
                          intime: intime.intime,
                        });
                      }
                    );
                  }
                );
              } else {
                conn.query(
                  "select in_time from parking where car_number = ? order by in_time desc limit 1",
                  carNumber,
                  function (err, rows) {
                    // console.log(JSON.stringify(rows) + "!!!!");
                    // console.log(JSON.parse(JSON.stringify(rows))[0]["in_time"]);
                    // const intime = JSON.stringify(rows);
                    // const intimeParse = JSON.parse(intime)[0]["in_time"];
                    // // const inTime = Date.parse(timeBundleParse[0]["in_time"]);
                    // intime["intime"] = intimeParse;
                    // console.log(intimeParse);
                    intime["intime"] = JSON.parse(JSON.stringify(rows))[0][
                      "in_time"
                    ];

                    res.render("index", {
                      title: "Hello",
                      carNumber: req.session.carNumber,
                      intime: intime.intime,
                    });
                  }
                );
              }
            }
          );

          // res.render("index", {
          //   title: "aaaaaa",
          //   carNumber: req.session.carNumber,
          //   intime: intime.intime,
          // });
        } else {
          passState = "존재하지않는 패스워드입니다";
          res.render("auth", {
            title: "login",
            main: "main",
            fee: fee,
            carNumState: carNumState,
            display: display,
            displayReverse: displayReverse,
            carIdState: carIdState,
            passState: passState,
          });
        }
      });
    } else {
      console.log(err);
      carIdState = "존재하지않는 차량입니다";
      res.render("auth", {
        title: "login",
        main: "main",
        fee: fee,
        carNumState: carNumState,
        display: display,
        displayReverse: displayReverse,
        carIdState: carIdState,
        passState: passState,
      });
    }
  });
  // conn.end();
});

// register_process
router.post("/auth/register_process", function (req, res, next) {
  var post = req.body;
  var password = post.password;
  var name = post.name;
  var carNumber = post.car_number;
  var userType = Number(post.type);
  var insertSql =
    "INSERT INTO users (name, type, car_number, password) VALUES(?,?,?,?)";
  var carNumberSql = `SELECT car_number FROM users where car_number=?`;
  const userParams = [name, userType, carNumber, password];
  let state = false;
  let carNumState = "";
  let display = "";
  let displayReverse = "";
  let conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "beom",
    password: "111111",
    database: "parking",
    dateStrings: "date",
  });
  // conn.connect();
  conn.query(carNumberSql, carNumber, function (err, rows, fileds) {
    console.log(`11111${rows}`);
    if (rows.length) {
      state = true;
      carNumState = state ? "이미 있는 차량번호입니다" : "";
      display = state ? "dnone" : "";
      displayReverse = state ? "dblock" : "";
      res.render("auth", {
        title: "login",
        main: "main",
        fee: fee,
        carNumState: carNumState,
        display: display,
        displayReverse: displayReverse,
        carIdState: carIdState,
      });
    } else {
      state = false;
      carNumState = state ? "" : "";
      display = state ? "" : "";
      displayReverse = state ? "" : "";

      console.log(insertSql, userParams);
      conn.query(insertSql, userParams, (err, rowss, fields) => {
        console.log(err);
        console.log("User info is: ", rowss);
        res.render("auth", {
          title: "Welcome",
          main: "main",
          fee: fee,
          carNumState: carNumState,
          display: display,
          displayReverse: displayReverse,
          carIdState: carIdState,
        });
      });
    }
  });
});
router.get("/auth/output", function (req, res, next) {
  console.log("good");

  // var carNumState = carNumState ? "이미 있는 차량번호입니다" : "";
  // var display = display ? "dnone" : "";
  // let displayReverse = "";
  // req.session.isLogined = true;
  var carNumber = req.session.carNumber;
  const resultArea = {};
  console.log(carNumber);
  console.log(req.session);
  console.log(req);
  let conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "beom",
    password: "111111",
    database: "parking",
    dateStrings: "date",
  });
  // let curTime = `${year}-${month}-${date}-${day}  ${hours}:${minutes}:${seconds}`;
  let curTime = new Date();

  const updateOut = `UPDATE parking SET out_time = NOW() where car_number = ?`;
  // const getDate = "%Y-%m-%d %H:%m:%s";
  // const selectTime = `SELECT out_time FROM parking where car_number = ?`;
  // const selectTime = `select out_time from parking where date_format(out_time, '%Y-%m-%d')`;
  // date_format(out_time, '%Y-%m-%d %h:%i:%s')
  // const selectInTime = `select in_time from parking where car_number = ? order by out_time desc limit 1`;
  const selectTime = `select in_time, out_time from parking where car_number = ? order by in_time desc limit 1`;

  // console.log(carNumber);
  conn.query(updateOut, carNumber, (err, rowss, fields) => {
    if (err) {
      console.log(err);
    }
    // console.log(rowss);
    conn.query(selectTime, carNumber, (err, result, fields) => {
      if (err) {
        console.log(err);
      }
      const timeBundle = JSON.stringify(result);
      const timeBundleParse = JSON.parse(timeBundle);
      const inTime = Date.parse(timeBundleParse[0]["in_time"]);
      const outTime = Date.parse(timeBundleParse[0]["out_time"]);
      const outTimeDate = timeBundleParse[0]["out_time"];
      console.log(result);
      console.log(timeBundle);
      console.log(outTime - inTime);
      console.log(timeBundle + "!!!!"); //배열안에JSON형식인 문자열
      console.log(typeof timeBundle);
      console.log(JSON.parse(timeBundle)); // 문자열을객체로 변경
      console.log(typeof inTime);
      // console.log(Date.parse(inTime));
      // console.log(Date.parse(outTime) - Date.parse(inTime));
      console.log(inTime, outTime);
      let timeCal = (outTime - inTime) / 1000;
      console.log(timeCal);
      console.log(typeof timeCal);
      if (timeCal < 180) {
        const min = Math.floor(timeCal / 60);
        const result = "안녕히 가십시오";
        //+ `체류시간: ${min}분`
        console.log("done");
        resultArea["result"] = result;
        resultArea["feeCurResult"] = 0;
        resultArea["outTimeDate"] = outTimeDate;
        resultArea["feeState"] = 0;
        resultArea["text"] = "출차하기를 클릭하세요";
        res.send(resultArea);
        console.log(resultArea);
      } else {
        //fee = 500;
        const timeFeeCal = function (time) {
          console.log(typeof time);
          return fee + ((time - 180) / 60 / 10) * 300;
        };

        resultArea["feeCurResult"] = Math.floor(timeFeeCal(timeCal));
        resultArea["outTimeDate"] = outTimeDate;
        resultArea["feeState"] = 1;
        resultArea["text"] = "결제를 진행하세요";
        conn.query(
          "delete from parking where car_number = ?",
          carNumber,
          function (err, rows) {}
        );
        res.send(resultArea);
      }
    });

    // res.send(resultArea);
  });
});
// ?discount=:id&payment=:id1
router.get("/auth/result", function (req, res) {
  console.log(req.query);
  var carNumber = req.session.carNumber;
  let conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "beom",
    password: "111111",
    database: "parking",
    dateStrings: "date",
  });
  conn.query(
    "delete from parking where car_number = ? order by in_time desc limit 1",
    carNumber,
    function (err, rows) {
      console.log(JSON.parse(JSON.stringify(rows))[0]);
    }
  );
  req.session.destroy();
  res.render("result", {
    title: "Thank you",
  });
});
router.get("/logout", function (req, res) {
  // req.logout();
  // req.session.save(function () {
  //   res.redirect("/");
  // });
  req.session.destroy();
  res.redirect("/");
});
// var a = 1;
module.exports = router;
