import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
    AddressLookupTableAccount,
    Keypair,
    PublicKey,
} from "@solana/web3.js";

// @ts-ignore
import * as AutocratIDL from '../../target/idl/autocrat.json';
import { Autocrat as AutocratIDLType } from '../../target/types/autocrat';

import * as ixs from "./instructions/autocrat";
import BN from "bn.js";
import { AUTOCRAT_LUTS, AUTOCRAT_PROGRAM_ID } from "./constants";
import { ProposalInstruction, UpdateDaoParams } from "./types";

export type CreateAutocratClientParams = {
    provider: AnchorProvider,
    programId?: PublicKey,
}

export class AutocratClient {
    public readonly provider: AnchorProvider;
    public readonly program: Program<AutocratIDLType>;
    public readonly luts: AddressLookupTableAccount[];

    constructor(
        provider: AnchorProvider,
        programId: PublicKey,
        luts: AddressLookupTableAccount[],
    ) {
        this.provider = provider
        this.program = new Program<AutocratIDLType>(AutocratIDL, programId, provider)
        this.luts = luts
    }

    public static async createClient(createAutocratClientParams: CreateAutocratClientParams): Promise<AutocratClient> {
        let { provider, programId } = createAutocratClientParams;

        const getLuts = () => Promise.all(
            AUTOCRAT_LUTS.map(lut => {
                return provider.connection
                    .getAddressLookupTable(lut)
                    .then((res) => res.value as AddressLookupTableAccount)
            })
        )

        const luts = await getLuts()

        return new AutocratClient(
            provider,
            programId || AUTOCRAT_PROGRAM_ID,
            luts as AddressLookupTableAccount[],
        )
    }

    async initializeDao(
        metaMint?: PublicKey,
        usdcMint?: PublicKey
    ) {
        return ixs.initializeDaoHandler(
            this,
            metaMint,
            usdcMint
        )
    }

    // this won't ever be called directly (must be called via a proposal), but is here anyway for completeness / testing
    async updateDao(
        updateDaoParams: UpdateDaoParams
    ) {
        return ixs.updateDaoHandler(
            this,
            updateDaoParams
        )
    }

    async createProposalInstructions(
        instructions: ProposalInstruction[],
        proposalInstructionsKeypair: Keypair,
    ) {
        return ixs.createProposalInstructionsHandler(
            this,
            instructions,
            proposalInstructionsKeypair
        )
    }

    async addProposalInstructions(
        instructions: ProposalInstruction[],
        proposalInstructionsAddr: PublicKey,
    ) {
        return ixs.addProposalInstructionsHandler(
            this,
            instructions,
            proposalInstructionsAddr
        )
    }

    async createProposalPartOne(
        descriptionUrl: string,
        proposalInstructionsAddr: PublicKey,
    ) {
        return ixs.createProposalPartOneHandler(
            this,
            descriptionUrl,
            proposalInstructionsAddr
        )
    }

    async createProposalPartTwo(
        initialPassMarketPriceQuoteUnitsPerBaseUnitBps: BN,
        initialFailMarketPriceQuoteUnitsPerBaseUnitBps: BN,
        quoteLiquidityAmountPerAmm: BN,
    ) {
        return ixs.createProposalPartTwoHandler(
            this,
            initialPassMarketPriceQuoteUnitsPerBaseUnitBps,
            initialFailMarketPriceQuoteUnitsPerBaseUnitBps,
            quoteLiquidityAmountPerAmm,
        )
    }

    async mintConditionalTokens(
        proposalAddr: PublicKey,
        metaAmount: BN,
        usdcAmount: BN,
    ) {
        return ixs.mintConditionalTokensHandler(
            this,
            proposalAddr,
            metaAmount,
            usdcAmount,
        )
    }

    async redeemConditionalTokens(
        proposalAddr: PublicKey
    ) {
        return ixs.redeemConditionalTokensHandler(
            this,
            proposalAddr,
        )
    }

    async finalizeProposal(
        proposalAddr: PublicKey
    ) {
        return ixs.finalizeProposalHandler(
            this,
            proposalAddr,
        )
    }

    async createAmmPositionCpi(
        amm: PublicKey
    ) {
        return ixs.createAmmPositionCpiHandler(
            this,
            amm
        )
    }

    async addLiquidityCpi(
        ammAddr: PublicKey,
        ammPositionAddr: PublicKey,
        maxBaseAmount: BN,
        maxQuoteAmount: BN,
    ) {
        return ixs.addLiquidityCpiHandler(
            this,
            ammAddr,
            ammPositionAddr,
            maxBaseAmount,
            maxQuoteAmount
        )
    }

    async removeLiquidityCpi(
        proposalAddr: PublicKey,
        ammAddr: PublicKey,
        removeBps: BN,
    ) {
        return ixs.removeLiquidityCpiHandler(
            this,
            proposalAddr,
            ammAddr,
            removeBps
        )
    }

    async swapCpi(
        proposalAddr: PublicKey,
        ammAddr: PublicKey,
        isQuoteToBase: boolean,
        inputAmount: BN,
        minOutputAmount: BN,
    ) {
        return ixs.swapCpiHandler(
            this,
            proposalAddr,
            ammAddr,
            isQuoteToBase,
            inputAmount,
            minOutputAmount,
        )
    }
}

