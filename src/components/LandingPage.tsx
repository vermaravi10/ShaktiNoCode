import { AudioOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyCardData, { prompts } from "./Constant.ts";
import DummyCard from "./DummyCards";
import LandingFooter from "./LandingFooter";
import SplitText from "../../yes/SplitText/SplitText.tsx";

const { TextArea } = Input;

const LandingPage = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [visibility, setVisibility] = useState("Public");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [placeholder, setPlaceholder] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [promptText, setPromptText] = useState("");
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [submittedLink, setSubmittedLink] = useState<string | null>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleGetStarted = () => {
    const query = `prompt=${encodeURIComponent(promptText)}`;
    const link = submittedLink
      ? `&link=${encodeURIComponent(submittedLink)}`
      : "";
    navigate(`/editor?${query}${link}`);
  };

  const handleAttach = () => {
    console.log("attach");
  };

  const handleLink = () => {
    console.log("link");
  };

  const handleVoice = () => {
    console.log("voice");
  };

  useEffect(() => {
    const currentText = prompts[currentPromptIndex];
    const timeout = setTimeout(() => {
      if (charIndex < currentText.length) {
        setPlaceholder("Ask AI to " + currentText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
        }, 2000); // wait 2s before switching to next prompt
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [charIndex, currentPromptIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (dropdownRef.current &&
          dropdownRef.current.contains(e.target as Node)) ||
        (buttonRef.current && buttonRef.current.contains(e.target as Node))
      ) {
        // Click was inside dropdown or the button—do nothing
        return;
      }
      // Otherwise close it
      setShowOptions(false);
      setShowVisibilityOptions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="landing-hero">
      <div className="hero-content">
        <div
          style={{
            height: "70px",
            display: "flex",
            justifyContent: "space-between",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            padding: "10px 20px",
            alignItems: "center",
            position: "sticky",
            top: 15,
            opacity: 0.95,
            backgroundColor: "rgba(30, 30, 30, 0.8)",
            zIndex: 100,
            transition:
              "backdrop-filter 0.3s, background-color 0.3s, opacity 0.3s",
          }}
          className="navbar-blur"
        >
          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <img
              src="https://yotta.com/wp-content/uploads/2023/12/yotta-shakti-logo.jpg"
              alt=""
              height={100}
              width={100}
              style={{ borderRadius: "4%" }}
            />
            <button className="nav-btn">Community</button>
            <button className="nav-btn">Teams</button>
            <button className="nav-btn">Learned</button>
            <button className="nav-btn">Shipped</button>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <button
              style={{
                color: "white",
                borderRadius: "6px",
                padding: "4px 10px",
                fontWeight: "400",
                backgroundColor: "transparent",
                border: "1px solid rgb(226 232 240)",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                color: "black",
                padding: "4px 10px",
                border: "1px solid rgb(226 232 240)",
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.2s",
              }}
            >
              Sign-Up
            </button>
          </div>
        </div>
        <h1 className="hero-title">Build with AI</h1>
        <p className="hero-subtitle">
          Launch Scalable, Secure, and Stunning Websites in Minutes with
          Shakti.AI
        </p>
        <SplitText
          text="Hello, GdsSAP!"
          className="text-2xl font-semibold text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          // onLetterAnimationComplete={handleAnimationComplete}
        />

        <div style={{ width: "50%", justifySelf: "center" }}>
          <form className="w-full border border-gray-700 rounded-3xl bg-[#1e1d1d] p-4 shadow-xl">
            <div className=" items-center gap-2">
              {uploadedFiles.length > 0 && (
                <div className="flex flex-col mb-3 text-white text-sm">
                  <ul className="pl-5 space-y-2">
                    {uploadedFiles?.map((file, idx) => {
                      const ext =
                        file.name.split(".").pop()?.toLowerCase() || "";
                      const isImage = ["png", "jpg", "jpeg"].includes(ext);

                      return (
                        <li key={idx} className="flex items-center gap-2">
                          {isImage ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-10 h-10 object-cover rounded"
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                          ) : (
                            <span className="font-mono">{file?.name}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none">
                <div className="w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none">
                  <textarea
                    placeholder={placeholder}
                    className="w-full resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    rows={linkInputVisible ? 4 : 3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleGetStarted();
                      }
                    }}
                  />
                  {submittedLink ? (
                    <div className="text-sm text-gray-300 border-t border-gray-700 pt-2 flex items-center justify-between">
                      <span className="truncate">{submittedLink}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedLink(null);
                          setLinkText("");
                          setLinkInputVisible(true);
                        }}
                        className="text-xs text-red-400 hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    linkInputVisible && (
                      <input
                        type="url"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        onBlur={() => {
                          if (linkText.trim()) {
                            setSubmittedLink(linkText.trim());
                            setLinkInputVisible(false);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (linkText.trim()) {
                              setSubmittedLink(linkText.trim());
                              setLinkInputVisible(false);
                            }
                          }
                        }}
                        placeholder="Paste your link here..."
                        className="w-full mt-2 bg-transparent text-white placeholder-gray-400 focus:outline-none border-t border-gray-700 pt-2"
                      />
                    )
                  )}
                </div>
              </div>

              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) {
                    setUploadedFiles(Array.from(e.target.files));
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-1 mt-3 relative">
              <button
                type="button"
                onClick={() => {
                  setShowOptions((prev) => !prev);
                  setShowVisibilityOptions(false);
                }}
                className="h-8 w-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => setLinkInputVisible(true)}
                className="h-8 w-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <PaperClipOutlined />
              </button>

              {showOptions && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-10 left-0 bg-[#222] border border-gray-700 rounded-xl text-sm shadow-lg flex flex-col overflow-hidden z-10"
                >
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="px-4 py-2 hover:bg-gray-700 text-left"
                  >
                    🎨 Add Figma
                  </button>

                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="px-4 py-2 hover:bg-gray-700 text-left"
                  >
                    🔗 Add Link
                  </button>
                </div>
              )}

              <button
                className=" whitespace-nowrap text-sm font-medium transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none border border-input bg-black shadow-sm hover:bg-lightgrey hover:border-accent px-3 py-2 flex h-8 items-center justify-center gap-1 rounded-full text-muted-foreground focus-visible:ring-0"
                type="button"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:Ra6d37r9tn6kq:"
                data-state="closed"
                ref={buttonRef}
                onClick={() => {
                  setShowVisibilityOptions((prev) => !prev);
                  setShowOptions(false);
                }}
              >
                <div className="flex items-center gap-1 duration-200 animate-in fade-in">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 -960 960 960"
                    className="shrink-0 h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34T80-480.5t31.5-155.66 86-126.84 127.34-85.5T480.5-880t155.66 31.5T763-763t85.5 127T880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80m-.27-60q142.38 0 241.19-99.5T820-480v-13q-6 26-27.41 43.5Q771.19-432 742-432h-80q-33 0-56.5-23.5T582-512v-40H422v-80q0-33 23.5-56.5T502-712h40v-22q0-16 13.5-40t30.5-29q-25-8-51.36-12.5Q508.29-820 480-820q-141 0-240.5 98.81T140-480h150q66 0 113 47t47 113v40H330v105q34 17 71.7 26t78.3 9"></path>
                  </svg>
                  {visibility}
                </div>
              </button>

              <div className="relative">
                {showVisibilityOptions && (
                  <div className="absolute bottom-5 right-6 bg-[#222] border border-gray-700 rounded-xl text-sm shadow-lg flex flex-col overflow-hidden z-20 min-w-[220px]">
                    <button
                      className={`px-4 py-2 hover:bg-gray-700 text-left flex flex-col`}
                      onClick={() => {
                        setVisibility("Public");
                        setShowVisibilityOptions(false);
                      }}
                    >
                      <span className="font-semibold">Public</span>
                      <span className="text-xs text-gray-400">
                        Anyone can view and remix
                      </span>
                    </button>
                    <button
                      className={`px-4 py-2 hover:bg-gray-700 text-left flex flex-col`}
                      onClick={() => {
                        if (visibility !== "Workspace") {
                          setVisibility("Workspace");
                        }
                        setShowVisibilityOptions((prev) => !prev);
                      }}
                    >
                      <span className="font-semibold">
                        Workspace{" "}
                        <span className="bg-blue-600 text-white text-[10px] px-1 ml-1 rounded">
                          Pro
                        </span>
                        {visibility === "Workspace" && (
                          <span className="ml-2 text-xs text-blue-400 font-semibold">
                            ✓ Selected
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        Only visible to members of the workspace
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition"
                aria-label="Voice"
              >
                <AudioOutlined />
              </button>

              <div className="ml-auto">
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-1 rounded-full hover:opacity-90 flex items-center justify-center"
                  style={{ padding: 0, width: 36, height: 36 }}
                  aria-label="Send"
                  onClick={handleGetStarted}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: "rotate(0deg)" }}
                  >
                    <path
                      d="M10 3L10 17M10 3L5 8M10 3L15 8"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div
          className="card-container"
          style={{
            backgroundColor: "#1e1d1d",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "100px",
          }}
        >
          <div
            style={{
              color: "white",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              margin: "10px 0",
            }}
          >
            <p className="text-2xl font-medium">From the Community</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <div style={{ position: "relative" }}>
              <button
                type="button"
                role="combobox"
                aria-controls="sort-dropdown"
                aria-expanded={showSortOptions ? "true" : "false"}
                aria-autocomplete="none"
                dir="ltr"
                data-state={showSortOptions ? "open" : "closed"}
                className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-36"
                onClick={() => setShowSortOptions?.((prev: boolean) => !prev)}
                style={{ color: "white" }}
              >
                <span style={{ color: "white" }}>
                  {sortOption || "Popular"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 -960 960 960"
                  className="shrink-0 h-4 w-4 opacity-50"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M480-356q-6 0-11-2t-10-7L261-563q-9-9-8.5-21.5T262-606t21.5-9 21.5 9l175 176 176-176q9-9 21-8.5t21 9.5 9 21.5-9 21.5L501-365q-5 5-10 7t-11 2"></path>
                </svg>
              </button>
              {showSortOptions && (
                <div
                  id="sort-dropdown"
                  className="absolute z-30 mt-1 w-36 bg-black border border-gray-700 rounded-xl shadow-lg"
                  style={{ left: 0, top: "110%" }}
                >
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                      sortOption === "Popular" ? "font-semibold" : ""
                    }`}
                    onClick={() => {
                      setSortOption?.("Popular");
                      setShowSortOptions?.(false);
                    }}
                  >
                    Popular
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                      sortOption === "Recent" ? "font-semibold" : ""
                    }`}
                    onClick={() => {
                      setSortOption?.("Recent");
                      setShowSortOptions?.(false);
                    }}
                  >
                    Recent
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                Discover
              </div>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                Internal Tools
              </div>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                Website
              </div>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                Personal
              </div>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                Consumer App
              </div>
              <div className="inline-flex items-center rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-black text-white  h-9 cursor-pointer px-3 py-2 text-sm">
                B2B App
              </div>
            </div>
            <div>
              <button className="community-nav-button bg-black">
                View All
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            {dummyCardData?.map((item) => {
              return (
                <DummyCard
                  key={item?.name}
                  imageUrl={item?.image}
                  name={item?.name}
                  usageCount={item?.remixes}
                />
              );
            })}
          </div>
        </div>

        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
