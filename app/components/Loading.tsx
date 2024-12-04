export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-600 animate-bounce animation-delay-200"></div>
                <div className="w-4 h-4 rounded-full bg-purple-800 animate-bounce animation-delay-400"></div>
            </div>
        </div>
    );
}
