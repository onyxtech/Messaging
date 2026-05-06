"use client";

import { useEffect, useState } from "react"

export default function Home() {
    const [data, setData] = useState("");
    useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(res => res.text())
      .then(data => setData(data));
  }, []);
  return <div>{data}</div>;
}
