import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSubmit = () => {
    axios.post('https://url-shortner-backend-xner.onrender.com/api/short', { originalUrl })
      .then((res) => {
        setShortUrl(res.data.url.shortUrl);
      
        setQrCode(res.data.url.qrCode);
        setOriginalUrl('');
        setCopied(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && qrCode) {
      try {
        const blob = await (await fetch(qrCode)).blob();
        const file = new File([blob], 'qr-code.png', { type: blob.type });

        await navigator.share({
          title: 'Short URL QR Code',
          text: 'Scan this QR code to open the link.',
          files: [file],
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleDownload = async () => {
    if (qrCode) {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`${darkMode ? "bg-gradient-to-t from-black to-[#020239]" : "bg-white"} transition-colors duration-700 w-full min-h-screen flex flex-col justify-center items-center px-4 py-10`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5">
        <motion.button
          whileTap={{ rotate: 180, scale: 0.8 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`text-2xl p-2 rounded-full transition duration-300 ${darkMode ? "text-yellow-300" : "text-gray-800 hover:text-blue-500"}`}
        >
          {darkMode ? <BsSun /> : <BsMoon />}
        </motion.button>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`text-4xl md:text-5xl font-bold mb-10 text-center transition-colors duration-500 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        <span className={`${darkMode ? "text-yellow-400" : "text-blue-600"}`}>URL Shortener</span>
      </motion.h1>

      {/* Input and Button */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col items-center w-full"
      >
        <motion.input
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          type="text"
          placeholder='Paste URL here...'
          required
          className={`w-full max-w-[400px] h-12 sm:h-14 outline-none border ${darkMode ? "border-white bg-transparent text-white placeholder-gray-300" : "border-gray-400 bg-white text-black placeholder-gray-500"} rounded-full px-4 text-base sm:text-lg mb-6 transition duration-300`}
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className='w-full max-w-[150px] h-10 bg-yellow-300 rounded-full font-semibold cursor-pointer hover:border-4 hover:shadow-lg hover:shadow-blue-500 hover:border-white transition-all duration-300 mb-6'
          onClick={handleSubmit}
        >
          Go
        </motion.button>
      </motion.div>

      {/* Result Section */}
      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[700px] flex flex-col sm:flex-row gap-6 justify-center items-start mt-6"
          >
            {/* Shortened URL Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex-1 ${darkMode ? "bg-white/10 backdrop-blur-md" : "bg-gray-100"} p-5 rounded-xl shadow-lg border ${darkMode ? "border-white/20" : "border-gray-300"} w-full transition-all duration-500`}
            >
              <h2 className={`${darkMode ? "text-yellow-300" : "text-blue-700"} text-xl font-semibold mb-5`}>Shortened URL</h2>
              <div className={`flex items-center justify-between ${darkMode ? "bg-white/20" : "bg-gray-200"} px-4 py-2 rounded-lg`}>
                <a
                  href={shortUrl}
                  className={`underline break-all mr-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className={`transition-colors ${darkMode ? "text-white hover:text-yellow-300" : "text-black hover:text-blue-500"}`}
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              </div>

              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-400 text-sm mt-2"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* QR Code Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex-1 ${darkMode ? "bg-white/10 backdrop-blur-md" : "bg-gray-100"} p-4 rounded-xl shadow-lg border ${darkMode ? "border-white/20" : "border-gray-300"} w-full text-center transition-all duration-500`}
            >
              <h2 className={`${darkMode ? "text-yellow-300" : "text-blue-700"} text-xl font-semibold mb-3`}>QR Code</h2>
              {qrCode && (
                <>
                  <motion.img
                    src={qrCode}
                    alt="QR Code"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 10 }}
                    className="w-20 h-20 mx-auto border-2 border-white rounded-lg"
                  />
                  <button
                    onClick={handleShare}
                    className="mt-4 bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm mx-auto"
                  >
                    <FaShareAlt /> Share QR
                  </button>

                  <button
                    onClick={handleDownload}
                    className="mt-2 bg-blue-500 text-white font-semibold py-2 px-5 rounded-full flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm mx-auto"
                  >
                    ⬇️ Download QR
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className={`mt-10 text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="font-semibold tracking-wide"
        >
          Created by <span className="text-yellow-300">Narsingh Prasad</span>
        </motion.p>
      </motion.footer>
    </motion.div>
  );
}

export default App;
