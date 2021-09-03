import { useState } from "react";
import { useEffect } from "react";
import firebase from "firebase";


export function useOnlineState() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user && !user.isAnonymous) {
                setIsOnline(true);
            }

            console.log(user);
        });

        return () => {
        }
    }, [])

    return isOnline;
}