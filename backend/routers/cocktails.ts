import Cocktail from "../models/Cocktail";
import express from "express";
import {RequestWithUser} from "../types";
import auth from "../middleware/auth";
import {cocktailImageUpload} from "../multer";
import mongoose from "mongoose";
import permit from "../middleware/permit";
import User from "../models/User";

const cocktailsRouter = express.Router();

cocktailsRouter.get('/', async (req, res, next) => {
    try {
        const items = await Cocktail
            .find({ published: true })
            .populate('user', 'displayName avatar')
            .sort({ createdAt: -1 });
        res.send(items);
    } catch (e) { next(e); }
});

cocktailsRouter.get('/mine', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const items = await Cocktail.find({ user: user._id }).sort({ createdAt: -1 });
        res.send(items);
    } catch (e) { next(e);}
});

cocktailsRouter.post('/', auth, cocktailImageUpload.single('image'), async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;

        let ingredients = req.body.ingredients;
        if (typeof ingredients === 'string') {
            try { ingredients = JSON.parse(ingredients); } catch { ingredients = []; }
        }

        const cocktail = await Cocktail.create({
            user: user._id,
            title: req.body.title,
            image: req.file ? `images/cocktails/${req.file.filename}` : req.body.image,
            recipe: req.body.recipe,
            published: false,
            ingredients,
        });

        res.status(201).send({
            message: 'Your cocktails is being processed',
            cocktail
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidatorError) {
            return res.status(400).send({error: error.message});
        }
        next(error);
    }
});

cocktailsRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send({ error: 'Cocktail not found' });
        }

        const cocktail = await Cocktail.findById(id)
            .populate('user', 'displayName avatar role')
            .lean();

        if (!cocktail) return res.status(404).send({ error: 'Cocktail not found' });

        if (cocktail.published) {
            return res.send(cocktail);
        }

        const token = req.get('Authorization');
        if (!token) return res.status(404).send({ error: 'Cocktail not found' });

        const viewer = await User.findOne({ token }).lean();
        if (!viewer) return res.status(404).send({ error: 'Cocktail not found' });

        const isOwner = cocktail.user && cocktail.user._id?.toString?.() === viewer._id.toString();
        const isAdmin = viewer.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(404).send({ error: 'Cocktail not found' });
        }
        res.send(cocktail);
    } catch (e) {
        next(e);
    }
});

cocktailsRouter.patch('/:id/published', auth, permit('admin'), async (req, res, next) => {
    try {
        const updated = await Cocktail.findByIdAndUpdate(
            req.params.id,
            { published: Boolean(req.body.published) },
            { new: true }
        );
        if (!updated) return res.status(404).send({error: 'Cocktail not found'});
        res.send(updated);
    } catch (e) { next(e); }
});

cocktailsRouter.delete('/:id', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const cocktail = await Cocktail.findById(req.params.id);
        if (!cocktail) return res.status(404).send({error: 'Cocktail not found'});

        const isOwner = cocktail.user.toString() === user._id.toString();
        const isAdmin = user.role === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).send({error: 'Unauthorized'});

        await Cocktail.deleteOne({_id: req.params.id});
        res.status(204).send();
    } catch (e) { next(e); }
});

export default cocktailsRouter;
