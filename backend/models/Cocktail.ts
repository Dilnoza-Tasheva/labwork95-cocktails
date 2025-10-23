import mongoose from "mongoose";
import {CocktailFields, IngredientFields} from "../types";
import User from "./User";

const Schema = mongoose.Schema;

const IngredientSchema = new Schema<IngredientFields>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true,
        trim: true
    },
}, {_id: false});

const CocktailSchema = new Schema<CocktailFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (value: mongoose.Types.ObjectId) => {
                const user = await User.findById(value);
                return Boolean(user);
            },
            message: 'User does not exist'
        }
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    ingredients: {
        type: [IngredientSchema],
        validate: {
            validator: (arr: IngredientFields[]) => Array.isArray(arr) && arr.length > 0,
            message: 'At least one ingredient required'
        },
        required: true
    }
})

const Cocktail = mongoose.model('Cocktail', CocktailSchema);
export default Cocktail;

