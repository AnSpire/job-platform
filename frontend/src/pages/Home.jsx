import { useState } from "react";
import "../index.css"
import VacanciesList from "../components/VacanciesList"

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
