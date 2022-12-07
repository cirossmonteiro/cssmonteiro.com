import { faCalendarDays, faLink, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export interface ITwitterProfileUIProps {
  username: string;

  description: string;
  displayName: string;
  followers: string;
  following: string;
  headerPhoto: string;
  joinDate: string;
  location: string;
  posts: any[];
  profilePicture: string;
  url: string;
  
}

const TwitterProfileUI = (props: ITwitterProfileUIProps) => {
  console.log(11, props);
  return (
    <Main>
      <Header>
        123 tweets
      </Header>
      <Cover>
        <img src={props.headerPhoto}/>
      </Cover>
      <Body className="d-flex flex-column">
        <div className="p-1 image-holder">
          <img src={props.profilePicture}/>
        </div>
        <h3 className="mt-3 mb-0">{props.displayName}</h3>
        <span className="username">@{props.username}</span>
        <span className="mt-3 description">{props.description}</span>

        <div className="mt-2 first-info">
          <span>
            <FontAwesomeIcon icon={faLocationPin} />
            <span className="ms-2">{props.location}</span>
          </span>
          <span className="ms-3">
            <FontAwesomeIcon icon={faLink} />
            <span className="ms-2">
              <a href={`http://${props.url}`} target="_blank">{props.url}</a>
            </span>
          </span>
          <span className="ms-3">
            <FontAwesomeIcon icon={faCalendarDays} />
            <span className="ms-2">{props.joinDate}</span>
          </span>
        </div>

        <div className="mt-2 second-info">
          <a href={`/${props.username}/following`}>
            <span className="me-1 number">{props.following}</span>
            following
          </a>

          <a href={`/${props.username}/following`} className="ms-3">
            <span className="me-1 number">{props.followers}</span>
            followers
          </a>
        </div>

      </Body>
      {props.username}
    </Main>
  )
}

const Main = styled.main`
  width: 600px;
  background: #15202B;
`

const Header = styled.div`
`;

const Cover = styled.div`
  img {
    width: 100%;
  }
`;

const Body = styled.div`
  margin: 0 16px;

  .image-holder {
    width: max-content;
    border-radius: 50%;
    background: #15202B;
    margin-top: -65px;
  }

  img {
    width: 135px;
    height: 135px;
    border-radius: 50%;
  }

  h3 {
    color: white;
    font-weight: bold;
  }

  .username {
    color: #8895A2;
  }

  .description {
    color: white;
  }

  .first-info {
    color: #8895A2;

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .second-info {
    a {
      color: #8895A2;
      text-decoration: none;
      
    }

    a:hover {
      text-decoration: underline;
      text-decoration-color: white;
    }

    .number {
      color: white !important;
    }
  }
`;

export default TwitterProfileUI;