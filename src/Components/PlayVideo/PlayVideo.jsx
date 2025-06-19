import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import moment from 'moment';
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
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Video API error:', errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]);
            } else {
                console.error('No video data found');
                setApiData(null);
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
            setApiData(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherData = async () => {
        if (!apiData?.snippet?.channelId) return;

        try {
            // Fetching channel data
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelData_url);
            if (!channelResponse.ok) {
                throw new Error(`HTTP error! Status: ${channelResponse.status}`);
            }
            const channelData = await channelResponse.json();
            if (channelData.items && channelData.items.length > 0) {
                setChannelData(channelData.items[0]);
            }

            // Fetching comment data
            // const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
            const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
            const commentResponse = await fetch(comment_url);
            if (!commentResponse.ok) {
                const errorText = await commentResponse.text();
                console.error('Comment API error:', errorText);
                throw new Error(`HTTP error! Status: ${commentResponse.status}`);
            }
            const commentData = await commentResponse.json();
            setCommentData(commentData.items || []);
        } catch (error) {
            console.error('Error fetching other data:', error);
            setCommentData([]);
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

    const formatNumber = (num) => {
        if (!num) return '0';
        num = parseInt(num);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    if (loading) return <div>Loading...</div>;
    if (!apiData) return <div>Failed to load video data. Check API key or video ID.</div>;

    return (
        <div className='play-video'>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
            <h3>{apiData.snippet?.title || 'Title Here'}</h3>
            <div className="play-video-info">
                <p>
                    {formatNumber(apiData.statistics?.viewCount) || 'N/A'} Views •{' '}
                    {apiData.snippet?.publishedAt ? moment(apiData.snippet.publishedAt).fromNow() : ''}
                </p>
                <div>
                    <span><img src={like} alt="" />{formatNumber(apiData.statistics?.likeCount)}</span>
                    <span><img src={dislike} alt="" />{formatNumber(apiData.statistics?.dislikeCount)}</span>
                    <span><img src={share} alt="" />Share</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData?.snippet.thumbnails.default.url || user_profile} alt="" />
                <div>
                    <p>{apiData.snippet?.channelTitle || ''}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : 'N/A'} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{apiData.snippet?.description.slice(0, 250) || 'Description Here'}</p>
                <hr />
                <h4>{formatNumber(apiData.statistics?.commentCount) || '0'} Comments</h4>
                {commentData.length > 0 ? (
                    commentData.map((comment, index) => (
                        <div className="comment" key={index}>
                            <img
                                src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl || user_profile}
                                alt=""
                            />
                            <div>
                                <h3>
                                    {comment.snippet.topLevelComment.snippet.authorDisplayName}{' '}
                                    <span>{moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                                </h3>
                                <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="" />
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

export default PlayVideo