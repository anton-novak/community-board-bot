/* eslint-disable jsx-a11y/anchor-is-valid */
import { Ad } from "../customTypes";
import { useState, useEffect } from "react";
import { fetchTelegramPic, /* sendAdToUser */ } from "../services";
import spinner from "../assets/spinner.gif";

type ItemModalProps = {
    trigger: () => void;
    adData: Ad;
}

export default function ItemModal({ trigger, adData }: ItemModalProps) {
    const [pic, setPic] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (adData.photos.length > 0) {
            // file_ids for pics of different quality are different.
            fetchTelegramPic(adData.photos[2].file_id)
                .then(async blob => {
                    if (blob) {
                        const objectURL = URL.createObjectURL(blob);
                        setPic(objectURL);
                    }
                })
        }
    }, [adData.photos])

    return (
        <div className="modal is-active">
            <div className="modal-background">
                <div className="modal-content mt-3"
                    style={{ maxHeight: "95vh" }}>
                    <div className="card" style={{ width: "90%" }}>
                        <div className="card-image">
                            <figure className="image">
                                {
                                    pic ?
                                        <img src={pic} alt="Ad pic" />
                                        : <img src={spinner} alt="Loading spinner" />
                                }
                            </figure>
                        </div>
                        <div className="card-content"
                        >
                            <p className="subtitle"><strong>{adData.title}</strong></p>
                            <p className="subtitle is-size-6">{adData.description}</p>
                            <p className="subtitle">{adData.price}</p>
                        </div>
                        <div className="card-footer">
                            <footer className="card-footer" style={{ width: "100%" }}>
                                {/* <a onClick={(e) => {
                                    e.preventDefault();
                                    sendAdToUser(adData._id);
                                }
                                } href="#" className="card-footer-item" style={{ maxWidth: "20%" }}>Save</a> */}
                                <a href={`https://t.me/${adData.username}`} className="card-footer-item">Contact {adData.username}</a>
                                <a href="#" className="card-footer-item"
                                    style={{ maxWidth: "30%" }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        trigger();
                                    }}
                                >Close</a>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
            {/* <button className="modal-close is-large" aria-label="close"></button> */}
        </div>
    )
}