import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import InspectionCalendar from "@/components/InspectionCalendar";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const UpcomingInspections = () => {
    const { data: session, isLoading } = useSession();

    const [upcomingInspection, setUpcomingInspection] = useState();

    const [upcomingInspections, setUpcomingInspections] = useState([]);

    const [inspections, setInspections] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [addUpcomingInspectionModal, setAddUpcomingInspectionModal] =
        useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const addUpcomingInspection = async () => {
        if (
            !upcomingInspection?.customer ||
            !upcomingInspection?.inspection ||
            !upcomingInspection?.date
        ) {
            setPopupDetail({
                type: "Warning",
                text: "Please fill all the fields first",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);
            return;
        }

        try {
            setIsSpinner(true);
            await axios.post(
                configSettings.serverUrl + "/addUpcomingInspection",
                {
                    creator: session?.data?.email,
                    customer: upcomingInspection?.customer,
                    customerName: upcomingInspection?.customerName,
                    inspection: upcomingInspection?.inspection,
                    inspectionName: upcomingInspection?.inspectionName,
                    date: upcomingInspection?.date,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setAddUpcomingInspectionModal(false);
            setUpcomingInspection();

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Upcoming Inspection has been successfully added",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getUpcomingInspections();
        } catch (error) {
            setIsSpinner(false);
            if (error.response.status === 400) {
                setPopupDetail({
                    type: "Warning",
                    text: error.response.data.message,
                });

                setIsPopup(true);

                setTimeout(function () {
                    setIsPopup(false);
                }, 4000);
            }
        }
    };

    const getUpcomingInspections = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getUpcomingInspections",

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setUpcomingInspections(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const getInspections = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getInspections",

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

    const getCustomers = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getCustomers",

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setCustomers(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const disaplePreviousDates = () => {
        let dtToday = new Date();
        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();

        if (month < 10) {
            month = "0" + month.toString();
        }
        if (day < 10) {
            day = "0" + day.toString();
        }
        let maxDate = year + "-" + month + "-" + day;

        document.getElementById("inspectionDate")?.setAttribute("min", maxDate);
    };

    useEffect(() => {
        getUpcomingInspections();
        getInspections();
        getCustomers();
    }, []);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Upcoming Inspections - Safe Solar</title>
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

                    <div className="flex items-center px-4 sm:px-6 lg:px-8 mb-8">
                        <div className="flex-auto">
                            <h1 className="text-3xl leading-6 text-gray-900">
                                Upcoming Inspections
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                onClick={() => {
                                    setAddUpcomingInspectionModal(true);
                                    setTimeout(function () {
                                        disaplePreviousDates();
                                    }, 1000);
                                }}
                            >
                                Add Upcoming Inspection
                            </button>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <InspectionCalendar inspections={upcomingInspections} />
                    </div>
                </main>
            </div>

            {/* Create sub admin modal */}

            <Transition.Root show={addUpcomingInspectionModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setAddUpcomingInspectionModal(false);
                        setUpcomingInspection();
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div className="mb-8">
                                        <h1 className="text-2xl leading-6 text-gray-900">
                                            Add Upcoming Inspection
                                        </h1>
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Select Customer
                                        </label>

                                        <select
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={(e) => {
                                                setUpcomingInspection({
                                                    ...upcomingInspection,
                                                    customer: e.target.value,
                                                    customerName:
                                                        e.target.options[
                                                            e.target
                                                                .selectedIndex
                                                        ].text,
                                                });
                                            }}
                                            value={upcomingInspection?.customer}
                                        >
                                            <option value="">
                                                Choose Customer
                                            </option>

                                            {customers?.map((customer) => {
                                                return (
                                                    <option
                                                        key={customer._id}
                                                        value={customer?._id}
                                                    >
                                                        {customer?.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Select Inspection
                                        </label>

                                        <select
                                            name="inspection"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={(e) => {
                                                setUpcomingInspection({
                                                    ...upcomingInspection,
                                                    inspection: e.target.value,
                                                    inspectionName:
                                                        e.target.options[
                                                            e.target
                                                                .selectedIndex
                                                        ].text,
                                                });
                                            }}
                                            value={
                                                upcomingInspection?.inspection
                                            }
                                        >
                                            <option value="">
                                                Choose Inspection
                                            </option>

                                            {inspections?.map((inspection) => {
                                                return (
                                                    <option
                                                        key={inspection._id}
                                                        value={inspection?._id}
                                                    >
                                                        {inspection?.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Inspection Date
                                        </label>

                                        <input
                                            id="inspectionDate"
                                            type="date"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={(e) => {
                                                setUpcomingInspection({
                                                    ...upcomingInspection,
                                                    date: e.target.value,
                                                });
                                            }}
                                            value={upcomingInspection?.date}
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                            onClick={addUpcomingInspection}
                                        >
                                            Add Upcoming Inspection
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

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

export default UpcomingInspections;
