import React from "react";

const LandingFooter = () => {
  return (
    <div
      className="footer-container"
      style={{
        backgroundColor: "#1e1d1d",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#fff",
          gap: "16px",
          fontSize: "15px",
          fontWeight: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            About
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Community
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Blog
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Pricing
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Docs
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Contact
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Privacy
          </a>
          <a
            href="#"
            style={{
              color: "#e0e0e0",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="footer-link hover:underline"
          >
            Terms
          </a>
        </div>
        <div style={{ display: "flex", gap: "18px", marginTop: "8px" }}>
          <a
            href="#"
            aria-label="Twitter"
            style={{ color: "#fff", opacity: 0.8 }}
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 5.92c-.8.36-1.66.6-2.56.71a4.48 4.48 0 0 0 1.97-2.48 8.94 8.94 0 0 1-2.83 1.08 4.48 4.48 0 0 0-7.64 4.09A12.7 12.7 0 0 1 3.1 4.86a4.48 4.48 0 0 0 1.39 5.98c-.73-.02-1.42-.22-2.02-.56v.06a4.48 4.48 0 0 0 3.6 4.39c-.34.09-.7.14-1.07.14-.26 0-.51-.02-.76-.07a4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.19 0-.37-.01-.56a9.2 9.2 0 0 0 2.27-2.34z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="GitHub"
            style={{ color: "#fff", opacity: 0.8 }}
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.39-3.87-1.39-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99 0 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Discord"
            style={{ color: "#fff", opacity: 0.8 }}
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.1a.074.074 0 0 0-.079.037c-.34.607-.719 1.396-.984 2.013a18.524 18.524 0 0 0-5.614 0 12.51 12.51 0 0 0-.997-2.013.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.684 4.369a.07.07 0 0 0-.032.027C.533 9.09-.32 13.579.099 18.021a.082.082 0 0 0 .031.056c2.104 1.547 4.13 2.488 6.102 3.104a.077.077 0 0 0 .084-.027c.47-.646.889-1.329 1.247-2.049a.076.076 0 0 0-.041-.104c-.662-.251-1.292-.548-1.899-.892a.077.077 0 0 1-.008-.128c.127-.096.254-.197.373-.299a.074.074 0 0 1 .077-.01c3.967 1.813 8.27 1.813 12.199 0a.073.073 0 0 1 .078.009c.12.102.246.203.374.299a.077.077 0 0 1-.006.128 12.298 12.298 0 0 1-1.9.892.076.076 0 0 0-.04.105c.36.72.779 1.403 1.247 2.049a.076.076 0 0 0 .084.028c1.978-.616 4.004-1.557 6.107-3.104a.077.077 0 0 0 .03-.055c.5-5.177-.838-9.637-3.549-13.625a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.174 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.174 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
            </svg>
          </a>
        </div>
        <div style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>
          © {new Date().getFullYear()} Shakti.AI. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
