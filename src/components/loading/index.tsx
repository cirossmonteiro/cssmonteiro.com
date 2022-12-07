import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Loading = () => {
  return (
    <Container>
      <FontAwesomeIcon className="animation" icon={faSpinner} />
      <span className="ms-1">Loading...</span>
    </Container>
  );
}

const Container = styled.div`
  .animation {
    animation-name: rotating;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes rotating {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loading;