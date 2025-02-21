import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const CompletedInspections = () => {
    const { data: session, isLoading } = useSession();

    const [inspections, setInspections] = useState();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const getCompletedInspections = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getCompletedInspections",

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setInspections(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const sendReport = async (inspection, customer) => {
        try {
            setIsSpinner(true);
            await axios.post(
                configSettings.serverUrl +
                    `/sendReport/${inspection}/${customer}`,
                {},
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Report has been successfully sent to customer",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getCompletedInspections();
        } catch (error) {
            setIsSpinner(false);
            setPopupDetail({
                type: "Error",
                text: "Report has not been successfully sent to customer try again later",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);
        }
    };

    useEffect(() => {
        getCompletedInspections();
    }, []);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Completed Inspections - Safe Solar</title>
                <meta name="description" content="M2M SOFTWARES" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="lg:pl-72">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="py-10">
                    {/* page header */}

                    <div className="flex items-center mb-7 px-4 sm:px-6 lg:px-8">
                        <div className="flex-auto">
                            <h1 className="text-3xl leading-6 text-gray-900">
                                Completed Inspections
                            </h1>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        {/* Table */}
                        <div className="mt-4 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        SNO
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        Name
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Customer
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Creator
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Status
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {inspections?.map(
                                                    (inspection, index) => (
                                                        <tr
                                                            key={index}
                                                            className="cursor-pointer hover:bg-gray-100"
                                                        >
                                                            <td
                                                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspection-report/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </td>
                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspection-report/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.name
                                                                }
                                                            </td>
                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspection-report/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.customerName
                                                                }
                                                            </td>

                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspection-report/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.creator
                                                                }
                                                            </td>

                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspection-report/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.status
                                                                }
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {inspection?.isNotified ? (
                                                                    <button
                                                                        type="button"
                                                                        className="flex text-white justify-center rounded-lg bg-gray-500 px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation"
                                                                        onClick={() =>
                                                                            sendReport(
                                                                                inspection?._id,
                                                                                inspection?.customer
                                                                            )
                                                                        }
                                                                    >
                                                                        Send
                                                                        Report
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="flex text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                                                        onClick={() =>
                                                                            sendReport(
                                                                                inspection?._id,
                                                                                inspection?.customer
                                                                            )
                                                                        }
                                                                    >
                                                                        Send
                                                                        Report
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {isSpinner && (
                <>
                    <div className="absolute w-full h-screen top-0 left-0 bg-black opacity-50 z-[60]"></div>
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

export default CompletedInspections;
