import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Airtable from "airtable";
import { useState, useEffect } from "react";

export default function Home({ AIRTABLE_API_KEY, BASE_VARIABLE }) {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_VARIABLE);

  const [records, setRecords] = useState([]);
  const [input_text, setInput] = useState("");
  const [price_lower_bound, setPriceLowerBound] = useState(0);
  const [price_upper_bound, setPriceUpperBound] = useState(1e20);
  const [is_instock, setInStock] = useState(false);
  useEffect(() => {
    console.log(is_instock);
    const input_value = `FIND(UPPER("${input_text}"),UPPER({NAME}))`;
    const price_range = `AND({UNIT COST} >= ${price_lower_bound}, {UNIT COST} <= ${price_upper_bound})`;
    const in_stock = `AND({IN STOCK},${is_instock ? "TRUE()" : "FALSE()"})`;
    const FORMULA = `AND(${input_value}, ${price_range}, ${in_stock})`;
    const query = base("Furniture").select({
      maxRecords: 6,
      view: "All furniture",
      filterByFormula: FORMULA,
    });
    query.eachPage((records, fetchNextPage) => {
      setRecords(records);
    });
  }, [input_text, price_lower_bound, price_upper_bound, is_instock]);

  return (
    <div>
      <input
        onChange={(e) => {
          setInput(e.target.value);
        }}
        type="text"
      ></input>
      <div>
        <span>
          <input
            type="number"
            onChange={(e) => {
              setPriceLowerBound(e.target.value);
            }}
          ></input>
          <input
            type="number"
            onChange={(e) => {
              setPriceUpperBound(e.target.value);
            }}
          ></input>
          <input
            type="checkbox"
            onChange={(e) => {
              setInStock(e.target.checked);
            }}
          />
        </span>
      </div>
      <ul>
        {records.map((record, index) => (
          <li key={index}>{record.get("Name")}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  // const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appi2WMUvdoZZUP6k');
  return {
    props: {
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
      BASE_VARIABLE: process.env.BASE_VARIABLE,
    },
  };
}
