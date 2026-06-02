'use server';

import { getOrCreateDbUser } from "./getOrCreateDbUser";

export const isUserAdmin = async() => {
    const dbUser = await getOrCreateDbUser();

    if(dbUser?.role === 'admin') {
        return true;
    }

    return false;
};
