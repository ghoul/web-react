import { Col, Row } from "reactstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Blog from "../components/dashboard/Blog";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
function Category() {
  const { categoryName } = useParams();
  const [tricks, setTricks] = useState([]);
  const navigate  = useNavigate();
  const [categoryID, setCategoryID] = useState(null);
  let token = localStorage.getItem('token'); 
  useEffect(() => {
    if (categoryName) {
      console.log("grazino category name: " + categoryName);
      axios.get(`http://localhost:8000/category/type/${categoryName}/`, {
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          // Assuming the response is an array and the first item contains the category ID
          const categoryId = response.data.id;
          setCategoryID(categoryId);
          console.log("grazino category id: " + categoryId);
      // Fetch tricks for the specific category from the backend.
      axios.get(`http://localhost:8000/categories/${categoryID}/tricks/`, {
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json"
        },
      })
        .then(async (response) => {
          console.log('response:', response.data); // Add this line for debugging

          // Fetch video thumbnails for each trick
          const tricksWithThumbnails = await Promise.all(response.data.map(async (trick) => {
            // Use a regular expression to extract the video ID from the YouTube URL
            const videoIdMatch = trick.link.match(/(?:v=|\/embed\/|\/youtu.be\/)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
          
            if (videoId) {
              // Fetch video details to get the thumbnail URL
              const videoDetailsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDdHocXdvZETR2mU60Jo3fKRuL8xto7Mpo`);
              const thumbnailUrl = videoDetailsResponse.data.items[0].snippet.thumbnails.medium.url;
          
              // Add the thumbnail URL and video ID to the trick object
              return { ...trick, thumbnailUrl, videoId };
            } else {
              // Handle cases where the YouTube URL is invalid or doesn't contain a video ID
              return { ...trick, thumbnailUrl: null, videoId: null };
            }
          }));
          

          setTricks(tricksWithThumbnails);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        // Handle case where category with the specified name was not found
        console.error('Category not found');
      }
    })
    .catch((error) => {
      console.error('Error fetching category ID:', error);
    });
}
}, [categoryName,categoryID]);


  const send = (event) => {
    navigate('/');
  }
  return (
    <div>
      <Button style={{ backgroundColor: '#191a1f', color: 'white', marginBottom: '10px' }} onClick={send}> ← Į pradžią</Button>
      <h2>{categoryName} Triukai</h2>
      <Row>
        {tricks.map((trick, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={trick.thumbnailUrl} // Use the fetched thumbnail URL
              title={trick.title}
              text={trick.description}
              category={categoryName}
              id={trick.id}
            >
            </Blog>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Category;