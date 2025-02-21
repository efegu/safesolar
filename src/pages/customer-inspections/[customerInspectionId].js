import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const CustomerInspection = () => {
    const { data: session, isLoading } = useSession();

    const [customerInspection, setCustomerInspection] = useState();

    const [inspectionPoints, setInspectionPoints] = useState([]);

    const [currentInspectionPointIndex, setCurrentInspectionPointIndex] =
        useState(0);

    const [currentInspectionPoint, setCurrentInspectionPoint] = useState();

    const [answer, setAnswer] = useState({
        inspectionPointId: "",
        protocol: "Approved",
        comment: "",
        img: "",
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    let name, value;

    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setAnswer({ ...answer, [name]: value });
    };

    const onImageChange = async (e) => {
        setIsSpinner(true);

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const result = await axios.post(
                configSettings.publicServerUrl + `/uploadImage`,
                formData,
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                        "content-type": "multipart/form/data",
                    },
                }
            );

            const response = await result.data;

            setAnswer({
                ...answer,
                img: configSettings.publicServerUrl + "/" + response.filePath,
            });

            setIsSpinner(false);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const getCustomerInspection = async (inspectionId) => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl +
                    `/getCustomerInspection/${inspectionId}`,

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            const response = result.data;

            if (response.data.status === "Completed") {
                router.push("/inspection-report/" + response.data._id);
            }

            setCustomerInspection(response.data);

            getInspectionPoints(response.data.inspection);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const getInspectionPoints = async (inspectionId) => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl +
                    `/getInspectionPoints/${inspectionId}`,

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            const response = result.data;

            setInspectionPoints(response.data);

            setCurrentInspectionPoint(response.data[0]);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const publishAnswer = async () => {
        try {
            setIsSpinner(true);
            await axios.post(
                configSettings.serverUrl +
                    `/publishAnswer/${router.query.customerInspectionId}`,
                {
                    inspectionPointId: currentInspectionPoint?._id,
                    protocol: answer?.protocol,
                    comment: answer?.comment,
                    img: answer?.img,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Answer has been successfully saved",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const markInspectionCompleted = async () => {
        try {
            setIsSpinner(true);
            await axios.put(
                configSettings.serverUrl +
                    `/markInspectionCompleted/${router.query.customerInspectionId}`,
                {
                    status: "Completed",
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Inspection has been successfully completed",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
                router.push("/completed-inspections");
            }, 3000);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const goToNextInspectionPoint = async () => {
        if (currentInspectionPoint?.imgRequired) {
            if (answer?.img === "") {
                setPopupDetail({
                    type: "Warning",
                    text: "Image is required please upload image first",
                });

                setIsPopup(true);

                setTimeout(function () {
                    setIsPopup(false);
                }, 4000);
                return;
            }
        }

        await publishAnswer();

        const newIndex = currentInspectionPointIndex + 1;
        if (newIndex < inspectionPoints.length) {
            setAnswer({
                inspectionPointId: "",
                protocol: "",
                comment: "",
                img: "",
            });

            setCurrentInspectionPointIndex(newIndex);
            setCurrentInspectionPoint(inspectionPoints[newIndex]);
        } else {
            markInspectionCompleted();
        }
    };

    const goToPreviousInspectionPoint = () => {
        const newIndex = currentInspectionPointIndex - 1;
        if (newIndex >= 0) {
            setCurrentInspectionPointIndex(newIndex);
            setCurrentInspectionPoint(inspectionPoints[newIndex]);
        }
    };

    const getAnswer = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl +
                    `/getInspectionPointAnswer/${currentInspectionPoint?._id}/${router.query.customerInspectionId}`,

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            const response = result.data;

            if (response.data) {
                setAnswer(response.data);
            } else {
                setAnswer({
                    inspectionPointId: "",
                    protocol: "Approved",
                    comment: "",
                    img: "",
                });
            }

            setIsSpinner(false);
        } catch (error) {}
    };

    useEffect(() => {
        if (router.query.customerInspectionId) {
            getCustomerInspection(router.query.customerInspectionId);
        }
    }, [router.query.customerInspectionId]);

    useEffect(() => {
        getAnswer();
    }, [currentInspectionPoint]);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <div className="relative min-h-screen">
            <Head>
                <title>Customer - Inspections - Safe Solar</title>
                <meta name="description" content="M2M SOFTWARES" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="lg:pl-72">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="pt-4 pb-10">
                    {/* page header */}

                    <div className="flex items-center px-4 sm:px-6 lg:px-8">
                        <div className="flex-auto">
                            <h1 className="text-xl leading-6 text-gray-500">
                                Customers {" > "}{" "}
                                {customerInspection?.customerName} {" > "}{" "}
                                {customerInspection?.name}
                            </h1>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col bg-white mt-8 px-4 py-8 shadow-md rounded-md">
                            <p className="text-xl mb-3">
                                {currentInspectionPoint?.question}
                            </p>
                            <p className="text-gray-700 text-sm">
                                {currentInspectionPoint?.questionDescription}
                            </p>
                        </div>

                        {currentInspectionPoint?.exampleImg && (
                            <>
                                <p className="mt-6 text-gray-700 ml-1">
                                    Example Image
                                </p>
                                <div className="flex items-center justify-between bg-white mt-2 p-4 shadow-md rounded-md">
                                    <Image
                                        src={currentInspectionPoint?.exampleImg}
                                        alt=""
                                        width={1000}
                                        height={1000}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </>
                        )}

                        <p className="mt-6 text-gray-700 ml-1">Protocol</p>

                        <div className="flex flex-col bg-white mt-2 p-4 shadow-md rounded-md">
                            <select
                                name="protocol"
                                className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none"
                                value={answer?.protocol}
                                onChange={handleInput}
                            >
                                <option value="Approved">Approved</option>
                                <option value="Recommendation">
                                    Recommendation
                                </option>
                                <option value="Not Approved">
                                    Not Approved
                                </option>
                            </select>

                            <input
                                name="comment"
                                className="mt-2 block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none"
                                placeholder="Comment"
                                value={answer?.comment}
                                onChange={handleInput}
                            />
                        </div>

                        {answer?.img !== "" && (
                            <div className="flex items-center justify-between bg-white mt-2 p-4 shadow-md rounded-md">
                                <Image
                                    src={answer?.img}
                                    alt=""
                                    width={1000}
                                    height={1000}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between bg-white mt-2 p-4 shadow-md rounded-md">
                            <p className="text-gray-700">Upload Required</p>
                            <AddPhotoAlternateIcon
                                className="text-3xl text-gray-600 cursor-pointer"
                                onClick={() => {
                                    document
                                        .getElementById("answer_image")
                                        .click();
                                }}
                            />

                            <input
                                id="answer_image"
                                type="file"
                                hidden
                                onChange={onImageChange}
                            />
                        </div>

                        <p className="mt-6 text-gray-700 ml-1">
                            Go To Next Step
                        </p>

                        <div className="flex items-center justify-between bg-white mt-2 p-4 shadow-md rounded-md">
                            <ArrowCircleLeftIcon
                                className="text-5xl text-secondary cursor-pointer"
                                onClick={goToPreviousInspectionPoint}
                            />

                            {currentInspectionPointIndex + 1 <
                            inspectionPoints.length ? (
                                <button
                                    type="button"
                                    className="flex w-36 text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                    onClick={goToNextInspectionPoint}
                                >
                                    Save & Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="flex w-36 text-white justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-green-500 hover:to-green-600"
                                    onClick={goToNextInspectionPoint}
                                >
                                    Save & Finish
                                </button>
                            )}
                        </div>
                    </div>
                </main>
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
        </div>
    );
};

export default CustomerInspection;
