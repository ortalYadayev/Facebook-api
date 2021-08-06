import {EntitySchema} from "typeorm";
import {User} from "../models/User";

export const UserEntity = new EntitySchema<User>({
    name: "users",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String,
        }
    },
});
