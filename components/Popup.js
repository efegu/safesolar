import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Popup = ({ type, text, isPopup }) => {
    return (
        <>
            <div
                className={`fixed top-2 right-4 flex max-w-[260px] min-w-[260px] p-3 text-black rounded opacity-0 invisible z-[60] transition-all duration-300 ${type} ${
                    isPopup && "!visible opacity-100"
                }`}
            >
                {type === "Success" ? (
                    <CheckCircleOutlineIcon className="text-3xl mr-2 text-[#34b55a]" />
                ) : type === "Warning" ? (
                    <ErrorOutlineIcon className="text-3xl mr-2 text-[#eba923]" />
                ) : type === "Info" ? (
                    <InfoOutlinedIcon className="text-3xl mr-3 text-[#1ca3d1]" />
                ) : (
                    <CancelOutlinedIcon className="text-3xl mr-2 text-[#de3855]" />
                )}

                <div className="flex flex-col">
                    <h3 className="font-semibold">{type}</h3>
                    <p className="text-sm text-[#636868]">{text}</p>
                </div>
            </div>
        </>
    );
};

export default Popup;
