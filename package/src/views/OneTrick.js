import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Modal } from "./Modal.js";
import './Comments.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const OneTrick = () => { //{ userComment, onUpdateComment, onDeleteComment }
  
  const { categoryName, trickId } = useParams();
  const [trick, setTrick] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalC, setShowModalC] = useState(false);
  const [trickiid, setTrickId] = useState();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); 
  const [commentId, setCommentId] = useState();
  const navigate  = useNavigate();
  const [user, setUser] = useState('0');
  let token = localStorage.getItem('token'); 
  let admin = localStorage.getItem('admin'); 
  admin = admin=== "true";
  const decodedToken = jwtDecode(token);
  const usernameFromToken = decodedToken.username;

  useEffect(() => {
    if (trickId) {
      // Fetch tricks for the specific category from the backend.
      axios.get(`http://localhost:8000/categories/1/tricks/${trickId}/`, {
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((response) => {
          setTrick(response.data);
        })
        .catch((error) => {
          console.error('Error fetching trick data:', error);
        });
  
      // Fetch both initial and new comments
      const fetchComments = async () => {
        try {
          const newCommentsResponse = await axios.get(`http://localhost:8000/categories/1/tricks/${trickId}/comments/`, {
            headers: {
              'Authorization' : `${token}`,
              "Content-Type": "application/json"
            },
          });
          
          // Update the state with new comments only, without duplicating existing comments
          setComments([...newCommentsResponse.data.comments].reverse());
        } catch (error) {
          console.error('Error fetching comments data:', error);
        }
      };
  
      // Call the fetchComments function to get initial and new comments
      fetchComments();
    }
  }, [trickId]); // Specify trickId as a dependency
  
  
  const postComment = (commentt) => {
    fetch(`http://localhost:8000/categories/1/tricks/${trickId}/comments/`, {
      method: "POST",
      headers: {
        'Authorization' : `${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commentt),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Response Body: ", data);
      // Fetch comments again after posting a new comment
      axios.get(`http://localhost:8000/categories/1/tricks/${trickId}/comments/`, {
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((response) => {
          setComments(response.data.comments);
          console.log("grazinti komentarai: " + response.data.comments);
        })
        .catch((error) => {
          console.error('Error fetching comments data:', error);
        });
    })
    .catch(error => {
      console.log(error);
    });
  };
  

  const DeleteTrick = () => {
  
    let state = {
      id: trickId,
    };
    

     fetch(`http://localhost:8000/categories/1/tricks/${trickId}/`, {
        method: "DELETE",
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json",
          // "Authorization": "Token yourTokenHere" // If authentication is required
        },
        body: JSON.stringify(state)
      }).then((response) => {
        console.log(response);
        hideModalHandler();
        navigate(`/category/${categoryName}`);
        // window.location.href = `http://localhost:3000/category/${categoryName}`;
      });

    console.log("trinama: "+trickId);
  };

  const showModalHandler = (trickId) => {
    setShowModal(true);
    setTrickId(trickId);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const DeleteComment = () => {
  
    let state = {
      id: commentId,
    };
    

     fetch(`http://localhost:8000/categories/1/tricks/${trickId}/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
          'Authorization' : `${token}`,
          "Content-Type": "application/json",
          // "Authorization": "Token yourTokenHere" // If authentication is required
        },
        body: JSON.stringify(state)
      }).then((response) => {
        console.log(response);
        hideModalHandlerC();
        //window.location.href = `http://localhost:3000/category/${categoryName}/trick/${trickId}`;
        
        window.location.reload();
      });

    console.log("trinama: "+commentId);
  };

  const showModalHandlerC = (commentId) => {
    // Update the commentId state with the provided id
    setCommentId(commentId);
    setShowModalC(true); // Show the modal or perform any other actions
  };
  

  const hideModalHandlerC = () => {
    setShowModalC(false);
  };

  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const createComment = (event) => {
    event.preventDefault();
    const commentt = {
      text: comment,
      trick: trickId,
      user: user
    };
  
    console.log("Request Body: ", JSON.stringify(commentt));
    // Call the postComment function to post the new comment
    postComment(commentt);
  
    setComment('');
  };


  const send = (event) => {
    navigate(`/category/${categoryName}`);
  }
  return (
    <div className="video-page">

       <Modal
        show={showModal}
        hide={hideModalHandler}
        onRemoveProduct={DeleteTrick}
      ></Modal>
      <Modal
        show={showModalC}
        hide={hideModalHandlerC}
        onRemoveProduct={DeleteComment}
      ></Modal>
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}> */}
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        <Button style={{ backgroundColor: '#191a1f', color: 'white', marginRight: '10px', marginBottom: '20px' }} onClick={send}> ← Atgal</Button>
        
        {admin && (<Button style={{ backgroundColor: '#204963', marginLeft: '10px', marginBottom: '20px' }}>
          <Link to={`/category/${categoryName}/trick/${trickId}/edit`} className="nav-link" style={{ color: 'white' }}>
        REDAGUOTI
      </Link>
          </Button>
          )}
          {admin&&(<div style={{ marginLeft: '10px' }}>
            <Button style={{ backgroundColor: 'orange', color: '#204963', marginLeft: '10px', marginBottom: '20px' }}  onClick={() => showModalHandler(trickId)}>
              ŠALINTI
            </Button>
          </div>
          )}
      </div>


       <center>
      <div className="video-container">
        {/* Video Embed Code */}
        <iframe
          width="1000"
          height="600"
          src={trick.link} //"https://www.youtube.com/embed/s6TAE1aezJk" // Use the embed URL
          title={trick.title}
          allowFullScreen
        ></iframe>
      </div>
      <div className="description">
        {/* Description Content */}
        <h2>{trick.title}</h2>
        <p>{trick.description}</p>
      </div>
      </center> 
      <div className="comments">
      <h2>Komentarai</h2>
      <div className="comment-form">
  <form onSubmit={createComment}>
    <input
      type="text"
      className="comment-input"
      placeholder="Pradėkite rašyti..."
      value={comment}
      onChange={handleCommentChange}
    />
    <button type="submit" className="comment-submit">
      Skelbti
    </button>
      </form>
    </div>

      <div className="comment-section">

      {comments && comments.length > 0 ? (
        comments.map((userComment, index) => (
          console.log("userdcommentid: " + userComment.id),
          <div key={index} className="comment">
            <div className="comment-content">
              {/*{userComment.user} */}
              <p className="comment-user">Meistras: {userComment.user}</p> 
              <p className="comment-date">Data: {userComment.date}</p>
              <p className="comment-text">{userComment.text}</p>
            </div>
           {((usernameFromToken === userComment.user) || (admin) )&&(
            <div className="comment-buttons">
            <Link to={`/category/${categoryName}/trick/${trickId}/edit/comment/${userComment.id}`} className="nav-link">
              <button className="comment-button">Redaguoti</button>
            </Link>
            <button className="comment-button" onClick={() => showModalHandlerC(userComment.id)}>Šalinti</button>
            </div>
           )}
          </div>
        ))
      ) : (
        <div className="no-comments-message">
          <p>Komentarų nėra</p>
        </div>
      )}
    </div>

    </div>
    </div>
  );
};

export default OneTrick;
