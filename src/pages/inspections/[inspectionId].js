import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const Inspection = () => {
    const { data: session, isLoading } = useSession();

    const [inspection, setInspection] = useState();

    const [inspectionPoints, setInspectionPoints] = useState();

    const [inspectionPoint, setInspectionPoint] = useState({
        name: "",
        category: "",
        question: "",
        questionDescription: "",
        imgRequired: false,
        exampleImg: "",
    });

    const [selectedPoint, setSelectedPoint] = useState();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [inspectionPointModal, setInspectionPointModal] = useState(false);
    const [editInspectionPointModal, setEditInspectionPointModal] =
        useState(false);
    const [confirmationModal, setConfirmationModla] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    let name, value;

    const handleInpectionInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setInspectionPoint({ ...inspectionPoint, [name]: value });
    };

    const onExampleImageChange = async (e) => {
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

            setInspectionPoint({
                ...inspectionPoint,
                exampleImg:
                    configSettings.publicServerUrl + "/" + response.filePath,
            });

            setIsSpinner(false);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const addInspectionPoint = async () => {
        if (
            !inspectionPoint?.name ||
            !inspectionPoint?.category ||
            !inspectionPoint?.question ||
            !inspectionPoint?.questionDescription
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
                configSettings.serverUrl +
                    `/addInspectionPoint/${router.query.inspectionId}`,
                {
                    name: inspectionPoint?.name,
                    category: inspectionPoint?.category,
                    question: inspectionPoint?.question,
                    questionDescription: inspectionPoint?.questionDescription,
                    imgRequired: inspectionPoint?.imgRequired,
                    exampleImg: inspectionPoint?.exampleImg,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setInspectionPoint({
                name: "",
                category: "",
                question: "",
                questionDescription: "",
                imgRequired: false,
                exampleImg: "",
            });

            setInspectionPointModal(false);

            setPopupDetail({
                type: "Success",
                text: "Inspection point has been successfully added",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getInspectionPoints(router.query.inspectionId);
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

    const deleteInspectionPoint = async () => {
        try {
            setIsSpinner(true);

            await axios.delete(
                configSettings.serverUrl +
                    `/deleteInspectionPoint/${selectedPoint}`,
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setSelectedPoint();

            setConfirmationModla(false);

            setPopupDetail({
                type: "Success",
                text: "Inspection point has been successfully deleted",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getInspectionPoints(router.query.inspectionId);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const getInspection = async (inspectionId) => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + `/getInspection/${inspectionId}`,

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

            setIsSpinner(false);

            const response = result.data;

            setInspectionPoints(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const updateInspectionPoint = async () => {
        try {
            setIsSpinner(true);
            await axios.put(
                configSettings.serverUrl +
                    `/updateInspectionPoint/${selectedPoint}`,
                {
                    name: inspectionPoint?.name,
                    category: inspectionPoint?.category,
                    question: inspectionPoint?.question,
                    questionDescription: inspectionPoint?.questionDescription,
                    imgRequired: inspectionPoint?.imgRequired,
                    exampleImg: inspectionPoint?.exampleImg,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setEditInspectionPointModal(false);

            setInspectionPoint({
                name: "",
                category: "",
                question: "",
                questionDescription: "",
                imgRequired: false,
                exampleImg: "",
            });

            setSelectedPoint();

            setPopupDetail({
                type: "Success",
                text: "Inspection point has been successfully updated",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getInspectionPoints(router.query.inspectionId);
        } catch (error) {
            setIsSpinner(false);
        }

        setSelectedPoint();

        setInspectionPoint({
            name: "",
            category: "",
            question: "",
            questionDescription: "",
            imgRequired: false,
            exampleImg: "",
        });

        setEditInspectionPointModal(false);
    };

    useEffect(() => {
        if (router.query.inspectionId) {
            getInspection(router.query.inspectionId);
            getInspectionPoints(router.query.inspectionId);
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
                <title>Create Inspection - Safe Solar</title>
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
                                Inspections {" > "} {inspection?.name}
                            </h1>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-10">
                            <div className="col-span-full mt-4">
                                <div className="flex items-center justify-between">
                                    <div></div>

                                    <button
                                        type="button"
                                        className="flex text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                        onClick={() => {
                                            setInspectionPointModal(true);
                                        }}
                                    >
                                        Add Inspection Point
                                    </button>
                                </div>

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
                                                                Category
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
                                                        {inspectionPoints?.map(
                                                            (
                                                                inspectionPoint,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        inspectionPoint?._id
                                                                    }
                                                                    className="cursor-pointer hover:bg-gray-100"
                                                                >
                                                                    <td
                                                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                                                        onClick={() => {
                                                                            setSelectedPoint(
                                                                                inspectionPoint?._id
                                                                            );
                                                                            setInspectionPoint(
                                                                                inspectionPoint
                                                                            );
                                                                            setEditInspectionPointModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td
                                                                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                        onClick={() => {
                                                                            setSelectedPoint(
                                                                                inspectionPoint?._id
                                                                            );
                                                                            setInspectionPoint(
                                                                                inspectionPoint
                                                                            );
                                                                            setEditInspectionPointModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            inspectionPoint?.name
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                        onClick={() => {
                                                                            setSelectedPoint(
                                                                                inspectionPoint?._id
                                                                            );
                                                                            setInspectionPoint(
                                                                                inspectionPoint
                                                                            );
                                                                            setEditInspectionPointModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            inspectionPoint?.category
                                                                        }
                                                                    </td>

                                                                    <td
                                                                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                        onClick={() => {
                                                                            setSelectedPoint(
                                                                                inspectionPoint?._id
                                                                            );
                                                                            setInspectionPoint(
                                                                                inspectionPoint
                                                                            );
                                                                            setEditInspectionPointModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            session
                                                                                ?.data
                                                                                .email
                                                                        }
                                                                    </td>

                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                        <DeleteOutlineIcon
                                                                            className="text-red-400 cursor-pointer"
                                                                            onClick={() => {
                                                                                setSelectedPoint(
                                                                                    inspectionPoint?._id
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
                        </div>
                    </div>
                </main>
            </div>

            {/* add inspection point modal */}

            <Transition.Root show={inspectionPointModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setInspectionPointModal(false);
                        setInspectionPoint({
                            name: "",
                            category: "",
                            question: "",
                            questionDescription: "",
                            imgRequired: false,
                            exampleImg: "",
                        });
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
                                    <div className="mb-6">
                                        <h1 className="text-2xl leading-6 text-gray-900">
                                            Add Inspection Point
                                        </h1>
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.name}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Category
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.category}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="question"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Question
                                        </label>

                                        <input
                                            type="text"
                                            name="question"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.question}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Question Description
                                        </label>

                                        <textarea
                                            name="questionDescription"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            autoComplete="off"
                                            onChange={handleInpectionInput}
                                            value={
                                                inspectionPoint?.questionDescription
                                            }
                                        ></textarea>
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Example Image
                                        </label>

                                        <div
                                            className="relative flex items-center justify-center bg-gray-100 w-40 h-40 cursor-pointer"
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        "example_image"
                                                    )
                                                    .click();
                                            }}
                                        >
                                            {inspectionPoint?.exampleImg ===
                                            "" ? (
                                                <AddPhotoAlternateIcon className="text-4xl text-gray-500" />
                                            ) : (
                                                <Image
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                    src={
                                                        inspectionPoint?.exampleImg
                                                    }
                                                    alt=""
                                                    width={1000}
                                                    height={1000}
                                                />
                                            )}
                                        </div>

                                        <input
                                            id="example_image"
                                            type="file"
                                            hidden
                                            onChange={onExampleImageChange}
                                        />
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            name="imgRequired"
                                            autoComplete="off"
                                            className="mr-2"
                                            onChange={(e) => {
                                                if (e.target.checked === true) {
                                                    setInspectionPoint({
                                                        ...inspectionPoint,
                                                        imgRequired: true,
                                                    });
                                                } else {
                                                    setInspectionPoint({
                                                        ...inspectionPoint,
                                                        imgRequired: false,
                                                    });
                                                }
                                            }}
                                            value={inspectionPoint?.imgRequired}
                                        />
                                        <p className="block text-sm font-medium leading-6 text-gray-900">
                                            Image Required
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                            onClick={addInspectionPoint}
                                        >
                                            Add Inspection Point
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* edit inspection point modal */}

            <Transition.Root show={editInspectionPointModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setEditInspectionPointModal(false);
                        setInspectionPoint({
                            name: "",
                            category: "",
                            question: "",
                            questionDescription: "",
                            imgRequired: false,
                            exampleImg: "",
                        });
                        setSelectedPoint();
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
                                    <div className="mb-6">
                                        <h1 className="text-2xl leading-6 text-gray-900">
                                            Edit Inspection Point
                                        </h1>
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.name}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Category
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.category}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="question"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Question
                                        </label>

                                        <input
                                            type="text"
                                            name="question"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInpectionInput}
                                            value={inspectionPoint?.question}
                                        />
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Question Description
                                        </label>

                                        <textarea
                                            name="questionDescription"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            autoComplete="off"
                                            onChange={handleInpectionInput}
                                            value={
                                                inspectionPoint?.questionDescription
                                            }
                                        ></textarea>
                                    </div>

                                    <div className="col-span-full mt-2">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Example Image
                                        </label>

                                        <div
                                            className="relative flex items-center justify-center bg-gray-100 w-40 h-40 cursor-pointer"
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        "example_image"
                                                    )
                                                    .click();
                                            }}
                                        >
                                            {inspectionPoint?.exampleImg ===
                                            "" ? (
                                                <AddPhotoAlternateIcon className="text-4xl text-gray-500" />
                                            ) : (
                                                <Image
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                    src={
                                                        inspectionPoint?.exampleImg
                                                    }
                                                    alt=""
                                                    width={1000}
                                                    height={1000}
                                                />
                                            )}
                                        </div>

                                        <input
                                            id="example_image"
                                            type="file"
                                            hidden
                                            onChange={onExampleImageChange}
                                        />
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            name="imgRequired"
                                            autoComplete="off"
                                            className="mr-2"
                                            checked={
                                                inspectionPoint?.imgRequired
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked === true) {
                                                    setInspectionPoint({
                                                        ...inspectionPoint,
                                                        imgRequired: true,
                                                    });
                                                } else {
                                                    setInspectionPoint({
                                                        ...inspectionPoint,
                                                        imgRequired: false,
                                                    });
                                                }
                                            }}
                                            value={inspectionPoint?.imgRequired}
                                        />
                                        <p className="block text-sm font-medium leading-6 text-gray-900">
                                            Image Required
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                            onClick={updateInspectionPoint}
                                        >
                                            Update Inspection Point
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* confirm delete inspection point modal */}

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
                                                this Inspection Point
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
                                            onClick={deleteInspectionPoint}
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

export default Inspection;
