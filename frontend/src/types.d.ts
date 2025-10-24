export interface Ingredient {
    name: string;
    amount: string;
}

export interface Cocktail {
    _id: string;
    user: { _id: string; displayName: string; avatar: string };
    title: string;
    image: string | null;
    recipe: string;
    published: boolean;
    ingredients: Ingredient[];
    createdAt: string;
}

export interface CocktailMutation {
    title: string;
    recipe: string;
    image: File | null;
    ingredients: Ingredient[];
}

export interface RegisterMutation {
    username: string;
    password: string;
    displayName: string;
    avatar: File | null;
}

export interface LoginMutation {
    username: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    token: string;
    role: 'user' | 'admin';
    displayName: string;
    avatar: string;
}

export interface ValidationError {
    errors: Record<string, { message: string; name: string }>;
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError { error: string; }
