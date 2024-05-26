import React from "react";

import Navbar from "../components/Navbar";
import PengeluaranTable from "../components/PengeluaranTable";
const PengeluaranPage = () => {
    return (
        <div>
        <Navbar />
        <div style={{ padding: 20 }}>
        <PengeluaranTable />
        </div>
        </div>
    );
    }

export default PengeluaranPage;