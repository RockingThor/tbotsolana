import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { encodeURL, findReference, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { NextResponse } from "next/server";

// CONSTANTS
const myWallet = "DemoKMZWkk483hX4mUrcJoo3zVvsKhm8XXs28TuwZw9H"; // Replace with your wallet address (this is the destination where the payment will be sent)
const recipient = new PublicKey(myWallet);
const amount = new BigNumber(0.0001); // 0.0001 SOL
const label = "QuickNode Guide Store";
const memo = "QN Solana Pay Demo Public Memo";
const quicknodeEndpoint =
  "https://devnet.helius-rpc.com/?api-key=fe0a1797-ee64-435a-9840-8e4f04b08a67"; // Replace with your QuickNode endpoint

const paymentRequests = new Map<
  string,
  { recipient: PublicKey; amount: BigNumber; memo: string }
>();

async function generateUrl(
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  label: string,
  message: string,
  memo: string
) {
  const url: URL = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}

async function verifyTransaction(reference: PublicKey) {
  // 1 - Check that the payment request exists
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    throw new Error("Payment request not found");
  }
  const { recipient, amount, memo } = paymentData;
  // 2 - Establish a Connection to the Solana Cluster
  const connection = new Connection(quicknodeEndpoint, "confirmed");
  console.log("recipient", recipient.toBase58());
  console.log("amount", amount);
  console.log("reference", reference.toBase58());
  console.log("memo", memo);

  // 3 - Find the transaction reference
  const found = await findReference(connection, reference);
  console.log(found.signature);

  // 4 - Validate the transaction
  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      //memo
    },
    { commitment: "confirmed" }
  );
  // 5 - Delete the payment request from local storage and return the response
  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
}

export async function POST(req: Request, res: Response) {
  //   console.log("Was here");
  try {
    const reference = new Keypair().publicKey;
    const message = `QuickNode Demo - Order ID #0${
      Math.floor(Math.random() * 999999) + 1
    }`;
    const urlData = await generateUrl(
      recipient,
      amount,
      reference,
      label,
      message,
      memo
    );
    const ref = reference.toBase58();
    paymentRequests.set(ref, { recipient, amount, memo });
    const { url } = urlData;
    return new NextResponse(JSON.stringify({ url: url.toString(), ref }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, res: Response) {
  // 1 - Get the reference query parameter from the NextApiRequest
  //get the query parameter
  // const data = await req.json();
  console.log("Was here");
  console.log(req.headers.get("reference"));
  const reference = req.headers.get("reference");
  if (!reference) {
    return new NextResponse("Missing reference query parameter", {
      status: 400,
    });
  }
  // 2 - Verify the transaction
  try {
    const referencePublicKey = new PublicKey(reference as string);
    const response = await verifyTransaction(referencePublicKey);
    if (response) {
      return new NextResponse(JSON.stringify(response), {
        status: 200,
      });
    } else {
      return new NextResponse("Not Found", { status: 400 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
