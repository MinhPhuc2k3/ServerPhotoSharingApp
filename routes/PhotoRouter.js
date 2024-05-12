const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/photosOfUser/:id", async (request, response) => {
  if (request.session.userId) {
    const userId = request.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }
    try {
      const photos = await Photo.find({ user_id: request.params.id });
      const photosRes = photos.map(async (photo) => {
        const comments = await Promise.all(
          photo.comments.map(async (comment) => {
            const commentUser = await User.findById(comment.user_id);
            return {
              comment: comment.comment,
              date_time: comment.date_time,
              _id: comment._id,
              user: {
                _id: commentUser._id,
                first_name: commentUser.first_name,
                last_name: commentUser.last_name,
              },
            };
          }),
        );
        const photoObj = photo.toObject();
        delete photoObj.__v;
        return {
          ...photoObj,
          comments,
        };
      });
      const resolvedPhotos = await Promise.all(photosRes);
      response.send(resolvedPhotos);
    } catch (error) {
      response.status(400).send(error);
    }
  } else {
    response.status(401).send("Invalid credentials");
  }
});

router.post("/:photo_id", async (req,res)=>{
  if(req.session.userId){
    today = new Date();
    const {comment} = req.body;
    const photo = await Photo.findOne({_id: req.params.photo_id});
    photo.comments.push({comment: comment, date_time: today.toISOString(), user_id: req.session.userId})
    await Photo.findOneAndUpdate(photo._id, photo);
  }else {
    res.status(401).send("Invalid credentials");
  }
})
module.exports = router;
