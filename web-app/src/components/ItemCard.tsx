import { Ad } from "../customTypes"
import { fetchTelegramPic } from "../services";
import { useState, useEffect } from "react";

type CardProps = {
    adData: Ad
}

export default function ItemCard({ adData }: CardProps) {
    const [pic, setPic] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (adData.photos.length > 0) {
            // file_ids for pics of different quality are different.
            // Here the second last is used which is ok for a thumbnail.
            fetchTelegramPic(adData.photos[0][1].file_id)
                .then(async blob => {
                    if (blob) {
                        const objectURL = URL.createObjectURL(blob);
                        setPic(objectURL);
                    }
                })
        }
    }, [])

    return (
        <div className="card media p-0" style={{ width: "95%" }}>
            <figure className="image is-128x128 media-left m-1
                is-flex is-flex-direction-column is-justify-content-center">
                { 
                    pic ?
                    <img src={pic} alt="Ad pic"/>
                    : null
                }
            </figure>
            <div className="media-content">
                <div className="content m-3">
                    <p>
                        <small><i>{adData.category}</i></small>
                        <br></br>
                        <strong>{adData.title}</strong>
                        <br></br>
                        {adData.price}
                        <br />
                        <small>
                            By <a href={`https://t.me/${adData.username}`}>{adData.username}</a> at {new Date(adData.timestamp).toDateString()}
                        </small>
                    </p>
                </div>
            </div>
        </div>
    )
}