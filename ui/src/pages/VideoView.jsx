import React, { useEffect, useRef, useState } from 'react'
import '../styles/VideoView.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {duration} from 'moment/moment';

const VideoView = () => {
	const [video, setVideo] = useState(null);
	const videoRef = useRef(null);

	let { cmsVideoId } = useParams();

	let getVideoAPI = "http://localhost:8000" + `/api/videos/${cmsVideoId}`;

	useEffect(() => {
		axios.get(getVideoAPI)
		.then(res => {
			setVideo(res.data.data);
		});
	}, []);

	function jumpToTime(seconds) {
		videoRef.current.currentTime = seconds;
	}
	

	return (
		<div id='video-view'>
			<button className='back-btn'>
				<img src="/assets/left-arrow.svg" alt="Left Arrow Icon" />
				Back
			</button>		
			<div className="video-container">
				<video src={video?.videoUrl || ''} controls ref={videoRef} autoPlay>
					<track label='English' kind='subtitles' srcLang='en' src={video?.vttCaptionsUrl || ''} default />
				</video>
				<div className="timeline">
					<div className='timeline-heading'>
						<h3>Video Timeline</h3>
					</div>
					<div className='timeline-topics'>
						{
							video?.timeline &&
							video?.timeline?.map(timelineEl => 
								<div className='timeline-topic'>
									<span className='topic-name'>
										{timelineEl.topic}
									</span>
									<span className='topic-timestamp' style={{cursor: 'pointer'}} onClick={() => jumpToTime(timelineEl.timestamp/1000)}>
										{String(duration(timelineEl.timestamp, 'milliseconds').minutes()).padStart(2, '0') + ":" + String(duration(timelineEl.timestamp, 'milliseconds').seconds()).padStart(2, '0')}
									</span>
								</div>	
							)
						}
					</div>
					<div className='generate-qns-container'>
						<button>Generate Questions</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoView