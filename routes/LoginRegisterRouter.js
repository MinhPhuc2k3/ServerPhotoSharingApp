const User = require("../db/userModel");
const express = require("express");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username, password: password });
  if (user) {
    req.session.userId = user.id; // Store user ID in session
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    res.send({_id: user.id, first_name: user.first_name, last_name: user.last_name});
  } else {
    res.status(401).send("Invalid credentials");
  }
});
router.get("/logout", (req, res)=>{
  if(req.session.userId){
    req.session.destroy();
    res.status(200).send("Logout Sucessfu!");
  }else{
    res.status(401).send("Invalid credentials");
  }
})
router.get("/loginUser", (req, res)=>{
    if (req.session.userId) {

      const {userId, first_name, last_name} = req.session;
        
        res.status(200).send({userId, first_name, last_name});
    } else {
        res.status(401).send('Unauthorized user.');
    }
})
module.exports = router;
