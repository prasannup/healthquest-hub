import { web3, Program, AnchorProvider, Idl } from "@project-serum/anchor";
import { getProvider } from "./solana";
import * as anchor from "@project-serum/anchor";
const { BN } = anchor;

// Replace with your deployed program ID
const PROGRAM_ID = "6e4tFWuEq2nP4KnCmysAXcxAv4WxVdWT3XbN52XzpLvq";

export interface DoctorAccount {
  authority: web3.PublicKey;
  name: string;
  specialization: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

export interface QuestionAccount {
  authority: web3.PublicKey;
  title: string;
  content: string;
  bounty: number;
  isAnswered: boolean;
  doctorKey: web3.PublicKey | null;
  answer: string | null;
}

const idl: Idl = {
  version: "0.1.0",
  name: "decentralized_healthcare",
  instructions: [
    {
      name: "registerDoctor",
      accounts: [
        { name: "doctor", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "name", type: { defined: "string" } },
        { name: "specialization", type: { defined: "string" } },
      ],
    },
    {
      name: "askQuestion",
      accounts: [
        { name: "question", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "title", type: { defined: "string" } },
        { name: "content", type: { defined: "string" } },
        { name: "bounty", type: { defined: "u64" } },
      ],
    },
    {
      name: "answerQuestion",
      accounts: [
        { name: "question", isMut: true, isSigner: false },
        { name: "doctor", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "answer", type: { defined: "string" } }],
    },
    {
      name: "verifyDoctor",
      accounts: [
        { name: "doctor", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "doctor",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "name", type: "string" },
          { name: "specialization", type: "string" },
          { name: "isVerified", type: "bool" },
          { name: "rating", type: "u64" },
          { name: "reviewCount", type: "u64" },
        ],
      },
    },
    {
      name: "question",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "title", type: "string" },
          { name: "content", type: "string" },
          { name: "bounty", type: "u64" },
          { name: "isAnswered", type: "bool" },
          { name: "doctorKey", type: { option: "publicKey" } },
          { name: "answer", type: { option: "string" } },
        ],
      },
    },
  ],
  events: [],
  errors: [],
};

export const getProgramInstance = async () => {
  const provider = getProvider();
  return new Program(idl, PROGRAM_ID, provider);
};

export const fetchDoctors = async (): Promise<DoctorAccount[]> => {
  try {
    const program = await getProgramInstance();
    const doctors = await program.account.doctor.all();
    return doctors.map((d: any) => ({
      authority: d.account.authority,
      name: d.account.name,
      specialization: d.account.specialization,
      isVerified: d.account.isVerified,
      rating: Number(d.account.rating),
      reviewCount: Number(d.account.reviewCount),
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const registerDoctor = async (
  name: string,
  specialization: string
): Promise<boolean> => {
  try {
    const program = await getProgramInstance();
    const doctorAccount = web3.Keypair.generate();

    await program.methods
      .registerDoctor(name, specialization)
      .accounts({
        doctor: doctorAccount.publicKey,
        authority: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([doctorAccount])
      .rpc();

    return true;
  } catch (error) {
    console.error("Error registering doctor:", error);
    return false;
  }
};

export const askQuestion = async (
  title: string,
  content: string,
  bounty: number
): Promise<boolean> => {
  try {
    const program = await getProgramInstance();
    const questionAccount = web3.Keypair.generate();

    await program.methods
      .askQuestion(title, content, new web3.BN(bounty))
      .accounts({
        question: questionAccount.publicKey,
        authority: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([questionAccount])
      .rpc();

    return true;
  } catch (error) {
    console.error("Error asking question:", error);
    return false;
  }
};

export const answerQuestion = async (
  questionPubkey: web3.PublicKey,
  doctorPubkey: web3.PublicKey,
  answer: string
): Promise<boolean> => {
  try {
    const program = await getProgramInstance();

    await program.methods
      .answerQuestion(answer)
      .accounts({
        question: questionPubkey,
        doctor: doctorPubkey,
        authority: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return true;
  } catch (error) {
    console.error("Error answering question:", error);
    return false;
  }
};

export const verifyDoctor = async (
  doctorPubkey: web3.PublicKey
): Promise<boolean> => {
  try {
    const program = await getProgramInstance();

    await program.methods
      .verifyDoctor()
      .accounts({
        doctor: doctorPubkey,
        authority: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return true;
  } catch (error) {
    console.error("Error verifying doctor:", error);
    return false;
  }
};

export const fetchQuestions = async (): Promise<QuestionAccount[]> => {
  try {
    const program = await getProgramInstance();
    const questions = await program.account.question.all();
    return questions.map((q: any) => ({
      authority: q.account.authority,
      title: q.account.title,
      content: q.account.content,
      bounty: Number(q.account.bounty),
      isAnswered: q.account.isAnswered,
      doctorKey: q.account.doctorKey,
      answer: q.account.answer,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
