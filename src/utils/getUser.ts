import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

/* const getUser = async (uid: string): Promise<User> => {
  const docRef = doc(db, `usuarios/${uid}`);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const { displayName, cpf, email, enderecos } = snapshot.data();
    console.log(cpf);

    return {
      displayName,
      cpf,
      email,
      enderecos,
    };
  } else {
    return {} as newUser;
  }
};
export default getUser; */
