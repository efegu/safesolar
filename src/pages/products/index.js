import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const Inspections = () => {
    const { data: session, isLoading } = useSession();

    const [inspection, setInspection] = useState();

    const [selectedInspection, setSelectedInspection] = useState();

    const [inspections, setInspections] = useState();

    const [createInspectionModal, setCreateInspectionModal] = useState(false);
    const [confirmationModal, setConfirmationModla] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const createInspection = async () => {
        try {
            setIsSpinner(true);
            await axios.post(
                configSettings.serverUrl + "/createInspection",
                {
                    creator: session?.data?.email,
                    name: inspection?.name,
                    date: getCurrentDate(),
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setCreateInspectionModal(false);
            setInspection();

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Inspection has been successfully created",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getInspections();
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

    const deleteInspection = async () => {
        try {
            setIsSpinner(true);
            await axios.delete(
                configSettings.serverUrl +
                    `/deleteInspection/${selectedInspection}`,
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setSelectedInspection();

            setConfirmationModla(false);

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Product has been successfully deleted",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getInspections();
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

    const getCurrentDate = () => {
        let newDate = new Date();
        let date = ("0" + newDate.getDate()).slice(-2);
        let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let year = newDate.getFullYear();

        return `${year}-${month}-${date}`;
    };

    useEffect(() => {
        getInspections();
    }, []);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Products - Safe Solar</title>
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

                    <div className="flex items-center px-4 sm:px-6 lg:px-8">
                        <div className="flex-auto">
                            <h1 className="text-3xl leading-6 text-gray-900">
                                Products
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                onClick={() => {
                                    setCreateInspectionModal(true);
                                }}
                            >
                                Create Product
                            </button>
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
                                                        Created On
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
                                                                        `/inspections/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </td>
                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspections/${inspection?._id}`
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
                                                                        `/inspections/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.date
                                                                }
                                                            </td>

                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/inspections/${inspection?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    inspection?.creator
                                                                }
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <DeleteOutlineIcon
                                                                    className="text-red-400 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedInspection(
                                                                            inspection._id
                                                                        );
                                                                        setConfirmationModla(
                                                                            true
                                                                        );
                                                                    }}
                                                                />
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

            {/* Create sub admin modal */}

            <Transition.Root show={createInspectionModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setCreateInspectionModal(false);
                        setInspection();
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
                                            Create Product
                                        </h1>
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={(e) => {
                                                setInspection({
                                                    ...inspection,
                                                    name: e.target.value,
                                                });
                                            }}
                                            value={inspection?.name}
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                            onClick={createInspection}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* confirm delete sub admin modal */}

            <Transition.Root show={confirmationModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setConfirmationModla(false);
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
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <ShieldExclamationIcon
                                                className="h-6 w-6 text-blue-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 mb-5"
                                            >
                                                Are you sure you want to delete
                                                this Inspection
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-sm outline-none"
                                            onClick={() =>
                                                setConfirmationModla(false)
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="ml-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm outline-none"
                                            onClick={deleteInspection}
                                        >
                                            Delete
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

export default Inspections;
