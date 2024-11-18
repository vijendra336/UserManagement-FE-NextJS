export interface User {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
}



export interface PaginatedUsers {

    users: User[];
    total: number;
}