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

export type MintFormResult = {
  name: string;
  description: string;
  wallet: string;
};

export type MintFormProps = {
  prompt: string;
  loading: boolean;
  onSubmit: (result: MintFormResult) => void;
};

export default function MintForm(props: MintFormProps) {
  const { prompt, loading, onSubmit } = props;

  const registerSubmit = async (formValue: MintFormResult) => {
    onSubmit(formValue);
  };

  return (
    <div className="w-full sm:w-[400px] rounded-xl shadow-md relative bg-gray-700 text-white px-4 py-5">
      <div style={styles.titleContainer}>
        <h4>Setup your NFT</h4>
      </div>
      <Formik
        validationSchema={Yup.object(validationSchema())}
        onSubmit={registerSubmit}
        validateOnChange={false}
        initialValues={{
          name: prompt,
          description: "NFT auto generated usign DALL·E 2 and Toket APIs",
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
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormik01">
                <Form.Label>NFT Name</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="NFT Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    disabled={loading}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormik02">
                <Form.Label>NFT Description</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="NFT Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                    disabled={loading}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-4">
              <Form.Group as={Col} md="12" controlId="validationFormik03">
                <Form.Label>Wallet Address</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Wallet Address"
                    name="wallet"
                    value={values.wallet}
                    onChange={handleChange}
                    isInvalid={!!errors.wallet}
                    disabled={loading}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.wallet}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row>
              <div style={styles.buttonRow}>
                <button
                  className="button-85"
                  role="button"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? <Spinner size="sm" /> : "Mint NFT"}
                </button>
              </div>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
}

const TEXT_MIN_LENGTH = 10;
function validationSchema() {
  return {
    name: Yup.string()
      .min(
        TEXT_MIN_LENGTH,
        `Name must be at least ${TEXT_MIN_LENGTH} chareacters long`
      )
      .required("Name is required"),
    description: Yup.string()
      .min(
        TEXT_MIN_LENGTH,
        `Description must be at least ${TEXT_MIN_LENGTH} chareacters long`
      )
      .required("Description is required"),
    wallet: Yup.string()
      .required("Wallet address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/, "Please use a valid a address"),
  };
}

const styles = {
  titleContainer: {
    textAlign: "center",
  },
  buttonRow: {
    // marginTop: 10,
    display: "flex",
    alignItems: "center",
    padding: 0,
    width: "100%",
    justifyContent: "center",
    // alignItems: "center",
    // justifyContent: "center",
  },
};
