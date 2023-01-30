import cn from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { Formik } from "formik";
import Link from "next/link";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useInterval } from "../utils/use-interval";
import MintForm, { MintFormResult } from "../components/MintForm";

type PendingTransactionProps = {
  id: string;
  transactionHash: string;
};

const PendingTransaction = (props: PendingTransactionProps) => {
  const { id, transactionHash } = props;
  return (
    <div
      className="w-full sm:w-[400px] relative"
      style={styles.pendingTransaction}
    >
      <div>
        <h5 style={styles.transactionHashTitle}>Mint ID</h5>
        <p style={styles.transactionHashValue}>{id}</p>
      </div>

      {transactionHash ? (
        <div>
          <h5 style={styles.transactionHashTitle}>Transaction Hash</h5>
          <p style={styles.transactionHashValue}>
            {`${transactionHash.substring(0, 10)}...${transactionHash.substring(
              transactionHash.length - 10
            )}`}
          </p>
          <a
            target="_blank"
            href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
            rel="noopener noreferrer"
          >
            <button>Open Explorer</button>
          </a>
        </div>
      ) : (
        <Spinner size="sm" />
      )}
    </div>
  );
};

export default function Home() {
  // const [wallet, setWallet] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [canShowImage, setCanShowImage] = useState(false);
  const [mintId, setMintId] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  useInterval(
    async () => {
      const res = await fetch(`/api/getMintedNft?id=${mintId}`);
      const json = await res.json();
      if (res.status === 200) {
        console.log("*AC fetched mint: ", json.transactionHash);
        setTransactionHash(json.transactionHash);
      }
    },
    mintId && !transactionHash ? 1000 : null
  );

  const generateSubmit = async (formValue) => {
    const { prompt } = formValue;

    // TODO: Add error handling

    setPrompt(prompt);

    // Reset mint state
    setTransactionHash(null);
    setMintId(null);

    // Reset image state
    setImage(null);
    setCanShowImage(false);

    setLoading(true);
    toast("Generating your image...", { position: "top-center" });

    const response = await fetch(`/api/image?prompt=${prompt}`);
    const json = await response.json();

    if (response.status === 202) {
      console.log("*AC jsonData: ", json.data[0].url);
      setLoading(false);
      setImage(json.data[0].url);
    }
  };

  async function mintNft(result: MintFormResult) {
    toast("Mint the NFT...", { position: "top-center" });
    setMintLoading(true);

    const { name, description, wallet } = result;

    // Reset mint state
    setTransactionHash(null);
    setMintId(null);

    const url = "/api/mintNft";
    const data = {
      name,
      description,
      wallet,
      imageUrl: image,
      prompt,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (response.status === 200) {
      console.log("*AC jsonData: ", json);
      setMintId(json.id);
    }

    setMintLoading(false);
  }

  const showLoadingState = loading || (image && !canShowImage);

  return (
    <>
      <Head>
        <title>Toket & Dall-E AI NFT Generator</title>
      </Head>
      <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
            Toket & Dall-E AI NFT Generator
          </h1>
          <div className="w-full sm:w-[400px] relative">
            <Formik
              validationSchema={Yup.object(validationSchema())}
              onSubmit={generateSubmit}
              validateOnChange={false}
              initialValues={{
                prompt: "blue car with stripes",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationFormik01">
                      <InputGroup hasValidation>
                        <Form.Control
                          type="text"
                          placeholder="Prompt for DALL-E"
                          name="prompt"
                          value={values.prompt}
                          onChange={handleChange}
                          isInvalid={!!errors.prompt}
                          disabled={showLoadingState || mintLoading}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.prompt}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  {/* {errorText != "" && (
                  <Alert variant={"danger"}>{errorText}</Alert>
                )} */}

                  <Row className="mb-3">
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || mintLoading}
                      >
                        {loading ? <Spinner size="sm" /> : "Generate"}
                      </Button>
                    </div>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>

          {prompt && (
            <div className="relative flex w-full items-center justify-center mb-6">
              {image && (
                <div className="w-full sm:w-[400px] h-[400px] rounded-md shadow-md relative">
                  <Image
                    alt={`Dall-E representation of: ${prompt}`}
                    className={cn(
                      "opacity-0 duration-1000 ease-in-out rounded-md shadow-md h-full object-cover",
                      { "opacity-100": canShowImage }
                    )}
                    src={image}
                    fill={true}
                    onLoadingComplete={() => {
                      setCanShowImage(true);
                    }}
                  />
                </div>
              )}

              <div
                className={cn(
                  "w-full sm:w-[400px] absolute top-0.5 overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5",
                  {
                    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transparent":
                      showLoadingState,
                    "opacity-0 shadow-none": canShowImage,
                  }
                )}
              >
                <div
                  className={cn(
                    "w-full sm:w-[400px] h-[400px] bg-gray-200 rounded-md shadow-md flex items-center justify-center"
                  )}
                >
                  <p className="uppercase text-sm text-gray-400">
                    {showLoadingState
                      ? "Generating image...."
                      : "No image selected"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {mintId ? (
            <PendingTransaction
              id={mintId ?? ""}
              transactionHash={transactionHash}
            />
          ) : (
            <div className="relative flex w-full items-center justify-center">
              {image && !showLoadingState && (
                // <div className="flex w-full sm:w-auto flex-col sm:flex-row">
                <MintForm
                  prompt={prompt}
                  loading={mintLoading}
                  onSubmit={mintNft}
                />
                // </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const TEXT_MIN_LENGTH = 10;
function validationSchema() {
  return {
    prompt: Yup.string()
      .min(
        TEXT_MIN_LENGTH,
        `Prompt must be at least ${TEXT_MIN_LENGTH} chareacters long`
      )
      .required("Prompt is required"),
  };
}

const styles = {
  transactionHash: {
    backgroundColor: "#292D32",
    padding: "10px 30px",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  transactionHashMob: {
    backgroundColor: "#292D32",
    padding: 15,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
    marginBottom: "40px",
  },
  transactionHashTexts: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    overflow: "hidden",
  },
  transactionHashTextsMob: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "90%",
  },
  transactionHashTitle: {
    fontSize: "18px",
    lineHeight: "24px",
  },
  transactionHashValue: {
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "24px",
    // overflow: "scroll",
    // backgroundColor: "red",
  },
  pendingTransaction: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
  },
};
