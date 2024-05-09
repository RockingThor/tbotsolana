"use client";
import React, { useState } from "react";
import Image from "next/image";
import { createQR } from "@solana/pay";
import { Button } from "./ui/button";
import axios from "axios";

const Solanapay = () => {
  const [qrCode, setQrCode] = useState<string>();
  const [reference, setReference] = useState<string>();
  const handleGenerateClick = async () => {
    // 1 - Send a POST request to our backend and log the response URL
    const res = await fetch("/api/pay", { method: "POST" });
    const { url, ref } = await res.json();
    console.log(url);
    // 2 - Generate a QR Code from the URL and generate a blob
    const qr = createQR(url);
    const qrBlob = await qr.getRawData("png");
    if (!qrBlob) return;
    // 3 - Convert the blob to a base64 string (using FileReader) and set the QR code state
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setQrCode(event.target.result);
      }
    };
    reader.readAsDataURL(qrBlob);
    // 4 - Set the reference state
    setReference(ref);
  };

  const handleVerifyClick = async () => {
    // 1 - Check if the reference is set
    try {
      if (!reference) {
        alert("Please generate a payment order first");
        return;
      }
      // 2 - Send a GET request to our backend and return the response status
      const res = await axios.get("/api/pay", {
        headers: {
          reference,
        },
      });
      console.log(res);
      // const { status } = await res.json();
      if (res.status != 200) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      // Check if response body is empty
      if (res.headers["Content-Length"] === "0") {
        throw new Error("Empty response received");
      }

      const { status } = await res.data();

      // 3 - Alert the user if the transaction was verified or not and reset the QR code and reference
      if (status === "verified") {
        alert("Transaction verified");
        setQrCode(undefined);
        setReference(undefined);
      } else {
        alert("Transaction not found");
      }
    } catch (err) {
      alert("Transaction is not yet confirmed");
      console.error(err);
    }
  };
  return (
    <>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl font-semibold">Paying for your Pepto order</h1>
      </div>
      {qrCode && (
        <Image
          src={qrCode}
          style={{ position: "relative", background: "white" }}
          alt="QR Code"
          width={200}
          height={200}
          priority
        />
      )}

      <div className="flex items-center justify-between p-2">
        <Button onClick={handleGenerateClick}>Generate Solana Pay Order</Button>
        {reference && (
          <Button onClick={handleVerifyClick} color={"green"}>
            Verify Transaction
          </Button>
        )}
      </div>
    </>
  );
};

export default Solanapay;
