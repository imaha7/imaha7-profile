import HomeClient from "./home-client";
import HomeHeading from "./home-heading";

export default function Home() {
  return <HomeClient heroHeading={<HomeHeading />} />;
}
