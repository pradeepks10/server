import express from 'express';

import { getPost,getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();



//for search
router.get('/search',getPostsBySearch);

router.get('/',getPosts);

//for single post request
router.get('/:id',getPost);




router.post('/', auth, createPost);
//this will update post using id of post
router.patch('/:id', auth, updatePost);

router.delete('/:id',auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;