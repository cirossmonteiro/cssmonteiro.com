import styled from "styled-components";
import Endpoint from "./endpoint";
import { ENDPOINTS, } from "./endpoints";


const APIDocs = () => {
  const endpointsJSX = ENDPOINTS.map(props => <Endpoint key={props.path} {...props} className="mb-2" />);
  return (
    <div>api docs
      <Container className="d-flex flex-column">
        {endpointsJSX}
      </Container>
    </div>
  )
}

const Container = styled.div`
  max-width: max-content;
`;

export default APIDocs;