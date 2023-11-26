import {useState} from "react";
import {supabase} from "./supabaseClient.js";
import {LoadingIcon} from "./componets/Icons";


export default function Auth() {
    const [loading,setLoading]=useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleLogin=async(e)=>{
        e.preventDefault();

        setLoading(true);
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log(email);

        if(error){
            alert(error.error_description || error.message);
        }
        setLoading(false);
    }

    return(
        <div className="h-screen">
            <div className="flex flex-col justify-center items-center h-full">
                <h1 className="text-2xl font-bold py-5">
                    WHEATHER STATION TELEM&Aacute;TICA
                </h1>
                <label htmlFor="email" className="font-bold text-2xl py-3">
                    Inicio de sesi&oacute;n
                </label>
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col  justify-center space-y-2" >
                        <label htmlFor="email" className="font-bold">
                            Correo electr&oacute;nico
                        </label>
                        
                        <input 
                            className="border border-black px-4 py-2 rounded-lg"
                            type="email"
                            placeholder="Correo electr&oacute;nico"
                            value={email}
                            required={true}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <label htmlFor="password" className="font-bold">
                            Contrase&ntilde;a
                        </label>
                        <input 
                            className="border border-black px-4 py-2 rounded-lg"
                            type="password"
                            placeholder="Contrase&ntilde;a"
                            value={password}
                            required={true}
                            onChange={(e)=>setPassword(e.target.value)}
                        />

                        <button 
                        disabled={loading} 
                        style={{ border: '1px solid #000' }}
                        onClick={()=>{
                            console.log({email});
                        }}
                        className="inline-flex justify-center items-center px-4 py-2 mt-4 bg-blue-600 text-white font-bold rounded-lg ">
                            
                            {loading
                                ?(
                                <>
                                    <LoadingIcon/>
                                    <span>Iniciando sesi&oacute;n</span>
                                </>     
                                )
                                :<span>Inicia sesi&oacute;n</span>
                            }
                            
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

