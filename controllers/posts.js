import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";


///get single post

export const getPost = async(req,res) =>{
    const {id} = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
      res.status(404).json({message: error.message});  
    }
}


// getting posts
export const getPosts = async (req,res) => {
   const {page} = req.query;
    try {
        const LIMIT = 6;
        //get the  index  of starting post of every page 
        const startIndex = (Number(page) - 1)*LIMIT;
        // count total document, this will help us in fronted to show total no of pages
        const total = await PostMessage.countDocuments({});
        //this will find LIMIT no of posts after skipping startIndex no of post and return in sorted order(sort by newely creted)
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage:Number(page), numberOfPages: Math.ceil(total/LIMIT)});
    } catch (error) {
       res.status(404).json({message:error.message}); 
    }
}

//get post by search
export const getPostsBySearch = async(req,res) => {
    const {searchQuery, tags} = req.query;

    try {
        //this simply ignore duplicate i.e lower uppercase diffrence ignore
        const title = new RegExp(searchQuery,"i");
         console.log(title);
        //get post  
        //$or: [title,tags] ---find post that matches with title or tags
        const posts = await PostMessage.find({$or: [{title}, {tags: {$in: tags.split(',')}} ] });
        // console.log(posts);
        res.json({data: posts});
    } catch (error) {
        console.log("wrong");
        res.status(404).json({message:error.message});
    }

}


//adding post
export const createPost =async (req,res) => {
    const post = req.body;
   
    const newPost = new PostMessage({...post, creator: req.UserId, createdAt: new Date().toISOString() });
   try {
        await newPost.save();
        res.status(200).json(newPost);
   } catch (error) {
    res.status(409).json({message:error.message}); 
   }
}

//updatePost

export const updatePost = async(req,res) => {
    //get id by url that is requested
    const {id: _id } = req.params;
    //get updated data for above id
    const post = req.body;
    
    //if id is not valid
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    //if id is valid , update database and get data
   const updatedPost= await PostMessage.findByIdAndUpdate(_id, {...post,_id}, {new: true});

   //finally send updatedPost to fronted
   res.json(updatedPost);

}

///for deleting a post

export const deletePost = async(req,res) => {
    const {id: _id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(_id);
    res.json('post deleted sucessfully');
}

///like post
export const likePost = async(req,res) => {
    const {id: _id } = req.params;
    
    if(!req.UserId) return res.json({message: 'Unauthenticated'});

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
   const post= await PostMessage.findById(_id);

   // checking if user is already liked post or not
   const index = await post.likes.findIndex((id) => id === String(req.UserId));

    if(index === -1){
        post.likes.push(req.UserId);
    }
    else{
        post.likes = post.likes.filter((id) => id !== String(req.UserId));
    }

   const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
    res.json(updatedPost);
}
