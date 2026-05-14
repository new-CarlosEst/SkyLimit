export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    favoriteAirportId: number | null;
}

export interface Contact {
    name: string;
    surname: string;
    email: string;
    theme: string;
    message: string;
}
