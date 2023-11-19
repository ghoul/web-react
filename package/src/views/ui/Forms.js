import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";

const Forms = () => {
  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i class="bi bi-arrow-through-heart-fill me-2"></i>
            Naujo triuko įkėlimas
          </CardTitle>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="link">Nuoroda</Label>
                <Input id="link" name="link" type="textarea" style={{ height: '30px' }} />
              </FormGroup>
              <FormGroup>
                <Label for="title">Pavadinimas</Label>
                <Input id="title" name="title" type="textarea" style={{ height: '30px' }} />
              </FormGroup>
              <FormGroup>
                <Label for="description">Aprašymas</Label>
                <Input id="description" name="description" type="textarea" style={{ height: '60px' }} />
              </FormGroup>
              <FormGroup>
                <Label for="category">Kategorija</Label>
                <Input id="category" name="category" type="select">
                  <option>1A</option>
                  <option>2A</option>
                  <option>3A</option>
                  <option>4A</option>
                  <option>5A</option>
                </Input>
              </FormGroup>
              <Button>Įrašyti</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;
