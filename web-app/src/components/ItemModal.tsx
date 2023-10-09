/* eslint-disable jsx-a11y/anchor-is-valid */
import { Ad } from "../customTypes";
import { useState, useEffect, /* useRef */ } from "react";
import { fetchTelegramPic, sendAdToUser } from "../services";
import spinner from "../assets/spinner.gif";
import chevron from "../assets/up_chevron.png";
import Notification from "./Notification";
import './ItemModal.css';

type ItemModalProps = {
    trigger: () => void;
    adData: Ad;
}

export default function ItemModal({ trigger, adData }: ItemModalProps) {
    const [pic, setPic] = useState<string | undefined>(undefined);
    const [notify, setNotify] = useState<boolean>(false);
    // const [fadeOut, setFadeOut] = useState<boolean>(false);

    // const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (adData.photos.length > 0) {
            // file_ids for pics of different quality are different.
            // If the original image is low-res, need to be aware of missing photo sizes.
            let file_id = "";
            if (adData.photos[2]) {
                file_id = adData.photos[2].file_id;
            } else {
                file_id = adData.photos[adData.photos.length - 1].file_id;
            }
            fetchTelegramPic(file_id)
                .then(async blob => {
                    if (blob) {
                        const objectURL = URL.createObjectURL(blob);
                        setPic(objectURL);
                    } else {
                        setPic("no_photo");
                    }
                })
        } else {
            setPic("no_photo");
        }

        // if (modalContentRef.current) {
        //     const target = modalContentRef.current;
        //     console.log(target.scrollHeight, target.clientHeight);
        //     setTimeout(() => {
        //         if (target.scrollHeight > target.clientHeight) {
        //             setFadeOut(true);
        //         }
        //     }, 100);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className="modal is-active"
        >
            <div
                className="modal-background"
            >
                <div
                    className="modal-content mt-3 mb-0"
                    // ref={modalContentRef}
                    // onScroll={(e) => {
                    //     const target = e.target as HTMLDivElement;
                    //     if (target.scrollTop === 0) {
                    //         setFadeOut(true);
                    //     } else if (target.scrollTop > 0) {
                    //         setFadeOut(false);
                    //     }
                    // }}
                    style={{
                        maxHeight: "95vh",
                        position: "fixed",
                        bottom: 0,
                        transform: "translateX(-50%)",
                        animation: "slide-up 0.4s ease-out forwards",
                        zIndex: 9
                    }}
                >
                    <div
                        className="card"
                        style={{
                            width: "90%",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                    >
                        <header
                            className="card-header is-flex is-justify-content-center"
                        >
                            <span className="icon">
                                <img
                                    src={chevron}
                                    alt="Up chevron"
                                />
                            </span>
                        </header>
                        <div
                            className="card-image"
                        >
                            {
                                pic === "no_photo" ?
                                    null
                                    : <figure
                                        className="image">
                                        {
                                            pic ?
                                                <img
                                                    src={pic}
                                                    alt="Ad pic"
                                                />
                                                : <img
                                                    src={spinner}
                                                    alt="Loading spinner"
                                                />
                                        }
                                    </figure>
                            }
                        </div>
                        <div
                            className="card-content"
                        >
                            <p className="subtitle"><strong>{adData.title}</strong></p>
                            <p className="subtitle is-size-6">{adData.description}</p>
                            <p className="subtitle">{adData.price}</p>
                        </div>
                        <div
                            className="card-footer"
                        >
                            <footer
                                className="card-footer"
                                style={{ width: "100%" }}
                            >
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sendAdToUser(adData._id)
                                            .then(() => { setNotify(true) })
                                    }}
                                    href="#"
                                    className="card-footer-item"
                                    style={{ maxWidth: "20%" }}
                                >
                                    Save
                                </a>
                                <a
                                    href={`https://t.me/${adData.username}`}
                                    className="card-footer-item"
                                >
                                    Contact {adData.username}
                                </a>
                                <a
                                    href="#"
                                    className="card-footer-item"
                                    style={{ maxWidth: "20%" }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        trigger();
                                    }}
                                >
                                    Close
                                </a>
                            </footer>
                        </div>
                    </div>
                    {/* {
                        fadeOut ?
                            <div
                                style={{
                                    position: "fixed",
                                    bottom: 0,
                                    background: "linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                                    width: "90%",
                                    height: "5em",
                                    zIndex: 99,
                                    animation: "fade-in 0.4s ease-out forwards"
                                }}
                            >
                            </div>
                            : null
                    } */}
                </div>
            </div>
            {
                notify ?
                    <Notification
                        notification="Ad sent to chat"
                    />
                    : null
            }
        </div>
    )
}