import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Cocktail from "./models/Cocktail";
import { randomUUID } from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection("cocktails");
    } catch (e) {
        console.log("Collections not present, skipping drop...");
    }

    const [admin1, admin2] = await User.create(
        {
            username: "Admin",
            password: "Admin123",
            displayName: "Super Admin",
            avatar: "images/avatars/admin1.jpeg",
            role: "admin",
            token: randomUUID(),
        },
        {
            username: "Moderator",
            password: "Mod12345",
            displayName: "Cocktail Moderator",
            avatar: "images/avatars/admin2.jpeg",
            role: "admin",
            token: randomUUID(),
        }
    );

    const [user1, user2, user3] = await User.create(
        {
            username: "UserJohn",
            password: "User123",
            displayName: "John Mixer",
            avatar: "images/avatars/user1.jpeg",
            role: "user",
            token: randomUUID(),
        },
        {
            username: "UserJane",
            password: "User123",
            displayName: "Jane Shaker",
            avatar: "images/avatars/user2.jpeg",
            role: "user",
            token: randomUUID(),
        },
        {
            username: "UserMike",
            password: "User123",
            displayName: "Mike Stirrer",
            avatar: "images/avatars/user3.jpeg",
            role: "user",
            token: randomUUID(),
        }
    );


    await Cocktail.create(
        {
            user: user1._id,
            title: "Gin & Tonic",
            image: "images/cocktails/gin_tonic.jpeg",
            recipe: "Mix gin and tonic water with ice. Garnish with lime.",
            published: true,
            ingredients: [
                { name: "Gin", amount: "50 ml" },
                { name: "Tonic water", amount: "100 ml" },
                { name: "Lime", amount: "1 slice" },
            ],
        },
        {
            user: user2._id,
            title: "Whiskey Sour",
            image: "images/cocktails/whiskey_sour.jpeg",
            recipe:
                "Combine whiskey, lemon juice, and sugar syrup. Shake with ice and strain.",
            published: false,
            ingredients: [
                { name: "Whiskey", amount: "45 ml" },
                { name: "Lemon juice", amount: "30 ml" },
                { name: "Sugar syrup", amount: "15 ml" },
            ],
        },
        {
            user: user3._id,
            title: "Mojito",
            image: "images/cocktails/mojito.jpeg",
            recipe:
                "Muddle mint leaves with sugar and lime juice. Add rum and top with soda.",
            published: true,
            ingredients: [
                { name: "White rum", amount: "50 ml" },
                { name: "Mint leaves", amount: "10" },
                { name: "Soda water", amount: "100 ml" },
                { name: "Sugar", amount: "2 tsp" },
            ],
        },
        {
            user: admin1._id,
            title: "Old Fashioned",
            image: "images/cocktails/old_fashioned.jpeg",
            recipe: "Stir whiskey, bitters, and sugar. Serve over ice with orange peel.",
            published: true,
            ingredients: [
                { name: "Whiskey", amount: "45 ml" },
                { name: "Bitters", amount: "2 dashes" },
                { name: "Sugar cube", amount: "1" },
            ],
        },
        {
            user: admin2._id,
            title: "Negroni",
            image: "images/cocktails/negroni.jpeg",
            recipe: "Mix gin, Campari, and sweet vermouth. Serve over ice with orange slice.",
            published: false,
            ingredients: [
                { name: "Gin", amount: "30 ml" },
                { name: "Campari", amount: "30 ml" },
                { name: "Sweet vermouth", amount: "30 ml" },
            ],
        }
    );

    await db.close();
};

run().catch(console.error);
