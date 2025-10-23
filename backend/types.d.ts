import {Request} from "express";
import {HydratedDocument, Types} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
    avatar: string;
    role: string;
    displayName?: string;
    googleId?: string;
}

export interface IngredientFields {
    name: string;
    amount: string;
}

export interface CocktailFields {
    user: Types.ObjectId;
    title: string;
    image: string | null;
    recipe: string;
    published: boolean;
    ingredients: IngredientFields[];
}

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>
}

