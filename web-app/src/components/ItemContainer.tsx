import { useState, useEffect } from 'react';
import { Ad } from '../customTypes';
import ItemCard from './ItemCard';
import fetchAllAds from '../services';

export default function ItemContainer() {
    const [adsData, setAdsData] = useState<Ad[]>([]);
    const [page, setPage] = useState<number>(1);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllAds().then(data => setAdsData(data));
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
                adsData.length > 0 && adsData.slice(0, itemsPerPage * page).map((ad: Ad) => {
                    return (
                        <ItemCard key={ad._id} adData={ad} />
                    )
                })
            }
            {
                adsData.length > itemsPerPage * page ?
                <button className="button is-success m-2" 
                onClick={() => setPage(page + 1)}>Load more</button> :
                null
            }
        </section>
    )
}