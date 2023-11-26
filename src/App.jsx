import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";
import Auth from "./Auth";
import Dashboard from './componets/Dashboard'
import { SessionContext } from "./hooks/useSession";

export function SignOut() {
  return (
    <>
      <button
        className="inline-flex justify-center items-center px-4 py-2 text-white font-bold rounded-lg bg-sky-700 "
        onClick={() => {
          supabase.auth.signOut();
        }}
      >
        Cerrar sesi&oacute;n
      </button>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
        {!session ? <Auth /> : <Dashboard email={session.user.email}></Dashboard>}
    </>
  );
}

export default App;
