function ClassSelector() {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-medium">Clase</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="class" 
                        value="economy" 
                        className="text-blue-600 focus:ring-blue-500"
                        defaultChecked
                    />
                    <span className="text-gray-700 text-sm">Turista</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="class" 
                        value="premium" 
                        className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">Premium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="class" 
                        value="business" 
                        className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">Business</span>
                </label>
            </div>
        </div>
    )
}

export default ClassSelector;
