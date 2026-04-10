import mailIcon from "../../assets/ui/mail.svg";

function MailInput() {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Correo electrónico
            </label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 sm:py-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white group">
                <div className="flex items-center justify-center w-6 h-6 p-0 m-0">
                    <img src={mailIcon} alt="Sobre" className="w-5 h-5 opacity-40 group-focus-within:opacity-80 transition-opacity shrink-0" />
                </div>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    className="w-full outline-none bg-transparent text-gray-700 text-sm font-medium"
                />
            </div>
        </div>
    )
}

export default MailInput;