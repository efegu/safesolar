import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import useSession from "@/hooks/user/get-session";

const Home = () => {
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/inspections");
        } else {
            router.push("/login");
        }
    }, [session]);

    return <></>;
};

export default Home;
