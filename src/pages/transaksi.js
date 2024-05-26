import React from "react";
import Navbar from "../components/Navbar";
import TransaksiTable from "@/components/TransaksiTable";
const TransaksiPage = () => {
    return (
        <div>
        <Navbar />
        <div style={{ padding: 20 }}>
            <TransaksiTable/>
        </div>
        </div>
    );
    }
export default TransaksiPage;