const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (req, res) => {
  if (req.session.userId) {
    try {
      const users = await User.find({});
      res.send(
        users.map((user) => {
          return {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
          };
        }),
      );
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Invalid credentials");
  }
});

router.get("/:id", async (request, response) => {
  if (request.session.userId) {
    try {
      const user = await User.findOne({ _id: request.params.id });
      const { _id, first_name, last_name, location, description, occupation } =
        user;
      response.send({
        _id,
        first_name,
        last_name,
        location,
        description,
        occupation,
      });
    } catch (error) {
      response.status(400).send(error);
    }
  } else {
    response.status(401).send("Invalid credentials");
  }
});

router.post("/", async (req, res)=>{
    const {username, password, first_name, last_name, location,
      description, occupation} = req.body;
    const user = await User.findOne({username: username});
    if(user){
      res.status(400).send("already exist users");
    }else{
      await User.insertMany([{username:username, password:password, first_name:first_name, last_name:last_name, location:location,
        description:description, occupation:occupation}]);
        res.status(200).send("Successful!");
    }
})

module.exports = router;
