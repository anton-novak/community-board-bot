import { Ad } from "../customTypes"
import { fetchTelegramPic } from "../services";
import { useState, useEffect } from "react";
import ItemModal from "./ItemModal";
// https://loading.io/
import spinner from "../assets/spinner.gif";

type CardProps = {
    adData: Ad
}

export default function ItemCard({ adData }: CardProps) {
    const [pic, setPic] = useState<string | undefined>(undefined);
    const [showModal, setShowModal] = useState<boolean>(false);

    function triggerModal() {
        console.log("triggered");
        setShowModal(!showModal);
    }

    // TODO: placeholder pic for no pic ads here and in modal.

    useEffect(() => {
        if (adData.photos.length > 0) {
            // file_ids for pics of different quality are different.
            // Here the second last is used which is ok for a thumbnail.
            console.log(adData.photos)
            fetchTelegramPic(adData.photos[1].file_id)
                .then(async blob => {
                    if (blob) {
                        const objectURL = URL.createObjectURL(blob);
                        setPic(objectURL);
                    }
                })
        }
    }, [adData.photos])

    return (
        <>
            <div className="box p-0" style={{ width: "95%" }}
                onClick={(e) => {
                    e.stopPropagation();
                    triggerModal();
                }}
            >
                <div className="media">
                    <figure className="image is-128x128 media-left m-1
                is-flex is-flex-direction-column is-justify-content-center">
                        {
                            pic ?
                                <img src={pic} alt="Ad pic" />
                                : <img src={spinner} alt="Loading spinner" />
                        }
                    </figure>
                    <div className="media-content">
                        <div className="content m-3">
                            <p>
                                <small className="tag mb-1 is-light"><i>{adData.category}</i></small>
                                <br></br>
                                <strong>{adData.title}</strong>
                                <br></br>
                                {adData.price}
                                <br />
                            </p>
                        </div>
                    </div>
                </div>
                <p className="subtitle is-size-7 m-2 has-text-centered">
                    By <a href={`https://t.me/${adData.username}`}>{adData.username}</a> at {new Date(adData.timestamp).toDateString()}
                </p>
            </div>
            {
                showModal ?
                    <ItemModal trigger={triggerModal} adData={adData}></ItemModal>
                    : null
            }
        </>
    )
}