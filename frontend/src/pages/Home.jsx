import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../index.css"
import VacanciesList from "./VacanciesList"

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div className="content">
        {" "}

        <VacanciesList></VacanciesList>
      </div>
    </div>
  );
}
