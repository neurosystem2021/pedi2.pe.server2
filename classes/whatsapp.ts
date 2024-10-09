
export async function EnviarWhatsAppOtp(numero:string,texto:string){

    try {
        let codigoUs = '@c.us';
        client.sendMessage(numero+codigoUs, texto);

        return { success: true, data:null };

    } catch (error) {
        return { success: false, data:error };
    }
}