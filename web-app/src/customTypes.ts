export type Ad = {
    _id: string;
    _rev: string;
    title: string;
    category: string;
    description: string;
    price: string;
    username: string;
    user_id: number;
    timestamp: number;
    photos: PhotoSize[];
}

type PhotoSize = {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    width: number;
    height: number;
}