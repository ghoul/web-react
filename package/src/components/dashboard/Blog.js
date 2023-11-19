import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
const Blog = (props) => {
  // const { categoryName, trickId } = useParams();
  return (
    <Card>
      <CardImg alt="Card image cap" src={props.image} />
      <CardBody className="p-4">
        <CardTitle tag="h5">{props.title}</CardTitle>
        <CardSubtitle>{props.subtitle}</CardSubtitle>
        <CardText className="mt-3">{props.text}</CardText>
        <Button style={{ backgroundColor: '#191a1f' }}>
        <Link to={`/category/${props.category}/trick/${props.id}`} className="nav-link" style={{ color: 'white' }}>
            PERŽIŪRĖTI
          </Link>
       </Button>
      </CardBody>
    </Card>
  );
};

export default Blog;
