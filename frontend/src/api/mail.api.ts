// Importo tipos
import type { Contact } from "../types/user.types";
// Importo el cliente de axios
import apiClient from "./cliente";

export const sendContact = async (contact: Contact): Promise<void> => {
    await apiClient.post("/mail/contact", contact);
};