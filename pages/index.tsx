import cn from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { Formik } from "formik";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [canShowImage, setCanShowImage] = useState(false);

  const registerSubmit = async (formValue) => {
    const { prompt, wallet } = formValue;

    // TODO: Add error handling

    setWallet(wallet);
    setPrompt(prompt);

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

  async function mintNft() {
    toast("Mint the NFT...", { position: "top-center" });
    setMintLoading(true);

    const url = "/api/mintNft";
    const data = {
      prompt,
      imageUrl: image,
      wallet,
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
          <Formik
            validationSchema={Yup.object(validationSchema())}
            onSubmit={registerSubmit}
            validateOnChange={false}
            initialValues={{
              prompt: "",
              wallet: "",
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
              <form
                className="flex w-full sm:w-auto flex-col  mb-10"
                onSubmit={handleSubmit}
              >
                <input
                  className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
                  type="text"
                  name="prompt"
                  placeholder="Prompt for DALL-E"
                  value={values.prompt}
                  onChange={handleChange}
                />

                <input
                  className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
                  type="text"
                  name="wallet"
                  placeholder="Wallet Address"
                  value={values.wallet}
                  onChange={handleChange}
                />

                <button
                  className="min-h-[40px] shadow-sm sm:w-[100px] py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
                  disabled={showLoadingState}
                  type="submit"
                >
                  {showLoadingState && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {!showLoadingState ? "Generate Image" : ""}
                </button>
              </form>
            )}
          </Formik>

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

          <div className="relative flex w-full items-center justify-center">
            {image && !showLoadingState && (
              <div className="flex w-full sm:w-auto flex-col sm:flex-row">
                <button
                  className="button-85"
                  role="button"
                  disabled={mintLoading}
                  onClick={mintNft}
                >
                  {mintLoading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {!mintLoading ? "Mint into NFT" : ""}
                </button>
              </div>
            )}
          </div>
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
    wallet: Yup.string()
      .required("Wallet address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/, "Please use a valid a address"),
  };
}
