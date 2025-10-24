import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Cocktail from "./models/Cocktail";
import {randomUUID} from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('cocktails');
    } catch {}

    const [admin, user] = await User.create({
        username: 'Admin',
        password: 'Qwerty123',
        role: 'admin',
        token: randomUUID(),
        displayName: 'Admin',
        avatar: 'images/avatars/sample-admin.png'
    }, {
        username: 'User',
        password: 'Qwerty123',
        role: 'user',
        token: randomUUID(),
        displayName: 'Johnny',
        avatar: 'images/avatars/sample-user.png'
    });

    await Cocktail.create({
        user: user._id,
        title: 'Negroni',
        image: 'images/cocktails/negroni.png',
        recipe: 'Смешать в стакане со льдом, перемешать, апельсиновая цедра.',
        published: false,
        ingredients: [
            { name: 'Gin', amount: '30 ml' },
            { name: 'Campari', amount: '30 ml' },
            { name: 'Sweet Vermouth', amount: '30 ml' },
        ]
    });

    await db.close();
};

run().catch(console.error);
