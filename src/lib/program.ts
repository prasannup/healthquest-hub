import { web3, Program, AnchorProvider } from "@project-serum/anchor";
import { getProvider } from "./solana";

// This should be replaced with your actual program ID after deployment
const PROGRAM_ID = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";

export interface DoctorAccount {
  authority: web3.PublicKey;
  name: string;
  specialization: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

export const getProgramInstance = async () => {
  const provider = getProvider();
  // Note: In a production app, you would load the IDL from a .json file
  // For this example, we'll use a minimal interface
  const idl = {
    version: "0.1.0",
    name: "decentralized_healthcare",
    instructions: [
      {
        name: "registerDoctor",
        accounts: [
          { name: "doctor", isMut: true, isSigner: false },
          { name: "platformState", isMut: true, isSigner: false },
          { name: "authority", isMut: true, isSigner: true },
          { name: "systemProgram", isMut: false, isSigner: false },
        ],
        args: [
          { name: "name", type: "string" },
          { name: "specialization", type: "string" },
        ],
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
    ],
  };

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

export const registerDoctor = async (name: string, specialization: string): Promise<boolean> => {
  try {
    const program = await getProgramInstance();
    const doctorAccount = web3.Keypair.generate();
    
    await program.methods
      .registerDoctor(name, specialization)
      .accounts({
        doctor: doctorAccount.publicKey,
        platformState: new web3.PublicKey(PROGRAM_ID),
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