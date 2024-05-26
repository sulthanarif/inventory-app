import React from "react";
import Navbar from "../components/Navbar";
import KategoriTable from "../components/KategoriTable";

const KategoriPage = () => {
    return (
        <div>
        <Navbar />
        <div style={{ padding: 20 }}>
               <KategoriTable />
        </div>
     
        </div>
    );
    };

export default KategoriPage;