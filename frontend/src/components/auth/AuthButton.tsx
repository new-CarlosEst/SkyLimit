type AuthButtonProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthButton({setIsOpen} : AuthButtonProps){
    return (
        <button 
            className=""
            onClick={() => setIsOpen(true)}
        >
            Login
        </button>
    )
}

export default AuthButton;