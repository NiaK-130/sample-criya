import Head from "next/head";
import styles from "../styles/Home.module.css";
import Airtable from "airtable";
import { useState, useEffect } from "react";
import millify from "millify";
import {
  Center,
  Input,
  Stack,
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Switch,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Heading,
  Link,
  ExternalLinkIcon,
  Image,
} from "@chakra-ui/react";

export default function Home({ AIRTABLE_API_KEY, BASE_VARIABLE }) {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_VARIABLE);
  const [records, setRecords] = useState([]); //api call
  const [input_text, setInput] = useState(""); //whatever is in the search bar
  const [price_lower_bound, setPriceLowerBound] = useState(100);
  const [price_upper_bound, setPriceUpperBound] = useState(5e3);
  const [is_instock, setInStock] = useState(true);
  useEffect(() => {
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
      <Center>
        <VStack>
          <Heading size="lg"> Designer Search Catalog</Heading>
          <Heading size="md">
            Find what you are looking for, all in one place!
          </Heading>
          <Input
            placeholder="Search for a product"
            size="sm"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></Input>
          <HStack w="100%">
            <h1>${millify(price_lower_bound)}</h1>
            <RangeSlider
              aria-label={["min", "max"]}
              defaultValue={[price_lower_bound, price_upper_bound]}
              min={0}
              max={1e4}
              onChangeEnd={([min, max]) => {
                setPriceLowerBound(min);
                setPriceUpperBound(max);
              }}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            <h1>${millify(price_upper_bound)}</h1>
          </HStack>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="in-stock" mb="0">
              In-Stock
            </FormLabel>
            <Switch
              id="in-stock"
              isChecked={is_instock}
              onChange={(e) => {
                setInStock(!is_instock);
              }}
            />
          </FormControl>
        </VStack>
      </Center>
      {/* //link to product, image, product name and price. clicking on the product takes you directly to product page */}
      <Center>
        <Grid templateColumns="repeat(3, 1fr)" gap={10}>
          {records.map((record, index) => {
            return (
              <GridItem key={index} w="80%" h="20" gap={120}>
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Image src={record.get("Images")[0].url} alt="image" />
                  <Box p="6">
                    <Box
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      noOfLines={1}
                    >
                      {record.get("Name")}
                    </Box>
                    <Box>
                      ${record.get("Unit cost")}
                    </Box>
                    <Box>
                      <Link href={"http://"+record.get("Link")} isExternal>
                        Link
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            );
          })}
        </Grid>
      </Center>
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
