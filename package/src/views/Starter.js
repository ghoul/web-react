import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";

import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/trick1.jpg";
import bg2 from "../assets/images/trick2.jpg";
import bg3 from "../assets/images/trick3.jpg";
import bg4 from "../assets/images/trick4.jpg";
import { useState,useEffect,startTransition  } from "react";
import axios from 'axios';
const Starter = () => {
  const [tricks, setTricks] = useState([]);

  useEffect(() => {
    startTransition(() => {
      axios
        .get("http://localhost:8000/latests/")
        .then(async (response) => {
          // Fetch video details and thumbnails for each trick
          const tricksWithThumbnails = await Promise.all(
            response.data.map(async (trick) => {
              // Use a regular expression to extract the video ID from the YouTube URL
              const videoIdMatch = trick.link.match(
                /(?:v=|\/embed\/|\/youtu.be\/)([a-zA-Z0-9_-]{11})/
              );
              const videoId = videoIdMatch ? videoIdMatch[1] : null;

              if (videoId) {
                // Fetch video details to get the thumbnail URL
                const videoDetailsResponse = await axios.get(
                  `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDdHocXdvZETR2mU60Jo3fKRuL8xto7Mpo`
                );
                const thumbnailUrl =
                  videoDetailsResponse.data.items[0].snippet.thumbnails.medium
                    .url;

                // Add the thumbnail URL and video ID to the trick object
                return { ...trick, thumbnailUrl, videoId };
              } else {
                // Handle cases where the YouTube URL is invalid or doesn't contain a video ID
                return { ...trick, thumbnailUrl: null, videoId: null };
              }
            })
          );

          setTricks(tricksWithThumbnails);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, []);
  return (
    <div>
      <div>
        <h1>Aktyvūs namų darbai</h1>
      </div>
      <Row>
        {tricks.map((trick, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={trick.thumbnailUrl}
              title={trick.title}
              text={trick.description}

              link={trick.link}
              category={trick.category}
              id={trick.id}
           
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Starter;


// const BlogData = [
//   {
//     image: bg1,
//     title: "This is simple blog",
//     subtitle: "2 comments, 1 Like",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     btnbg: "primary",
//   },
//   {
//     image: bg2,
//     title: "Lets be simple blog",
//     subtitle: "2 comments, 1 Like",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     btnbg: "primary",
//   },
//   {
//     image: bg3,
//     title: "Don't Lamp blog",
//     subtitle: "2 comments, 1 Like",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     btnbg: "primary",
//   },
//   {
//     image: bg4,
//     title: "Simple is beautiful",
//     subtitle: "2 comments, 1 Like",
//     description:
//       "This is a wider card with supporting text below as a natural lead-in to additional content.",
//     btnbg: "primary",
//   },
// ];