import React, { useEffect, useState } from "react";
import "./Feed.css";

import thumbnail1 from "../../assets/thumbnail1.png";
import thumbnail2 from "../../assets/thumbnail2.png";
import thumbnail3 from "../../assets/thumbnail3.png";
import thumbnail4 from "../../assets/thumbnail4.png";
import thumbnail5 from "../../assets/thumbnail5.png";
import thumbnail6 from "../../assets/thumbnail6.png";
import thumbnail7 from "../../assets/thumbnail7.png";
import thumbnail8 from "../../assets/thumbnail8.png";
import { data, Link } from "react-router-dom";
import { API_KEY } from "../../data";
import moment from "moment";






// const [data,setData] = useState([]);

//   const fetchdata = async () => {
//     const videoList_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`
//     await fetch(videoList_url).then(Response=>Response.json()).then(data=>setData(data.item))
//   }


//   useEffect(()=>{
//     fetchdata();
//   },[category])
const Feed = ({category}) => {

  const [data,setData] = useState([]);
  const fetechdata = async () => {
    const VideoList_url = ` https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`
    await fetch(VideoList_url).then(Response=>Response.json()).then(data=>setData(data.items))
  }

  useEffect(()=> {
    fetechdata();
  },[category])


  const value_converter = (value) => {
    if(value>=1000000) {
        return Math.floor(value/1000000)+"M";
    }
    else if(value>=1000) {
        return Math.floor(value/1000)+"K"
    }
    else{
        return value;
    }
}



  return (
    <div className="feed">
      {data?.map((item,index)=>{
        return(

      <Link to={`video/${item.snippet.categoryId}/${item.id}`} className="card">
        <img src={item.snippet.thumbnails.medium.url} alt="" />
        <h2>{item.snippet.title}</h2>
        <h3>{item.snippet.channelTitle}</h3>
        <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
      </Link>
        )

      })}
    </div>
  );
};

export default Feed;
