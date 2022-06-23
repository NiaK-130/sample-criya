import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import Airtable from "airtable";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import millify from "millify";
import { BsArrowRight } from "react-icons";
import { Flex, Spacer } from "@chakra-ui/layout";
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


export default function Home({ AIRTABLE_API_KEY, BASE_VARIABLE }) {
  const API_URL =
    "https://api.airtable.com/v0/appi2WMUvdoZZUP6k/tbl7gg4NFNqyKFMQ6";
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_VARIABLE);
  const [records, setRecords] = useState([]); //api call
  const [input_text, setInput] = useState(""); //whatever is in the search bar
  const [price_lower_bound, setPriceLowerBound] = useState(0);
  const [price_upper_bound, setPriceUpperBound] = useState(1e4);
  const [is_instock, setInStock] = useState(true);
  const [current_page, setCurrentPage] = useState(0);
  const [is_done, setDone] = useState(false);
  const [next_page_fetcher, setNextPageFetcher] = useState({ fetcher: null });
  
  let getPage = (r, fetchNextPage) => {
    setRecords(prev_records => {
      return [...prev_records,...r]
    });      
    setNextPageFetcher({ fetcher: fetchNextPage });
  }

  


  //run on filter changes
  useEffect(() => {
    const input_value = `FIND(UPPER("${input_text}"),UPPER({NAME}))`;
    const price_range = `AND({UNIT COST} >= ${price_lower_bound}, {UNIT COST} <= ${price_upper_bound})`;
    const in_stock = `AND({IN STOCK},${is_instock ? "TRUE()" : "FALSE()"})`;
    const FORMULA = `AND(${input_value}, ${price_range}, ${in_stock})`;
    setDone(false);
    const query = base("Furniture").select({
      pageSize: 6,
      view: "All furniture",
      filterByFormula: FORMULA,
    });
    setRecords([]);
    setCurrentPage(0);
    query.eachPage(
      getPage,
      () => {
        setDone(true);
      }
    );
  }, [input_text, price_lower_bound, price_upper_bound, is_instock]);

  useEffect(()=>{
    console.log(current_page)
    if (current_page > 0){
      if (next_page_fetcher.fetcher){
        next_page_fetcher.fetcher();
      }
    }
  },[current_page])
  return (
    <Flex>
      <Sidebar />
      <Box>
        <Head>
          <title>McWay Designs</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Flex mb="2%">
          <Box w="1450px">
            <VStack>
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Spacer />
              <Flex>
                <Box mb="2%">
                  <Heading mb="2%" align="center" size="lg">
                    McWay Designs
                  </Heading>
                  <Heading mb="2%" w="400px" align="center" size="md">
                    {" "}
                    Designer Search Catalog - Find everything in one place!
                  </Heading>
                  <Input
                    placeholder="Search for a product"
                    size="sm"
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  ></Input>
                </Box>
              </Flex>

              <HStack w="40%">
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

              <Flex>
                <Box mb="12%">
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
                </Box>
              </Flex>
            </VStack>
          </Box>
        </Flex>
        {/* //link to product, image, product name and price. clicking on the product takes you directly to product page */}
        <Center mb="10%" align="center">
          <Grid
            templateColumns={"repeat(3, 1fr)"}
            gap={10}
            templateRows="repeat(2, 1fr)"
          >
            {records.map((record, index) => {
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
        <Flex mg="2%">
          <Box w="1450px" align="center" size="md">
            <Button
              isDisabled={is_done}
              onClick={() => {
                setCurrentPage((old_page_number) => {
                  console.log(old_page_number)
                  return old_page_number + 1;
                });
              }}
            >
              {" "}
              Load More{" "}
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

export async function getServerSideProps() {
  // const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appi2WMUvdoZZUP6k');
  const { API_URL } = process.env;

  return {
    props: {
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
      BASE_VARIABLE: process.env.BASE_VARIABLE,
    },
  };
}
