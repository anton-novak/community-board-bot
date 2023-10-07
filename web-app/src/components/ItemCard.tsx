import { Ad } from "../customTypes"
import { deleteAd, fetchTelegramPic } from "../services";
import { useState, useEffect } from "react";
import ItemModal from "./ItemModal";
// https://loading.io/
import spinner from "../assets/spinner.gif";
import placeholder from "../assets/no_photo_128.png";

type CardProps = {
    adData: Ad;
    office?: boolean;
    deleteAdInMemory: (_id: string) => void;
    setNotify: (value: boolean) => void;
}

export default function ItemCard({ adData, office, deleteAdInMemory, setNotify }: CardProps) {
    const [pic, setPic] = useState<string | undefined>(undefined);
    const [showModal, setShowModal] = useState<boolean>(false);

    function triggerModal() {
        console.log("triggered");
        setShowModal(!showModal);
    }

    const shadowStyle = {
        boxShadow: "0 0.5em 1em -0.125em rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.02)"
    };

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
        } else {
            setPic(placeholder);
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
                    <figure className="image is-128x128 media-left m-2
                is-flex is-flex-direction-column is-justify-content-center">
                        {
                            pic ?
                                <img src={pic} alt="Ad pic" style={shadowStyle}/>
                                : <img src={spinner} alt="Loading spinner" style={shadowStyle}/>
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
                <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-content-center m-2">
                    <p className="subtitle is-size-7 m-2 has-text-centered">
                        By <a href={`https://t.me/${adData.username}`}>{adData.username}</a> at {new Date(adData.timestamp).toDateString()}
                    </p>
                    {
                        office ?
                            <button className="button is-danger is-small"
                                onClick={(e) => {
                                    deleteAd(adData._id)
                                        .then((res) => {
                                            if (res.status !== 404) { 
                                                setNotify(true);
                                                deleteAdInMemory(adData._id);
                                            }
                                        })
                                }}
                            >Delete</button>
                            : null
                    }
                </div>
            </div>
            {
                showModal ?
                    <ItemModal trigger={triggerModal} adData={adData}></ItemModal>
                    : null
            }
        </>
    )
}