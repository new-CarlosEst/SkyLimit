function ChangeAuthBtn(
    { setIsLogin, text }: { setIsLogin: React.Dispatch<React.SetStateAction<boolean>>, text: string }
) {
    return (
        <button onClick={() => setIsLogin(prev => !prev)}
            className="border-2 border-white rounded-md px-20 py-2 font-bold text-lg bg-transparent hover:bg-white/20 transition-colors duration-150"
        >{text}</button>
    )
}

export default ChangeAuthBtn