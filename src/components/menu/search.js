import React, { useState, useEffect } from 'react';

function Search({ allNfts }) {
    const [searchShow, setSearchShow] = useState(false);
    const [dataTemp, setDataTemp] = useState([]);

    const showSearchData = (e) => {
        let input = e.target.value;
        if (input.length <= 0) {
            setDataTemp(allNfts);
        } else {
            let data_ = allNfts.filter((item) => {
                if (item.title.toLowerCase().includes(input.toLowerCase())) {
                    return item;
                }
            });
            setDataTemp(data_);
        }
    };

    useEffect(() => {
        setDataTemp(allNfts);
    }, [allNfts]);

    return (
        <>
            <div className='de-flex-col quick_search_div'>
                <input
                    type='text'
                    id='quick_search'
                    name='quick_search'
                    placeholder='Search item here...'
                    onChange={showSearchData}
                    onFocus={() => setSearchShow(true)}
                    onBlur={() =>
                        setTimeout(() => {
                            setSearchShow(false);
                        }, 500)
                    }
                />
                {searchShow && (
                    <div className='quick_search-wrapper'>
                        {dataTemp &&
                            dataTemp.map((item) => (
                                <NFT id={item._id} artwork={item.imageUrl} title={item.title} />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}

const NFT = ({ id, artwork, title }) => {
    return (
        <a href={`/detail/${id}`} className='d-flex align-items-center'>
            <div className=''>
                <div className='img-wrapper'>
                    <img crossOrigin='anonymous' src={artwork} className='lazy ' alt='' />
                </div>
            </div>
            <div>
                <p className='mb-0'>{title}</p>
            </div>
        </a>
    );
};

export default Search;