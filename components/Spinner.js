import React from "react";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import animationData from "../public/animations/animation.json";

const Spinner = () => {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-[60]">
                <div className="w-20 h-20">
                    <Lottie animationData={animationData} />
                </div>
            </div>
        </>
    );
};

export default Spinner;
