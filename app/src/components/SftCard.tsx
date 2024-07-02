import { useState } from "react";
import { Vault } from "types";
import GoldPieceImg from "assets/gp.png";
import SilverPieceImg from "assets/sp.png";
import BronzePieceImg from "assets/bp.png";
import GoldFragmentImg from "assets/gf.png";
import SilverFragmentImg from "assets/sf.png";
import BronzeFragmentImg from "assets/bf.png";

export default function SftCard({ type, vault }: { type: number, vault: Vault }) {
    const [active, setActive] = useState<"piece" | "fragment">("fragment");
    return (
        <div className="flex flex-col gap-3 items-center">
            <p className="text-lg">{["Gold", "Silver", "Bronze"][type]} {active === "piece" ? "Piece Remaining" : "Fragment Remaining"}</p>
            <p className="text-lg">{active === "piece" ?
                `${vault.pieceSfts[type].mintedAmount.toNumber()}/${vault.pieceSfts[type].totalSupply.toNumber()}` :
                `${vault.fragmentSfts[type].mintedAmount.toNumber()}/${vault.fragmentSfts[type].totalSupply.toNumber()}`}
            </p>
            <div className="flex gap-2 items-center">
                <button
                    className="px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-600"
                    disabled={active === "fragment"}
                    onClick={() => setActive("fragment")}
                >
                    {"<"}
                </button>
                {active === "piece" ? "Piece" : "Fragment"}
                <button
                    className="px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-600"
                    disabled={active === "piece"}
                    onClick={() => setActive("piece")}
                >
                    {">"}
                </button>
            </div>
            <img 
                src={[
                    GoldFragmentImg,
                    SilverFragmentImg,
                    BronzeFragmentImg,
                    GoldPieceImg,
                    SilverPieceImg,
                    BronzePieceImg
                ][(active === "piece" ? 1 : 0) * 3 + type]} 
                className="w-52 rounded-3xl"
            />
        </div>
    );
}