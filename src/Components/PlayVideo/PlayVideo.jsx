import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import moment from 'moment'; // For date formatting

import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideoData = async () => {
    try {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      const data = await response.json();
      setApiData(data.items[0]);
    } catch (error) {
      console.error("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherData = async () => {
    try {
      // Fetching channel data
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelResponse = await fetch(channelData_url);
      const channelData = await channelResponse.json();
      setChannelData(channelData.items[0]);

      // Fetching comment data
      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
      const commentResponse = await fetch(comment_url);
      const commentData = await commentResponse.json();
      setCommentData(commentData.items || []);
    } catch (error) {
      console.error("Error fetching other data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  // Format numbers (e.g., 1000 → "1K", 1500000 → "1.5M")
  const formatNumber = (num) => {
    if (!num) return "0";
    num = parseInt(num);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (loading) return <div>Loading...</div>;
  if (!apiData) return <div>Failed to load video data.</div>;

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <h3>{apiData.snippet?.title || "Title Here"}</h3>

      <div className="play-video-info">
        <p>
          {formatNumber(apiData.statistics?.viewCount) || "N/A"} Views •{" "}
          {apiData.snippet?.publishedAt
            ? moment(apiData.snippet.publishedAt).fromNow()
            : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="Like" />
            {formatNumber(apiData.statistics?.likeCount)}
          </span>
          <span>
            <img src={dislike} alt="Dislike" />
            {formatNumber(apiData.statistics?.dislikeCount || 0)}
          </span>
          <span>
            <img src={share} alt="Share" />
            Share
          </span>
          <span>
            <img src={save} alt="Save" />
            Save
          </span>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img
          src={channelData?.snippet.thumbnails.default.url || user_profile}
          alt="Channel"
        />
        <div>
          <p>{apiData?.snippet.channelTitle || "Channel Name"}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "1M"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        <p>
          {apiData?.snippet.description.slice(0, 250) ||
            "Description Here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 0}{" "}
          Comments
        </h4>

        {commentData.length > 0 ? (
          commentData.map((comment, index) => (
            <div key={index} className="comment">
              <img
                src={
                  comment.snippet.topLevelComment.snippet.authorProfileImageUrl ||
                  user_profile
                }
                alt="User"
              />
              <div>
                <h3>
                  {comment.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>
                    {moment(
                      comment.snippet.topLevelComment.snippet.publishedAt
                    ).fromNow()}
                  </span>
                </h3>
                <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="Like" />
                  <span>
                    {formatNumber(
                      comment.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="Dislike" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;