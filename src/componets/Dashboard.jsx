import { SignOut } from "../App";
import { useState } from "react";
import { useSessionContext } from "../hooks/useSession";
import  Table  from "./Table";
import  Forecasting from "./Forecasting";


export default function Dashboard({children,title,email}) {
  const [section,setSection]=useState("Dashboard");
  const {session} = useSessionContext();
 
  return (
    <>
      <div className="bg-slate-900 w-full text-white px-4">
        <div className="flex justify-between">
          {/*Left section*/}
          <div className="inline-flex items-center space-x-4">
            <h3 className="text-2xl font bold py-4">
              Telematica Weather Station
            </h3>
              <p 
                className="cursor-pointer"
                onClick={()=>{setSection("Dashboard")}}>Dashboard
              </p>
              <p 
                className="cursor-pointer"
                onClick={()=>{setSection("Forecasting")}}>Forecasting
              </p>
          </div>
          {/*Rigth Section*/}
          <div className="py-4 px-4 inline-flex items-center space-x-4" >
            <p className="p-4  font-bold">
              {email}
            </p>
              <SignOut></SignOut>
          </div>
        </div>
      </div>
      {/*Title */}
      <div className="w-full">
        <div className="px-5 py-4 border-b border-black">
          <h1 className="text-4xl font-bold">{section}</h1>
        </div>
      </div>
      <div className="px-5 py-8">
        {section==="Dashboard" && <Table/>}
        {section==="Forecasting" && <Forecasting/>}
      </div>
    </>
  );
}
