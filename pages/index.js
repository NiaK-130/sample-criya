import Head from "next/head";
import styles from "../styles/Home.module.css";
import Airtable from "airtable";
import { useState, useEffect } from "react";
import millify from "millify";
import { BsArrowRight } from "react-icons";
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
  Button,
  ArrowForwardIcon,
  ArrowBackwardIcon,
} from "@chakra-ui/react";
function getLastPage(records){
  if (records.at(-1)){
    return records.at(-1)
  }
  return []
}
export default function Home({ AIRTABLE_API_KEY, BASE_VARIABLE }) {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_VARIABLE);
  const [records, setRecords] = useState([]); //api call
  const [input_text, setInput] = useState(""); //whatever is in the search bar
  const [price_lower_bound, setPriceLowerBound] = useState(100);
  const [price_upper_bound, setPriceUpperBound] = useState(5e3);
  const [is_instock, setInStock] = useState(true);
  const [current_page, setCurrentPage] = useState(0);
  const [pages, setPages] = useState({})
  const [is_done, setDone] = useState(false);
  const [next_page_fetcher, setNextPageFetcher] = useState({ fetcher: null });
  useEffect(() => {
    const input_value = `FIND(UPPER("${input_text}"),UPPER({NAME}))`;
    const price_range = `AND({UNIT COST} >= ${price_lower_bound}, {UNIT COST} <= ${price_upper_bound})`;
    const in_stock = `AND({IN STOCK},${is_instock ? "TRUE()" : "FALSE()"})`;
    const FORMULA = `AND(${input_value}, ${price_range}, ${in_stock})`;
    const query = base("Furniture").select({
      pageSize: 6,
      view: "All furniture",
      filterByFormula: FORMULA,
    });
    setCurrentPage(0);
    setPages({});
    query.eachPage((r, fetchNextPage) => {
      setRecords([r]);
      setNextPageFetcher({ fetcher: fetchNextPage});
    }, ()=>{setDone(true)});
  }, [input_text, price_lower_bound, price_upper_bound, is_instock]);

  return (
    <Box>
      <Center mb="2%">
        <VStack>
          <Heading size="lg"> Designer Search Catalog</Heading>
          <Heading size="md">Find it all in one place!</Heading>
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
          <HStack>
            <Button colorScheme="teal" variant="outline"
            onClick={(e)=>{
              setCurrentPage(current_page - 1);
            }}
            disabled={current_page == 0 ? true: false}
            >
              ←
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              disabled={is_done ? true: false}
              onClick={(e) => {
                if (!is_done){
                  next_page_fetcher.fetcher();
                  setCurrentPage(current_page + 1);
                }
              }}
            >
              →
            </Button>
          </HStack>
        </VStack>
      </Center>
      {/* //link to product, image, product name and price. clicking on the product takes you directly to product page */}
      <Center mb="10%">
        <Grid
          templateColumns={"repeat(3, 1fr)"}
          gap={342}
          templateRows="repeat(2, 1fr)"
          gap={10}
        >
          {getLastPage(records).map((record, index) => {
            return (
              //the width below is the size of the box holding the image
              <GridItem key={index} w="100%" h="100%">
                <Link href={"http://" + record.get("Link")} isExternal>
                  <Box
                    maxW="lg"
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                    center="center"
                  >
                    <Stack direction="row">
                      <Image
                        boxSize="290px"
                        objectFit="cover"
                        src={record.get("Images")[0].url}
                        alt="image"
                      />
                    </Stack>
                    <Box p="3">
                      <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        noOfLines={1}
                      >
                        {record.get("Name")}
                      </Box>
                      <Box>${record.get("Unit cost")}</Box>
                    </Box>
                  </Box>
                </Link>
              </GridItem>
            );
          })}
        </Grid>
      </Center>
    </Box>
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
