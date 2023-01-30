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

export type PendingTransactionProps = {
  id: string;
  transactionHash: string;
};

export default function PendingTransaction(props: PendingTransactionProps) {
  const { id, transactionHash } = props;

  return (
    <div className="w-full sm:w-[400px] rounded-xl shadow-md relative bg-gray-700 text-white px-4 py-5">
      <div style={styles.titleContainer}>
        <h4>Mint Result</h4>
      </div>

      <Row className="mb-3">
        <h5 style={styles.transactionHashTitle}>Mint ID</h5>
        <p style={styles.transactionHashValue}>{id}</p>
      </Row>

      <Row className="mb-3">
        <h5 style={styles.transactionHashTitle}>Transaction Hash</h5>

        {transactionHash ? (
          <p style={styles.transactionHashValue}>
            {`${transactionHash.substring(0, 10)}...${transactionHash.substring(
              transactionHash.length - 10
            )}`}
          </p>
        ) : (
          <div>
            <Spinner size="sm" />
          </div>
        )}
      </Row>

      {transactionHash && (
        <Row className="mb-3">
          <a
            style={{
              textDecoration: "none",
              color: "white",
            }}
            className="d-grid gap-2"
            target="_blank"
            href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
            rel="noopener noreferrer"
          >
            <Button variant="primary" type="submit">
              {!transactionHash ? <Spinner size="sm" /> : "Open Explorer"}
            </Button>
          </a>
        </Row>
      )}
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
