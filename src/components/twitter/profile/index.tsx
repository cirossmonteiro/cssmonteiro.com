import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selenium } from "../../../api";
import Loading from "../../loading";
import TwitterProfileUI, { ITwitterProfileUIProps } from "./ui";

const initialState: ITwitterProfileUIProps = {
  username: "username",

  description: "description",
  displayName: "displayName",
  followers: "-1",
  following: "-1",
  headerPhoto: "none",
  location: "nowhere",
  joinDate: "never",
  posts: [],
  profilePicture: "none",
  url: ".com"
};

const TwitterProfile = () => {
  const { username = "bbc" } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ITwitterProfileUIProps>(initialState);

  useEffect(() => {
    setIsLoading(true);
    console.log(29, username);
    selenium.twitter.username(username).then(d => {
      setData(d);
      setIsLoading(false);
    });
  }, [username]);



  return (
    <div className="d-flex flex-column align-items-center">
      {isLoading ? <Loading /> : <TwitterProfileUI {...data} />}
    </div>
  )
}

export default TwitterProfile;