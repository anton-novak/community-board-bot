import { useState, useEffect } from 'react';
import { Ad } from '../customTypes';
import ItemCard from './ItemCard';
import fetchAllAds, { fetchUserAds, getUsername } from '../services';

type ItemContainerProps = {
    sortBy: string;
    category: string;
    office?: boolean;
}

export default function ItemContainer({ sortBy, category, office }: ItemContainerProps) {
    const [adsData, setAdsData] = useState<Ad[]>([]);
    const [page, setPage] = useState<number>(1);

    const itemsPerPage = 10;

    const filteredAds = adsData
        .filter((ad: Ad) => {
            return ad.category === category || category === "All ads";
        })
        .sort((a: Ad, b: Ad) => {
            if (sortBy === "Latest first") {
                return b.timestamp - a.timestamp;
            } else {
                return a.timestamp - b.timestamp;
            }
        });

    function deleteAdInMemory(_id: string) {
        setAdsData(adsData.filter(ad => ad._id !== _id));
    }

    useEffect(() => {
        if (office) {
            fetchUserAds(getUsername(window.Telegram.WebApp.initData))
                .then(data => setAdsData(data));
        } else {
            fetchAllAds()
                .then(data => setAdsData(data));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section style={
            {
                gap: "0.5em"
            }
        }
            className="section is-flex is-flex-direction-column is-align-items-center p-2"
        >
            <p className="subtitle m-2 has-text-centered">Tap an item for more info</p>
            {
                filteredAds.length > 0 && filteredAds
                    .slice(0, itemsPerPage * page)
                    .map((ad: Ad) => {
                        return (
                            <ItemCard key={ad._id} adData={ad} office={office} 
                            deleteAdInMemory={deleteAdInMemory} />
                        )
                    })
            }
            {
                filteredAds.length > itemsPerPage * page ?
                    <button className="button is-success m-2"
                        onClick={() => setPage(page + 1)}>Load more</button> :
                    null
            }
            {
                filteredAds.length === 0 ?
                    <p className="subtitle has-text-centered">No ads found</p> :
                    null
            }
        </section>
    )
}