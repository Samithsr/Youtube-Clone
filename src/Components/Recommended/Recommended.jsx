import React, { useEffect, useState } from 'react'
import './Recommended.css'

import { API_KEY } from '../../data'
import { value_converter } from '../../data'
import { Link } from 'react-router-dom'

const Recommended = ({categoryId}) => {

const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    const relativeVideo_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`
    await fetch(relativeVideo_url).then(res=>res.json()).then(data=>setApiData(data.items))
  }


  useEffect(()=>{
    fetchData();
  },[])
   
  return (
    <div className='recomended'>
      {apiData.map((items,index)=>{
        return(

      <Link to={`/video/${items.snippet.categoryId}/${items.id}`} key={index} className="side-video-list">
        <img src={items.snippet.thumbnails.medium.url} alt="" />
        <div className="vid-info">
          <h4>{items.snippet.title} </h4>
          <p>{items.snippet.channelTitle}</p>
          <p>{value_converter(items.statistics.viewCount)} Views</p>
        </div>
      </Link>
        )
      })}
    </div>
  )
}

export default Recommended