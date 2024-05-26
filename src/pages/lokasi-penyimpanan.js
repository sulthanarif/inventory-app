import React from "react";
import Navbar from "../components/Navbar";
import LokasiPenyimpananTable from "../components/LokasiPenyimpananTable";

const LokasiPenyimpananPage = () => {
    return (
        <div>
        <Navbar />
        <div style={{ padding: 20 }}>
            <LokasiPenyimpananTable />
        </div>
        </div>
    );
    }   
export default LokasiPenyimpananPage;