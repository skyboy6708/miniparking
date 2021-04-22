var express = require("express");
var router = express.Router();

router.get("/ha", function (req, res, next) {
  res.send("새로운 라우터가 등록되었습니다");
});

module.exports = router;
// 반환객체가 router이어야 라우터 미들웨어로 등록할 수 있다
