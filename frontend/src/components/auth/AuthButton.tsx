function AuthButton({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full bg-[#0066ff] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
    >
      {text}
    </button>
  )
}

export default AuthButton
