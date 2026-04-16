function ChangeAuthBtn(
    { onClick, text }: { onClick: () => void, text: string }
) {
    return (
        <button type="button" onClick={onClick}
            className="border-2 border-white rounded-md px-20 py-2 font-bold text-lg bg-transparent hover:bg-white/20 transition-colors duration-150"
        >{text}</button>
    )
}

export default ChangeAuthBtn