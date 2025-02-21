import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import Cookies from "js-cookie";

import logo from "../../../public/images/logo.png";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const InspectionReport = () => {
    const { data: session, isLoading } = useSession();

    const [inspection, setInspection] = useState();

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const getCustomerInspection = async (inspectionId) => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl +
                    `/getCustomerInspectionForReport/${inspectionId}`,

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setInspection(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const saveAsPdf = async () => {
        window.print();
    };

    useEffect(() => {
        if (router.query.inspectionId) {
            getCustomerInspection(router.query.inspectionId);
        }
    }, [router.query.inspectionId]);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Inspection Report - Safe Solar</title>
                <meta name="description" content="M2M SOFTWARES" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="w-full h-full bg-white flex flex-col">
                {/* Report header */}
                <div className="relative bg-secondary flex flex-col py-8 px-4">
                    <div className="flex flex-col">
                        <Image
                            src={logo}
                            alt="safe solar"
                            width={300}
                            height={300}
                        />
                        <h1 className="text-4xl font-bold text-white mt-4">
                            Inspection Report
                        </h1>
                    </div>

                    <div className="mt-4">
                        <p className="text-white">
                            <span className="font-semibold">Inspection: </span>
                            {inspection?.name}
                        </p>
                        <p className="text-white">
                            <span className="font-semibold">Customer: </span>
                            {inspection?.customerName}
                        </p>
                        <p className="text-white">
                            <span className="font-semibold">Status: </span>
                            {inspection?.status}
                        </p>
                    </div>

                    <div
                        className="absolute bottom-4 right-4 cursor-pointer"
                        onClick={saveAsPdf}
                    >
                        <PictureAsPdfIcon className="text-white text-4xl" />
                    </div>
                </div>

                {/* Report body */}
                <div className="flex flex-col mt-8 mx-4">
                    {inspection?.inspectionPointsAnswers?.map(
                        (answer, index) => {
                            return (
                                <div
                                    className="flex flex-col items-center justify-center w-full mb-16"
                                    key={index}
                                >
                                    <div className="flex items-center justify-center bg-gray-700 rounded-full w-16 h-16">
                                        <p className="text-4xl font-bold text-white">
                                            {index + 1}
                                        </p>
                                    </div>

                                    <div className="flex flex-col w-full bg-gray-100 mt-8 px-4 py-8 shadow-md rounded-md">
                                        <p className="text-xl mb-3">
                                            {answer.question}
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            {answer.questionDescription}
                                        </p>
                                    </div>

                                    {answer?.img !== "" && (
                                        <div className="flex items-center justify-between w-full bg-gray-100 mt-3 p-4 shadow-md rounded-md">
                                            <Image
                                                src={answer?.img}
                                                alt=""
                                                width={1000}
                                                height={1000}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col w-full bg-gray-100 mt-3 px-4 py-8 shadow-md rounded-md">
                                        <p className="text-xl mb-3">Status</p>

                                        <div
                                            className={`flex items-center justify-center w-44 p-2 rounded-md ${
                                                answer.protocol === "Approved"
                                                    ? "bg-green-600"
                                                    : answer.protocol ===
                                                      "Recommendation"
                                                    ? "bg-secondary"
                                                    : answer.protocol ===
                                                      "Not Approved"
                                                    ? "bg-red-600"
                                                    : ""
                                            }`}
                                        >
                                            <p className="text-xl text-white">
                                                {answer.protocol}
                                            </p>
                                        </div>

                                        <p className="text-gray-700 text-sm mt-6">
                                            {answer.comment}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {isSpinner && (
                <>
                    <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-[60]"></div>
                    <Spinner />
                </>
            )}

            <Popup
                type={popupDetail?.type}
                text={popupDetail?.text}
                isPopup={isPopup}
            />
        </>
    );
};

export default InspectionReport;
