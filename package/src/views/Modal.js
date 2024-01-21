// import { Fragment } from "react";
// import './Modal.css';
// // import './Style.css';

// export const Modal = (props) => {

//     const cssClasses = ["backdrop", props.show ? "show" : "hide"];
//     const cssClassesModal = ["modal", props.show ? "show" : "hide"];
//     console.log('Modal Props:', props);
  
//     const deleteHandler = () => {
//       props.onRemoveProduct();
//     };
  
//     return (
//       <Fragment>
//         <div onClick={props.hide} className={cssClasses.join(" ")}></div>
//         <div className={`modal show`}>
//           <p>Ar tikrai norite pašalinti?</p>
//           <button className="button" onClick={deleteHandler}>
//             Taip
//           </button>
//           <button className="button" onClick={props.hide}>
//             Ne
//           </button>
//         </div>
//       </Fragment>
//     );
//   };
  
import React from "react";
import './Modal.css';
// import { xcss, styles } from '@atlaskit/primitives';

// const backdropStyles = xcss({
//   position: 'fixed',
//   width: '100%',
//   height: '100%',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   zIndex: 2,
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
// });

// const modalStyles = xcss({
//   zIndex: 3,
//   border: '1px solid #eee',
//   backgroundColor: 'white',
//   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
//   borderRadius: '14px',
//   padding: '10px',
//   textAlign: 'center',
//   boxSizing: 'border-box',
//   width: '50%',
//   cursor: 'default',
//   fontWeight: 'bold',
//   fontSize: '20px',
//   [styles.media.maxWidth(760)]: {
//     width: '80%',
//   },
// });

// const showStyles = xcss({
//   display: 'flex',
//   backgroundColor: 'white',
// });

// const hideStyles = xcss({
//   display: 'none',
// });

// const buttonStyles = xcss({
//   cursor: 'pointer',
//   backgroundColor: 'black',
//   color: 'white',
//   border: '1px solid #6cc7dd',
//   borderRadius: '4px',
//   padding: '0.5rem',
//   textAlign: 'center',
//   width: '4rem',
//   fontWeight: 'bold',
//   margin: '0.5rem',
// });

// const hoverStyles = xcss({
//   backgroundColor: '#6cc7dd',
//   borderColor: '#6cc7dd',
// });


export const Modal = (props) => {
  console.log('Modal Props:', props);
  return (
    <div className={`modal ${props.show ? "show" : "hide"}`}>
      <p>Ar tikrai norite pašalinti?</p>
      <button className="button" onClick={props.onRemoveProduct}>
        Taip
      </button>
      <button className="button" onClick={props.hide}>
        Ne
      </button>
    </div>
  );
};

  
  
  

