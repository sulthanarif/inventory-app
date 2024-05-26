import React from "react";

import Navbar from "../components/Navbar";
import LokasiTable from "../components/LokasiTable";
const LokasiPage = () => {
    return (
        <div>
        <Navbar />
        <div style={{ padding: 20 }}>
            <LokasiTable />
        </div>
        </div>
    );
    }
export default LokasiPage;