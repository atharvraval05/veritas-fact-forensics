// Veritas Premium B2B Light & Colorful Controller
document.addEventListener("DOMContentLoaded", () => {
    
    // Application State
    let state = {
        isMockMode: true,
        user: null,
        activePage: "radar",
        activeInputTab: "text",
        currentScanReport: null,
        newsList: [],
        activeNewsFilter: "all-topics",
        newsSearchQuery: "",
        chatHistory: [] // list of {role: 'user'|'model', content: string}
    };

    let supabaseClient = null;
    let currentScanReportId = null;


    // DOM Navigation
    const navLinks = document.querySelectorAll(".nav-link");
    const pages = document.querySelectorAll(".page-view");
    const logoHomeBtn = document.getElementById("logoHomeBtn");

    // System Status
    const dbStatus = document.getElementById("dbStatus");
    const scanTicker = document.getElementById("scanTicker");
    const authBtn = document.getElementById("authBtn");
    const userPanel = document.getElementById("userPanel");
    
    // Auth Modal
    const authModal = document.getElementById("authModal");
    const closeAuthModal = document.getElementById("closeAuthModal");
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegisterBtn = document.getElementById("tabRegisterBtn");
    const authForm = document.getElementById("authForm");
    const authEmail = document.getElementById("authEmail");
    const authPassword = document.getElementById("authPassword");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    let isRegistering = false;

    // News Preview Modal
    const newsPreviewModal = document.getElementById("newsPreviewModal");
    const closePreviewModal = document.getElementById("closePreviewModal");
    const prevSource = document.getElementById("prevSource");
    const prevImage = document.getElementById("prevImage");
    const prevTitle = document.getElementById("prevTitle");
    const prevSummary = document.getElementById("prevSummary");
    const prevCategory = document.getElementById("prevCategory");
    const prevScore = document.getElementById("prevScore");
    const previewVerifyBtn = document.getElementById("previewVerifyBtn");
    const previewStayBtn = document.getElementById("previewStayBtn");
    const previewSourceBtn = document.getElementById("previewSourceBtn");
    let activePreviewItem = null;

    // PAGE 1: Radar Console Scanner
    const scanTabs = document.querySelectorAll(".scan-tab");
    const textInput = document.getElementById("textInput");
    const urlInput = document.getElementById("urlInput");
    
    // Image Upload
    const imageInput = document.getElementById("imageInput");
    const dropZone = document.getElementById("dropZone");
    const filePreviewWrap = document.getElementById("filePreviewWrap");
    const selectedFileName = document.getElementById("selectedFileName");
    const clearFileBtn = document.getElementById("clearFileBtn");

    // Video Upload
    const videoInput = document.getElementById("videoInput");
    const dropZoneVideo = document.getElementById("dropZoneVideo");
    const videoPreviewWrap = document.getElementById("videoPreviewWrap");
    const selectedVideoName = document.getElementById("selectedVideoName");
    const clearVideoBtn = document.getElementById("clearVideoBtn");

    const runAuditBtn = document.getElementById("runAuditBtn");
    const terminalLog = document.getElementById("terminalLog");

    // PAGE 1: Results Audit Panel
    const reportBlankState = document.getElementById("reportBlankState");
    const reportResults = document.getElementById("reportResults");
    const gaugeScoreVal = document.getElementById("gaugeScoreVal");
    const gaugeFill = document.getElementById("gaugeFill");
    const reportHeadline = document.getElementById("reportHeadline");
    const reportBiasBadge = document.getElementById("reportBiasBadge");
    const reportTypeBadge = document.getElementById("reportTypeBadge");
    const clickbaitBar = document.getElementById("clickbaitBar");
    const clickbaitVal = document.getElementById("clickbaitVal");
    const intensityBar = document.getElementById("intensityBar");
    const intensityVal = document.getElementById("intensityVal");
    
    // Verdict Banner
    const verdictBanner = document.getElementById("verdictBanner");
    const verdictLabel = document.getElementById("verdictLabel");
    const verdictDesc = document.getElementById("verdictDesc");

    // Fallacy Inspector
    const inspectorTextSection = document.getElementById("inspectorTextSection");
    const fallacyTextCanvas = document.getElementById("fallacyTextCanvas");
    const fallacyDetailsPopup = document.getElementById("fallacyDetailsPopup");
    const popupFallacyName = document.getElementById("popupFallacyName");
    const popupFallacyExplanation = document.getElementById("popupFallacyExplanation");
    const popupFallacyCorrection = document.getElementById("popupFallacyCorrection");

    // Image Visual Forensic Canvas
    const inspectorImageSection = document.getElementById("inspectorImageSection");
    const forensicImagePreview = document.getElementById("forensicImagePreview");
    const forensicCanvasOverlay = document.getElementById("forensicCanvasOverlay");
    const metadataRows = document.getElementById("metadataRows");
    const metadataNote = document.getElementById("metadataNote");
    
    // Video Diagnostics Section
    const inspectorVideoSection = document.getElementById("inspectorVideoSection");
    const forensicVideoPlayer = document.getElementById("forensicVideoPlayer");
    const vidName = document.getElementById("vidName");
    const vidCodec = document.getElementById("vidCodec");
    const videoAnomaliesUl = document.getElementById("videoAnomaliesUl");

    // Bounding Badges & Stamp Seals
    const reportSubjectBadge = document.getElementById("reportSubjectBadge");
    const verdictStamp = document.getElementById("verdictStamp");

    // Related News Section
    const relatedNewsGrid = document.getElementById("relatedNewsGrid");

    const reportReasoningText = document.getElementById("reportReasoningText");
    const saveBookmarkBtn = document.getElementById("saveBookmarkBtn");
    const shareReportBtn = document.getElementById("shareReportBtn");

    // PAGE 2: Verified News Room
    const verifiedNewsFeed = document.getElementById("verifiedNewsFeed");
    const newsSearchInput = document.getElementById("newsSearchInput");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // PAGE 3: Leaks & Rumors Registry
    const debunkRumorsFeed = document.getElementById("debunkRumorsFeed");

    // PAGE 4: Domain Trust Registry
    const domainSearchInput = document.getElementById("domainSearchInput");
    const runDomainLookupBtn = document.getElementById("runDomainLookupBtn");
    const domainEmptyState = document.getElementById("domainEmptyState");
    const domainResultsState = document.getElementById("domainResultsState");
    const domName = document.getElementById("domName");
    const domDomain = document.getElementById("domDomain");
    const domFactual = document.getElementById("domFactual");
    const domBias = document.getElementById("domBias");
    const domDescription = document.getElementById("domDescription");
    const domConspiracies = document.getElementById("domConspiracies");
    const conspiraciesContainer = document.getElementById("conspiraciesContainer");
    const suggestPills = document.querySelectorAll(".suggest-pill");

    // ==========================================
    // 1. PAGE ROUTING & NAVIGATION
    // ==========================================
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const pageId = link.getAttribute("data-page");
            navigateToPage(pageId);
        });
    });

    logoHomeBtn.addEventListener("click", () => navigateToPage("radar"));

    function navigateToPage(pageId) {
        state.activePage = pageId;
        
        navLinks.forEach(link => {
            if (link.getAttribute("data-page") === pageId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        pages.forEach(p => p.classList.remove("active"));
        const activePageEl = document.getElementById(`page${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`);
        if (activePageEl) activePageEl.classList.add("active");
        
        writeLog(`[SYS] Navigation shifted: ${pageId.toUpperCase()}`);

        if (pageId === "news") {
            loadVerifiedFeed();
        } else if (pageId === "leaks") {
            loadRumorsLedger();
        } else if (pageId === "vault") {
            loadVaultPage();
        }
    }

    // ==========================================
    // 2. CONFIGURATION & LOGGING HELPERS
    // ==========================================
    async function initConfig() {
        try {
            const res = await fetch("/api/config");
            const data = await res.json();
            state.isMockMode = data.is_mock_mode;
            
            if (state.isMockMode) {
                dbStatus.textContent = "MOCK FLUID SYSTEM";
                dbStatus.style.color = "var(--color-warning)";
                dbStatus.parentElement.querySelector(".status-dot").style.backgroundColor = "var(--color-warning)";
                dbStatus.parentElement.querySelector(".status-dot").style.boxShadow = "0 0 10px var(--color-warning)";
            } else {
                dbStatus.textContent = "ONLINE CORE";
                dbStatus.style.color = "var(--color-success)";
                dbStatus.parentElement.querySelector(".status-dot").style.backgroundColor = "var(--color-success)";
                dbStatus.parentElement.querySelector(".status-dot").style.boxShadow = "0 0 10px var(--color-success)";
            }

            // Initialize Supabase Client dynamically
            if (data.supabase_url && data.supabase_anon_key && !data.supabase_url.includes("your-supabase")) {
                try {
                    supabaseClient = supabase.createClient(data.supabase_url, data.supabase_anon_key);
                    writeLog("[SYS] Supabase Frontend client initialized.");
                    
                    // Listen to auth changes
                    supabaseClient.auth.onAuthStateChange(async (event, session) => {
                        if (session) {
                            state.user = {
                                id: session.user.id,
                                email: session.user.email,
                                username: session.user.email.split("@")[0].toUpperCase()
                            };
                            renderUserSignedIn(state.user.username);
                            writeLog(`[AUTH] Session synchronized: ${state.user.username}`);
                        } else {
                            state.user = null;
                            renderUserSignedOut();
                        }
                    });
                    
                    // Restore existing session
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (session) {
                        state.user = {
                            id: session.user.id,
                            email: session.user.email,
                            username: session.user.email.split("@")[0].toUpperCase()
                        };
                        renderUserSignedIn(state.user.username);
                    }
                } catch (e) {
                    writeLog(`[SYS] Supabase Init failed: ${e.message}`, true);
                }
            }

            writeLog(`[SYS] Diagnostics engine bound. Mode: ${state.isMockMode ? "Mock Heuristics Model" : "Supabase PostgreSQL Database"}`);
            
            // Load homepage short feed and apply card tilt effects
            loadLatestNewsShort();
            applyCardTilt();

        } catch (e) {
            writeLog(`[SYS] Failed to configure settings. Falling back to offline engine.`);
        }
    }

    function writeLog(text, isError = false) {
        const timestamp = new Date().toLocaleTimeString();
        const color = isError ? "var(--color-danger)" : "#58a6ff";
        terminalLog.innerHTML += `<br><span style="color: ${color}">[${timestamp}] ${text}</span>`;
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    function broadcastScanTicker(text) {
        scanTicker.textContent = text.toUpperCase();
        scanTicker.style.animation = "none";
        scanTicker.offsetHeight; // trigger reflow
        scanTicker.style.animation = "text-scroll 30s linear infinite";
    }

    // ==========================================
    // 3. SCANNER ACTIONS (RADAR AUDITS)
    // ==========================================
    scanTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            scanTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const targetTab = tab.getAttribute("data-tab");
            state.activeInputTab = targetTab;
            
            document.getElementById("inputGroupText").classList.remove("active");
            document.getElementById("inputGroupUrl").classList.remove("active");
            document.getElementById("inputGroupImage").classList.remove("active");
            document.getElementById("inputGroupVideo").classList.remove("active");
            
            if (targetTab === "text") {
                document.getElementById("inputGroupText").classList.add("active");
            } else if (targetTab === "url") {
                document.getElementById("inputGroupUrl").classList.add("active");
            } else if (targetTab === "image") {
                document.getElementById("inputGroupImage").classList.add("active");
            } else if (targetTab === "video") {
                document.getElementById("inputGroupVideo").classList.add("active");
            }
            writeLog(`[SYS] Scan context shifted to: ${targetTab.toUpperCase()}`);
        });
    });

    // Image Upload zones
    dropZone.addEventListener("click", () => imageInput.click());
    imageInput.addEventListener("change", (e) => handleSelectedFile(e.target.files[0]));
    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        handleSelectedFile(e.dataTransfer.files[0]);
    });

    function handleSelectedFile(file) {
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
            writeLog("[SYS] File too large. Limited to 4MB.", true);
            alert("File exceeds maximum 4MB limit.");
            return;
        }
        selectedFileName.textContent = file.name;
        dropZone.style.display = "none";
        filePreviewWrap.style.display = "flex";
        state.pastedImageUrl = null; // Reset URL since file is queued
        writeLog(`[SYS] Selected media queued: ${file.name} (${(file.size/1024).toFixed(1)} KB)`);
    }

    clearFileBtn.addEventListener("click", () => {
        imageInput.value = "";
        dropZone.style.display = "block";
        filePreviewWrap.style.display = "none";
        state.pastedImageUrl = null;
        writeLog("[SYS] Cleared queued image.");
    });

    // Support photo Ctrl+V clipboard paste (files or URL text link) globally
    window.addEventListener("paste", async (e) => {
        if (state.activePage !== "radar" || state.activeInputTab !== "image") return;
        
        // 1. Check if paste contains binary file image
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                const blob = item.getAsFile();
                const file = new File([blob], "pasted_clipboard_image.png", {type: blob.type});
                
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageInput.files = dataTransfer.files;
                
                handleSelectedFile(file);
                writeLog("[SYS] Captured photo pasted from clipboard!");
                return;
            }
        }
        
        // 2. Check if paste contains text URL of image
        const pastedText = e.clipboardData.getData("text").trim();
        if (pastedText.startsWith("http://") || pastedText.startsWith("https://") || pastedText.match(/\.(jpeg|jpg|gif|png|webp|tiff)/i)) {
            writeLog(`[SYS] Paste URL detected: ${pastedText}`);
            
            // Set input visual cues
            dropZone.style.display = "none";
            filePreviewWrap.style.display = "flex";
            selectedFileName.textContent = pastedText.substring(0, 35) + "...";
            state.pastedImageUrl = pastedText; // Save in state
            writeLog("[SYS] Pasted image URL queued. Ready for audit.");
        }
    });

    // Video Upload zones
    dropZoneVideo.addEventListener("click", () => videoInput.click());
    videoInput.addEventListener("change", (e) => handleSelectedVideo(e.target.files[0]));
    dropZoneVideo.addEventListener("dragover", (e) => { e.preventDefault(); dropZoneVideo.classList.add("dragover"); });
    dropZoneVideo.addEventListener("dragleave", () => dropZoneVideo.classList.remove("dragover"));
    dropZoneVideo.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZoneVideo.classList.remove("dragover");
        handleSelectedVideo(e.dataTransfer.files[0]);
    });

    function handleSelectedVideo(file) {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            writeLog("[SYS] Video too large. Limited to 10MB.", true);
            alert("Video file size must be less than 10MB.");
            return;
        }
        selectedVideoName.textContent = file.name;
        dropZoneVideo.style.display = "none";
        videoPreviewWrap.style.display = "flex";
        
        // Load video file in the console HTML5 video player
        forensicVideoPlayer.src = URL.createObjectURL(file);
        forensicVideoPlayer.load();
        
        writeLog(`[SYS] Queued video stream: ${file.name} (${(file.size/(1024*1024)).toFixed(2)} MB)`);
    }

    clearVideoBtn.addEventListener("click", () => {
        videoInput.value = "";
        dropZoneVideo.style.display = "block";
        videoPreviewWrap.style.display = "none";
        forensicVideoPlayer.src = "";
        writeLog("[SYS] Cleared video queue.");
    });

    // Execute Audit
    runAuditBtn.addEventListener("click", async () => {
        const spinner = runAuditBtn.querySelector(".loader-spinner");
        const btnText = runAuditBtn.querySelector(".btn-text");
        
        try {
            if (state.activeInputTab === "text" && textInput.value.trim().length < 10) {
                alert("Please write at least 10 characters to analyze.");
                return;
            }
            if (state.activeInputTab === "url" && urlInput.value.trim().length < 4) {
                alert("Please enter a valid URL path.");
                return;
            }
            if (state.activeInputTab === "image" && !imageInput.files[0] && !state.pastedImageUrl) {
                alert("Please drag or load an image file first.");
                return;
            }
            if (state.activeInputTab === "video" && !videoInput.files[0]) {
                alert("Please upload a video file first.");
                return;
            }

            spinner.style.display = "inline-block";
            btnText.textContent = "RUNNING MEDIA AUDIT...";
            runAuditBtn.disabled = true;

            writeLog("[SYS] Opening media diagnostics pipeline...");
            
            let res, data;
            
            if (state.activeInputTab === "text") {
                writeLog("[SYS] Executing local TF-IDF stylistic classifier...");
                res = await fetch("/api/analyze/text", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: textInput.value,
                        user_id: state.user ? state.user.id : null
                    })
                });
                data = await res.json();
                state.currentScanReportId = data.id;
                renderTextReport(textInput.value, data.analysis);
                
            } else if (state.activeInputTab === "url") {
                writeLog(`[SYS] Crawling target news directory: ${urlInput.value}`);
                writeLog("[SYS] Parsing DOM blocks for raw text extraction...");
                
                const formData = new FormData();
                formData.append("url", urlInput.value);
                if (state.user) formData.append("user_id", state.user.id);
                
                res = await fetch("/api/analyze/url", {
                    method: "POST",
                    body: formData
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || "URL Crawl failed.");
                }
                data = await res.json();
                state.currentScanReportId = data.id;
                renderTextReport(data.headline, data.analysis, urlInput.value);
                
            } else if (state.activeInputTab === "image") {
                if (state.pastedImageUrl && !imageInput.files[0]) {
                    writeLog(`[SYS] Triggering server download of image URL: ${state.pastedImageUrl}`);
                    res = await fetch("/api/analyze/image_url", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url: state.pastedImageUrl,
                            user_id: state.user ? state.user.id : null
                        })
                    });
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.detail || "Image download failed.");
                    }
                    data = await res.json();
                    state.currentScanReportId = data.id;
                    renderImageReport({ name: "downloaded_image.jpg" }, data.exif, data.analysis, state.pastedImageUrl);
                } else {
                    writeLog("[SYS] Scraping image EXIF headers...");
                    writeLog("[SYS] Checking face blending and structural warp lines...");
                    
                    const formData = new FormData();
                    formData.append("file", imageInput.files[0]);
                    if (state.user) formData.append("user_id", state.user.id);
                    
                    res = await fetch("/api/analyze/image", {
                        method: "POST",
                        body: formData
                    });
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.detail || "Image upload failed.");
                    }
                    data = await res.json();
                    state.currentScanReportId = data.id;
                    renderImageReport(imageInput.files[0], data.exif, data.analysis);
                }
                
            } else if (state.activeInputTab === "video") {
                writeLog("[SYS] Scanning frame changes and audio sync...");
                writeLog("[SYS] Auditing temporal video deepfake alerts...");
                
                const formData = new FormData();
                formData.append("file", videoInput.files[0]);
                if (state.user) formData.append("user_id", state.user.id);
                
                res = await fetch("/api/analyze/video", {
                    method: "POST",
                    body: formData
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || "Video upload failed.");
                }
                data = await res.json();
                state.currentScanReportId = data.id;
                renderVideoReport(videoInput.files[0], data.analysis);
            }

            writeLog("[SYS] Audit telemetry loaded successfully.");
            
        } catch (err) {
            writeLog(`[ERROR] Audit pipeline faulted: ${err.message}`, true);
            alert("Diagnostics failed. Look at telemetry logs.");
        } finally {
            spinner.style.display = "none";
            btnText.textContent = "RUN MACHINE LEARNING AUDIT";
            runAuditBtn.disabled = false;
        }
    });

    // Render Text Reports
    function renderTextReport(originalText, analysis, url = null) {
        state.currentScanReport = analysis;
        
        reportBlankState.style.display = "none";
        reportResults.style.display = "block";
        inspectorTextSection.style.display = "block";
        inspectorImageSection.style.display = "none";
        inspectorVideoSection.style.display = "none";

        reportHeadline.textContent = url ? `SOURCE: ${url.replace('https://','').substring(0,35)}` : (originalText.substring(0, 60) + "...");
        reportTypeBadge.textContent = url ? "URL CRITICAL" : "TEXT AUDIT";
        
        // Gauge trust dial score
        const score = analysis.credibility_score;
        gaugeScoreVal.textContent = `${score}%`;
        
        // Offset Calculation: 264 * (1 - score/100)
        const offset = 264 * (1 - score / 100);
        gaugeFill.style.strokeDashoffset = offset;
        
        // Set gauge color based on score
        if (score >= 60) {
            gaugeFill.style.stroke = "var(--color-success)";
            gaugeScoreVal.style.color = "var(--color-success)";
        } else if (score >= 40) {
            gaugeFill.style.stroke = "var(--color-warning)";
            gaugeScoreVal.style.color = "var(--color-warning)";
        } else {
            gaugeFill.style.stroke = "var(--color-danger)";
            gaugeScoreVal.style.color = "var(--color-danger)";
        }

        // Verdict Banner Configuration
        verdictLabel.textContent = analysis.verdict_label.toUpperCase();
        verdictDesc.textContent = analysis.verdict_desc;
        verdictBanner.className = "verdict-banner " + (analysis.status_class || "warning");

        // Authenticity Stamp Seal Configuration
        const stampEl = document.getElementById("verdictStamp");
        if (analysis.status_class === "success") {
            stampEl.textContent = "VERIFIED TRUE";
            stampEl.className = "verdict-stamp verified-true";
        } else if (analysis.status_class === "danger") {
            stampEl.textContent = "FABRICATED FALSE";
            stampEl.className = "verdict-stamp debunked-false";
        } else if (analysis.status_class === "warning" && score >= 50) {
            stampEl.textContent = "MIXED TRUTH";
            stampEl.className = "verdict-stamp mixed-reputation";
        } else {
            stampEl.textContent = "SUSPICIOUS";
            stampEl.className = "verdict-stamp mixed-reputation";
        }
        
        // Hide subject badge for text
        reportSubjectBadge.style.display = "none";

        // Bias Leaning Badge
        const biasCat = analysis.bias_category || "Center";
        reportBiasBadge.textContent = biasCat.toUpperCase();
        if (biasCat.toLowerCase().includes("left")) {
            reportBiasBadge.style.color = "var(--color-primary)";
            reportBiasBadge.style.borderColor = "rgba(99, 102, 241, 0.3)";
        } else if (biasCat.toLowerCase().includes("right")) {
            reportBiasBadge.style.color = "var(--color-danger)";
            reportBiasBadge.style.borderColor = "rgba(244, 63, 94, 0.3)";
        } else {
            reportBiasBadge.style.color = "var(--color-success)";
            reportBiasBadge.style.borderColor = "rgba(16, 185, 129, 0.3)";
        }

        // clickbait & intensity progress levels
        const metrics = analysis.metrics || {};
        const clickbait = metrics.clickbait_score !== undefined ? metrics.clickbait_score : 0;
        const intensity = metrics.sensationalism_score !== undefined ? metrics.sensationalism_score : 0;
        
        clickbaitVal.textContent = `${clickbait}%`;
        clickbaitBar.style.width = `${clickbait}%`;
        clickbaitBar.style.backgroundColor = clickbait > 70 ? "var(--color-danger)" : (clickbait > 40 ? "var(--color-warning)" : "var(--color-primary)");
        
        intensityVal.textContent = `${intensity}%`;
        intensityBar.style.width = `${intensity}%`;
        intensityBar.style.backgroundColor = intensity > 70 ? "var(--color-danger)" : (intensity > 40 ? "var(--color-warning)" : "var(--color-primary)");

        // Highlight Logical Fallacies
        const fallacies = metrics.logical_fallacies || [];
        let highlighted = originalText;
        
        if (fallacies.length > 0) {
            fallacies.forEach((f, idx) => {
                const escaped = f.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                try {
                    const regex = new RegExp(`(${escaped})`, "g");
                    highlighted = highlighted.replace(regex, `<span class="fallacy-highlight" data-idx="${idx}">$1</span>`);
                } catch (e) {
                    console.log("Fallback replacement failed");
                }
            });
        }
        
        fallacyTextCanvas.innerHTML = highlighted;
        fallacyDetailsPopup.style.display = "none";
        
        // Event triggers for Highlights
        const elements = fallacyTextCanvas.querySelectorAll(".fallacy-highlight");
        elements.forEach(el => {
            el.addEventListener("click", () => {
                elements.forEach(e => e.classList.remove("selected"));
                el.classList.add("selected");
                
                const index = parseInt(el.getAttribute("data-idx"));
                const fallacy = fallacies[index];
                
                popupFallacyName.textContent = fallacy.fallacy.toUpperCase();
                popupFallacyExplanation.textContent = fallacy.explanation;
                popupFallacyCorrection.textContent = fallacy.correction;
                fallacyDetailsPopup.style.display = "block";
            });
        });

        // Verdict conclusion text
        reportReasoningText.textContent = analysis.reasoning;

        // Render Related/Follow-up News Grid
        renderRelatedNews(analysis.related_news || []);
        
        broadcastScanTicker(`LOCAL ML DIAGNOSTIC COMPLETE: score=${score}% bias=${analysis.bias_category}`);
    }

    // Render Related News Section
    function renderRelatedNews(articles) {
        relatedNewsGrid.innerHTML = "";
        
        if (articles.length === 0) {
            document.getElementById("relatedNewsSection").style.display = "none";
            return;
        }

        document.getElementById("relatedNewsSection").style.display = "block";
        articles.forEach(art => {
            const card = document.createElement("div");
            card.className = "related-card";
            card.innerHTML = `
                <div class="related-card-head">
                    <span>${art.source.toUpperCase()}</span>
                    <span style="color: var(--color-success)">Truth: ${art.credibility_score}%</span>
                </div>
                <h5>${art.title}</h5>
            `;
            
            card.addEventListener("click", () => {
                window.open(art.url, "_blank");
            });
            relatedNewsGrid.appendChild(card);
        });
    }

    // Render Image Reports
    function renderImageReport(file, exif, analysis, url = null) {
        state.currentScanReport = analysis;
        
        reportBlankState.style.display = "none";
        reportResults.style.display = "block";
        inspectorTextSection.style.display = "none";
        inspectorVideoSection.style.display = "none";
        inspectorImageSection.style.display = "block";

        reportHeadline.textContent = url ? `IMAGE URL: ${url.substring(0,35)}...` : `VISION AUDIT: ${file.name}`;
        reportTypeBadge.textContent = "VISION SCAN";

        // Dial Gauge
        const score = analysis.credibility_score;
        gaugeScoreVal.textContent = `${score}%`;
        const offset = 264 * (1 - score / 100);
        gaugeFill.style.strokeDashoffset = offset;
        
        if (score >= 80) {
            gaugeFill.style.stroke = "var(--color-success)";
            gaugeScoreVal.style.color = "var(--color-success)";
        } else if (score >= 50) {
            gaugeFill.style.stroke = "var(--color-warning)";
            gaugeScoreVal.style.color = "var(--color-warning)";
        } else {
            gaugeFill.style.stroke = "var(--color-danger)";
            gaugeScoreVal.style.color = "var(--color-danger)";
        }

        // Verdict Banner
        verdictLabel.textContent = analysis.verdict.toUpperCase();
        verdictDesc.textContent = analysis.reasoning;
        verdictBanner.className = "verdict-banner " + (analysis.status_class || "warning");

        // Authenticity Stamp Seal Configuration
        const stampEl = document.getElementById("verdictStamp");
        if (analysis.status_class === "success") {
            stampEl.textContent = "VERIFIED ORIGINAL";
            stampEl.className = "verdict-stamp verified-true";
        } else if (analysis.status_class === "danger") {
            stampEl.textContent = "ALTERED / MORPHED";
            stampEl.className = "verdict-stamp debunked-false";
        } else {
            stampEl.textContent = "UNVERIFIED ORIGIN";
            stampEl.className = "verdict-stamp mixed-reputation";
        }

        // Display detected subject badge
        reportSubjectBadge.textContent = analysis.detected_subjects || "Mixed Subjects";
        reportSubjectBadge.style.display = "inline-block";

        // Verdict Badge Leaning
        reportBiasBadge.textContent = analysis.verdict.toUpperCase();
        if (analysis.verdict.toLowerCase().includes("authentic") || analysis.verdict.toLowerCase().includes("unedited")) {
            reportBiasBadge.style.color = "var(--color-success)";
            reportBiasBadge.style.borderColor = "var(--color-success)";
        } else if (analysis.verdict.toLowerCase().includes("morph") || analysis.verdict.toLowerCase().includes("altered")) {
            reportBiasBadge.style.color = "var(--color-danger)";
            reportBiasBadge.style.borderColor = "var(--color-danger)";
        } else {
            reportBiasBadge.style.color = "var(--color-warning)";
            reportBiasBadge.style.borderColor = "var(--color-warning)";
        }

        // Metadata Progress Bars
        clickbaitVal.textContent = exif.has_exif ? "EXIF Active" : "No EXIF Record";
        clickbaitBar.style.width = exif.has_exif ? "100%" : "0%";
        clickbaitBar.style.backgroundColor = exif.has_exif ? "var(--color-success)" : "var(--color-danger)";
        
        const anomalies = analysis.anomalies || [];
        intensityVal.textContent = `${anomalies.length} Alerts`;
        intensityBar.style.width = `${Math.min(anomalies.length * 25, 100)}%`;
        intensityBar.style.backgroundColor = anomalies.length > 0 ? "var(--color-warning)" : "var(--color-success)";

        // Read image file into preview
        if (url) {
            forensicImagePreview.src = url;
            forensicImagePreview.onload = () => {
                drawForensicCanvasOverlay(analysis.regions);
            };
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                forensicImagePreview.src = e.target.result;
                forensicImagePreview.onload = () => {
                    drawForensicCanvasOverlay(analysis.regions);
                };
            };
            reader.readAsDataURL(file);
        }

        // Load EXIF row values
        metadataRows.innerHTML = `
            <div class="exif-row">
                <span class="metadata-label">EXIF Tags Present:</span>
                <span class="metadata-val">${exif.has_exif ? "YES" : "NO"}</span>
            </div>
            <div class="exif-row">
                <span class="metadata-label">Capture Hardware:</span>
                <span class="metadata-val">${exif.camera_make || "UNKNOWN"} ${exif.camera_model || ""}</span>
            </div>
            <div class="exif-row">
                <span class="metadata-label">Modification Stamp:</span>
                <span class="metadata-val">${exif.date_time_original || exif.date_time || "N/A"}</span>
            </div>
        `;
        
        metadataNote.innerHTML = `<strong>EXIF Auditor Tag:</strong> ${exif.software_flag}`;
        if (exif.software_alert) {
            metadataNote.style.color = "var(--color-danger)";
        } else {
            metadataNote.style.color = "var(--text-secondary)";
        }

        // Conclusion Verdict
        reportReasoningText.textContent = analysis.reasoning;
        
        // Related news empty for image
        renderRelatedNews([]);
        
        broadcastScanTicker(`IMAGE AUDIT: filename=${file.name} verdict=${analysis.verdict}`);
    }

    // Draw visual boxes on image canvas overlay
    function drawForensicCanvasOverlay(regions) {
        const canvas = forensicCanvasOverlay;
        const img = forensicImagePreview;
        
        // Match display boundaries
        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!regions || regions.length === 0) return;
        
        regions.forEach(reg => {
            const rx = (reg.x * canvas.width) / 100;
            const ry = (reg.y * canvas.height) / 100;
            const rw = (reg.w * canvas.width) / 100;
            const rh = (reg.h * canvas.height) / 100;
            
            // Set styles matching status flag
            let color = "#10b981"; // emerald passed
            if (reg.status === "flagged") {
                color = "#f43f5e"; // rose flagged
            } else if (reg.status === "warning") {
                color = "#f59e0b"; // amber warning
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(rx, ry, rw, rh);
            
            ctx.fillStyle = color;
            ctx.fillRect(rx, ry, Math.min(rw, reg.label.length * 7.5 + 8), 16);
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px 'Fira Code', monospace";
            ctx.fillText(reg.label.toUpperCase(), rx + 4, ry + 11);
        });
        writeLog("[SYS] Bounding boxes and inspection frames drawn on photo.");
    }

    // Render Video Reports
    function renderVideoReport(file, analysis) {
        state.currentScanReport = analysis;
        
        reportBlankState.style.display = "none";
        reportResults.style.display = "block";
        inspectorTextSection.style.display = "none";
        inspectorImageSection.style.display = "none";
        inspectorVideoSection.style.display = "block";

        reportHeadline.textContent = `VIDEO FORENSICS: ${file.name}`;
        reportTypeBadge.textContent = "VIDEO SCAN";
        
        // Hide subject badge
        reportSubjectBadge.style.display = "none";

        // Dial Gauge
        const score = analysis.credibility_score;
        gaugeScoreVal.textContent = `${score}%`;
        const offset = 264 * (1 - score / 100);
        gaugeFill.style.strokeDashoffset = offset;
        
        if (score >= 80) {
            gaugeFill.style.stroke = "var(--color-success)";
            gaugeScoreVal.style.color = "var(--color-success)";
        } else if (score >= 50) {
            gaugeFill.style.stroke = "var(--color-warning)";
            gaugeScoreVal.style.color = "var(--color-warning)";
        } else {
            gaugeFill.style.stroke = "var(--color-danger)";
            gaugeScoreVal.style.color = "var(--color-danger)";
        }

        // Verdict Banner
        verdictLabel.textContent = analysis.verdict.toUpperCase();
        verdictDesc.textContent = analysis.reasoning;
        verdictBanner.className = "verdict-banner " + (analysis.status_class || "warning");

        // Authenticity Stamp Seal Configuration
        const stampEl = document.getElementById("verdictStamp");
        if (analysis.status_class === "success") {
            stampEl.textContent = "VERIFIED VIDEO";
            stampEl.className = "verdict-stamp verified-true";
        } else if (analysis.status_class === "danger") {
            stampEl.textContent = "DEEPFAKE DETECTED";
            stampEl.className = "verdict-stamp debunked-false";
        } else {
            stampEl.textContent = "SUSPICIOUS CLIP";
            stampEl.className = "verdict-stamp mixed-reputation";
        }

        // Verdict Badge
        reportBiasBadge.textContent = analysis.verdict.toUpperCase();
        if (analysis.status_class === "success") {
            reportBiasBadge.style.color = "var(--color-success)";
            reportBiasBadge.style.borderColor = "var(--color-success)";
        } else if (analysis.status_class === "danger") {
            reportBiasBadge.style.color = "var(--color-danger)";
            reportBiasBadge.style.borderColor = "var(--color-danger)";
        } else {
            reportBiasBadge.style.color = "var(--color-warning)";
            reportBiasBadge.style.borderColor = "var(--color-warning)";
        }

        // Metadata Progress Bars
        clickbaitVal.textContent = "H.264 Stream codec";
        clickbaitBar.style.width = "100%";
        clickbaitBar.style.backgroundColor = "var(--color-primary)";
        
        const anomalies = analysis.anomalies || [];
        intensityVal.textContent = `${anomalies.length} Flagged Glitches`;
        intensityBar.style.width = `${Math.min(anomalies.length * 30, 100)}%`;
        intensityBar.style.backgroundColor = anomalies.length > 0 ? "var(--color-danger)" : "var(--color-success)";

        // Set metadata text
        const meta = analysis.metadata || {};
        vidName.textContent = meta.filename || file.name;
        vidCodec.textContent = meta.size_kb ? `${(meta.size_kb/1024).toFixed(2)} MB` : "";

        // Load list of video anomalies
        videoAnomaliesUl.innerHTML = "";
        anomalies.forEach(anom => {
            const li = document.createElement("li");
            li.textContent = anom;
            videoAnomaliesUl.appendChild(li);
        });

        // Reasoning Text
        reportReasoningText.textContent = analysis.reasoning;
        
        // Clear related news
        renderRelatedNews([]);
        
        broadcastScanTicker(`VIDEO DEEPFAKE AUDIT: filename=${file.name} score=${score}%`);
    }



    // ==========================================
    // 5. CURRENT AFFAIRS VERIFIED NEWS ROOM
    // ==========================================
    async function loadVerifiedFeed() {
        try {
            verifiedNewsFeed.innerHTML = '<div class="feed-loading">CONNECTING TO SECURE JOURNAL REGISTRY...</div>';
            
            const res = await fetch("/api/feeds");
            const data = await res.json();
            
            state.newsList = data.global_news;
            renderVerifiedFeed();
        } catch (e) {
            verifiedNewsFeed.innerHTML = '<div class="feed-loading" style="color: var(--color-danger)">Registry query failed.</div>';
        }
    }

    function renderVerifiedFeed() {
        verifiedNewsFeed.innerHTML = "";
        
        let filtered = state.newsList;
        if (state.activeNewsFilter !== "all-topics") {
            filtered = filtered.filter(item => item.category.toLowerCase() === state.activeNewsFilter.toLowerCase());
        }

        if (state.newsSearchQuery.trim() !== "") {
            const query = state.newsSearchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.summary.toLowerCase().includes(query) || 
                item.source.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            verifiedNewsFeed.innerHTML = '<div class="feed-loading">No verified articles match your search query.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "feed-item";
            
            card.innerHTML = `
                <div class="feed-item-image-wrap">
                    <img src="${item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80'}" alt="News Cover">
                    <span class="feed-item-category-pill">${item.category.toUpperCase()}</span>
                </div>
                <div class="feed-item-content">
                    <div class="feed-item-header">
                        <span class="feed-item-source">${item.source.toUpperCase()}</span>
                        <span class="feed-item-badge verified">VERIFIED REPORT</span>
                    </div>
                    <h4>${item.title}</h4>
                    <p>${item.summary.substring(0, 100)}...</p>
                    <div class="feed-item-footer">
                        <span style="font-weight: 700; color: var(--color-success);">TRUTH FACTOR: ${item.credibility_score}%</span>
                        <span style="color: var(--color-primary); font-weight: bold;">View Details →</span>
                    </div>
                </div>
                
                <!-- Hover Glass Preview Overlay -->
                <div class="feed-item-hover-preview">
                    <div class="hover-preview-header">
                        <span class="feed-item-source">${item.source.toUpperCase()}</span>
                        <span style="font-weight: 800; color: var(--color-success);">${item.credibility_score}% AUTHENTIC</span>
                    </div>
                    <div class="hover-preview-body">
                        <p>${item.summary}</p>
                    </div>
                    <div class="hover-preview-footer">
                        <button class="btn btn-secondary hover-verify-btn">Verify in Suite 🔬</button>
                        <button class="btn btn-primary hover-source-btn">Go to Source 🔗</button>
                    </div>
                </div>
            `;
            
            // Clicking news card opens dynamic preview modal
            card.addEventListener("click", () => {
                openNewsModal(item);
            });
            
            // Hover buttons events
            card.querySelector(".hover-source-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                window.open(item.url, "_blank");
            });
            
            card.querySelector(".hover-verify-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                urlInput.value = item.url.replace("https://", "");
                navigateToPage("radar");
                const tabBtn = document.querySelector('[data-tab="url"]');
                if (tabBtn) tabBtn.click();
                writeLog(`[SYS] Scraped verified item URL imported for scanner: ${item.url}`);
            });
            
            verifiedNewsFeed.appendChild(card);
        });
        applyCardTilt();
    }

    function openNewsModal(item) {
        activePreviewItem = item;
        prevSource.textContent = item.source.toUpperCase();
        prevTitle.textContent = item.title;
        prevSummary.textContent = item.summary;
        prevCategory.textContent = item.category.toUpperCase();
        prevScore.textContent = `${item.credibility_score}%`;
        prevImage.src = item.image_url;
        
        newsPreviewModal.classList.add("active");
        writeLog(`[NEWS] Previewing article: ${item.title}`);
    }

    // Modal Actions
    closePreviewModal.addEventListener("click", () => {
        newsPreviewModal.classList.remove("active");
    });

    previewStayBtn.addEventListener("click", () => {
        newsPreviewModal.classList.remove("active");
    });

    previewSourceBtn.addEventListener("click", () => {
        if (activePreviewItem) {
            window.open(activePreviewItem.url, "_blank");
            newsPreviewModal.classList.remove("active");
        }
    });

    previewVerifyBtn.addEventListener("click", () => {
        if (activePreviewItem) {
            urlInput.value = activePreviewItem.url.replace("https://", "");
            newsPreviewModal.classList.remove("active");
            navigateToPage("radar");
            const tabBtn = document.querySelector('[data-tab="url"]');
            if (tabBtn) tabBtn.click();
            writeLog(`[SYS] Scraped verified item URL imported for scanner: ${activePreviewItem.url}`);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.activeNewsFilter = btn.textContent.toLowerCase().replace(" ", "-");
            renderVerifiedFeed();
        });
    });

    newsSearchInput.addEventListener("input", (e) => {
        state.newsSearchQuery = e.target.value;
        renderVerifiedFeed();
    });

    // ==========================================
    // 6. RUMORS & LEAKS REGISTRY
    // ==========================================
    async function loadRumorsLedger() {
        try {
            debunkRumorsFeed.innerHTML = '<div class="feed-loading">PARSING INTERNET DISINFORMATION GRAPHS...</div>';
            
            const res = await fetch("/api/feeds");
            const data = await res.json();
            
            debunkRumorsFeed.innerHTML = "";
            
            if (data.debunk_rumors.length === 0) {
                debunkRumorsFeed.innerHTML = '<div class="feed-loading">No active rumors detected.</div>';
                return;
            }
            
            data.debunk_rumors.forEach(item => {
                const card = document.createElement("div");
                card.className = "leak-ledger-card";
                
                let badgeClass = "unverified";
                let badgeText = "UNVERIFIED CLAIM";
                let scoreClass = "warning";
                if (item.status === "debunked") {
                    badgeClass = "debunked";
                    badgeText = "DEBUNKED HOAX";
                    scoreClass = "danger";
                }
                
                card.innerHTML = `
                    <div class="leak-score-badge ${scoreClass}">
                        <span class="leak-score-num">${item.score}</span>
                        <span class="leak-score-label">THREAT</span>
                    </div>
                    <div class="leak-details">
                        <div class="leak-details-header">
                            <span class="leak-source-check">${item.source_factcheck.toUpperCase()}</span>
                            <span class="leak-status-label ${badgeClass}">${badgeText}</span>
                        </div>
                        <h3>${item.claim}</h3>
                        <p>${item.summary}</p>
                    </div>
                `;
                
                debunkRumorsFeed.appendChild(card);
            });
        } catch (e) {
            debunkRumorsFeed.innerHTML = '<div class="feed-loading" style="color: var(--color-danger)">Leaks registry parser offline.</div>';
        }
    }

    // ==========================================
    // 7. DOMAIN REPUTATION REGISTRY LOOKUP
    // ==========================================
    runDomainLookupBtn.addEventListener("click", () => triggerDomainLookup());
    domainSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") triggerDomainLookup();
    });

    suggestPills.forEach(pill => {
        pill.addEventListener("click", () => {
            domainSearchInput.value = pill.textContent;
            triggerDomainLookup();
        });
    });

    async function triggerDomainLookup() {
        const query = domainSearchInput.value.trim();
        if (!query) return;

        writeLog(`[SYS] Accessing Domain Trust Registry for query: ${query}`);

        try {
            const res = await fetch(`/api/domain/lookup?domain=${encodeURIComponent(query)}`);
            const data = await res.json();

            // Render Results state
            domainEmptyState.style.display = "none";
            domainResultsState.style.display = "block";

            domName.textContent = data.name;
            domDomain.textContent = query.toLowerCase();
            domFactual.textContent = data.factual_reporting.toUpperCase();
            domBias.textContent = data.bias.toUpperCase();
            domDescription.textContent = data.description;
            domConspiracies.textContent = data.known_conspiracies;

            // Highlight if conspiracies exist
            if (data.known_conspiracies.toLowerCase().includes("frequent") || data.known_conspiracies.toLowerCase().includes("promoted")) {
                conspiraciesContainer.style.backgroundColor = "rgba(244, 63, 94, 0.04)";
                conspiraciesContainer.style.border = "1.5px dashed rgba(244, 63, 94, 0.3)";
                domConspiracies.style.color = "var(--color-danger)";
            } else {
                conspiraciesContainer.style.backgroundColor = "var(--color-bg-alt)";
                conspiraciesContainer.style.border = "1px solid var(--color-border)";
                domConspiracies.style.color = "var(--text-secondary)";
            }

            // Update domain bias label color matching
            if (data.bias.toLowerCase().includes("left")) {
                domReputationLabel.style.color = "var(--color-primary)";
                domReputationLabel.style.borderColor = "rgba(99, 102, 241, 0.3)";
            } else if (data.bias.toLowerCase().includes("right") || data.bias.toLowerCase().includes("conspiracy")) {
                domReputationLabel.style.color = "var(--color-danger)";
                domReputationLabel.style.borderColor = "rgba(244, 63, 94, 0.3)";
            } else {
                domReputationLabel.style.color = "var(--color-success)";
                domReputationLabel.style.borderColor = "rgba(16, 185, 129, 0.3)";
            }

            writeLog(`[SYS] Domain trust profile retrieved successfully for ${query}`);

        } catch (e) {
            writeLog(`[ERROR] Domain lookup failed: ${e.message}`, true);
        }
    }

    // ==========================================
    // 8. SECURITY AUTHENTICATION PROMPTS
    // ==========================================
    authBtn.addEventListener("click", () => {
        isRegistering = false;
        tabLoginBtn.click();
        authModal.classList.add("active");
    });

    closeAuthModal.addEventListener("click", () => {
        authModal.classList.remove("active");
    });

    tabLoginBtn.addEventListener("click", () => {
        isRegistering = false;
        tabLoginBtn.classList.add("active");
        tabRegisterBtn.classList.remove("active");
        authSubmitBtn.textContent = "VERIFY AGENT";
    });

    tabRegisterBtn.addEventListener("click", () => {
        isRegistering = true;
        tabRegisterBtn.classList.add("active");
        tabLoginBtn.classList.remove("active");
        authSubmitBtn.textContent = "REGISTER PROFILE";
    });

    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = authEmail.value;
        const password = authPassword.value;
        
        if (supabaseClient) {
            authSubmitBtn.disabled = true;
            const originalText = authSubmitBtn.textContent;
            authSubmitBtn.textContent = isRegistering ? "REGISTERING..." : "VERIFYING...";
            
            try {
                if (isRegistering) {
                    const { data, error } = await supabaseClient.auth.signUp({
                        email: email,
                        password: password
                    });
                    if (error) throw error;
                    alert("Registration successful! Check your email to verify your profile, or login directly if auto-approved.");
                    writeLog(`[AUTH] Registration submitted for: ${email}`);
                } else {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                    if (error) throw error;
                    writeLog(`[AUTH] Sign-in successful for: ${email}`);
                }
                authModal.classList.remove("active");
            } catch (err) {
                writeLog(`[AUTH ERROR] Authentication failed: ${err.message}`, true);
                alert("Authentication failed: " + err.message);
            } finally {
                authSubmitBtn.disabled = false;
                authSubmitBtn.textContent = originalText;
            }
        } else {
            // Mock Login fallback
            state.user = {
                id: "agent-uid-12345",
                email: email,
                username: email.split("@")[0].toUpperCase()
            };
            renderUserSignedIn(state.user.username);
            authModal.classList.remove("active");
            writeLog(`[AUTH] Mock agent verified: ${state.user.username}`);
        }
    });

    // Google Sign-in Handler
    const googleAuthBtn = document.getElementById("googleAuthBtn");
    if (googleAuthBtn) {
        googleAuthBtn.addEventListener("click", async () => {
            if (supabaseClient) {
                try {
                    writeLog("[AUTH] Redirecting to Google OAuth Provider...");
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin
                        }
                    });
                    if (error) throw error;
                } catch (err) {
                    writeLog(`[AUTH ERROR] Google sign-in failed: ${err.message}`, true);
                    alert("Google sign-in failed: " + err.message);
                }
            } else {
                // Mock Google Login fallback
                state.user = {
                    id: "agent-uid-google",
                    email: "google.agent@veritas.net",
                    username: "GOOGLE_AGENT"
                };
                renderUserSignedIn(state.user.username);
                authModal.classList.remove("active");
                writeLog("[AUTH] Mock Google sign-in successful.");
            }
        });
    }

    function renderUserSignedIn(username) {
        userPanel.innerHTML = `
            <div class="user-profile-widget">
                <span>AGENT: <span class="username-display">${username}</span></span>
                <span class="xp-badge">FORENSIC CHIEF</span>
                <button class="btn btn-secondary btn-sm" id="logoutBtn">LOGOUT</button>
            </div>
        `;
        document.getElementById("navVaultBtn").style.display = "block";
        
        document.getElementById("logoutBtn").addEventListener("click", async () => {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
            state.user = null;
            renderUserSignedOut();
            writeLog("[AUTH] Agent logged off.");
        });
    }

    function renderUserSignedOut() {
        userPanel.innerHTML = `<button class="btn btn-secondary" id="authBtn">Agent Login</button>`;
        document.getElementById("authBtn").addEventListener("click", () => {
            isRegistering = false;
            tabLoginBtn.click();
            authModal.classList.add("active");
        });
        document.getElementById("navVaultBtn").style.display = "none";
        if (state.activePage === "vault") {
            navigateToPage("radar");
        }
    }

    // Vault Page Rendering Engine
    async function loadVaultPage() {
        if (!state.user) {
            writeLog("[SYS] Vault page requires active agent credentials.");
            return;
        }

        const historyTableBody = document.getElementById("vaultHistoryTableBody");
        const bookmarksGrid = document.getElementById("vaultBookmarksGrid");
        const historyEmptyState = document.getElementById("historyEmptyState");
        const bookmarksEmptyState = document.getElementById("bookmarksEmptyState");
        const historyCount = document.getElementById("historyCount");
        const bookmarkCount = document.getElementById("bookmarkCount");

        // Fetch History List
        try {
            historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Retrieving ledger...</td></tr>';
            const res = await fetch(`/api/history?user_id=${state.user.id}`);
            const historyData = await res.json();

            historyTableBody.innerHTML = "";
            historyCount.textContent = `${historyData.length} Scans`;

            if (historyData.length === 0) {
                historyEmptyState.style.display = "block";
            } else {
                historyEmptyState.style.display = "none";
                historyData.forEach(scan => {
                    const row = document.createElement("tr");
                    const dateStr = new Date(scan.created_at).toLocaleDateString();
                    const inputBadge = `<span class="tag tag-type">${scan.input_type.toUpperCase()}</span>`;
                    
                    row.innerHTML = `
                        <td>${inputBadge}</td>
                        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${scan.headline || scan.content || "Scan Target"}</td>
                        <td><span style="font-weight: 700; color: ${scan.credibility_score >= 60 ? 'var(--color-success)' : (scan.credibility_score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)')}">${scan.credibility_score}%</span></td>
                        <td>${dateStr}</td>
                    `;
                    row.addEventListener("click", () => {
                        loadScanReportIntoSuite(scan);
                    });
                    historyTableBody.appendChild(row);
                });
            }
        } catch (e) {
            writeLog(`[ERROR] Failed to retrieve history: ${e.message}`, true);
        }

        // Fetch Bookmarks List
        try {
            bookmarksGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Retrieving vault...</div>';
            const res = await fetch(`/api/bookmarks?user_id=${state.user.id}`);
            const bookmarksData = await res.json();

            bookmarksGrid.innerHTML = "";
            bookmarkCount.textContent = `${bookmarksData.length} Bookmarks`;

            if (bookmarksData.length === 0) {
                bookmarksEmptyState.style.display = "block";
            } else {
                bookmarksEmptyState.style.display = "none";
                bookmarksData.forEach(scan => {
                    const card = document.createElement("div");
                    card.className = "vault-bookmark-card";
                    card.innerHTML = `
                        <button class="vault-bookmark-delete-btn" style="position: absolute; top: 12px; right: 12px; z-index: 10;">DELETE</button>
                        <h4>${scan.headline || "Credibility Report"}</h4>
                        <p>${scan.reasoning || ""}</p>
                        <div class="vault-bookmark-footer">
                            <span class="vault-bookmark-type">${scan.input_type.toUpperCase()}</span>
                            <span class="vault-bookmark-score">${scan.credibility_score}% TRUTH</span>
                        </div>
                    `;
                    
                    // Clicking delete removes the bookmark
                    card.querySelector(".vault-bookmark-delete-btn").addEventListener("click", async (e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to remove this bookmark?")) {
                            await deleteBookmark(scan.id);
                        }
                    });

                    // Clicking card reloads it into suite
                    card.addEventListener("click", () => {
                        loadScanReportIntoSuite(scan);
                    });
                    
                    bookmarksGrid.appendChild(card);
                });
            }
        } catch (e) {
            writeLog(`[ERROR] Failed to retrieve bookmarks: ${e.message}`, true);
        }
        applyCardTilt();
    }

    async function deleteBookmark(scanId) {
        try {
            const res = await fetch("/api/bookmarks/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: state.user.id,
                    scan_id: scanId
                })
            });
            const result = await res.json();
            if (result.success) {
                writeLog("[DB] Bookmark removed successfully.");
                loadVaultPage();
            } else {
                alert("Failed to delete bookmark: " + result.error);
            }
        } catch (e) {
            writeLog(`[ERROR] Delete bookmark failed: ${e.message}`, true);
        }
    }

    function loadScanReportIntoSuite(scan) {
        state.currentScanReport = scan;
        state.currentScanReportId = scan.id;

        // Render report depending on input type
        if (scan.input_type === "text" || scan.input_type === "url") {
            const mockUrl = scan.input_type === "url" ? scan.content : null;
            renderTextReport(scan.content, scan, mockUrl);
        } else if (scan.input_type === "image") {
            const mockExif = scan.exif_data || { has_exif: false };
            renderImageReport({ name: scan.headline || "scanned_image.jpg" }, mockExif, scan, scan.content);
        } else if (scan.input_type === "video") {
            renderVideoReport({ name: scan.headline || "scanned_video.mp4" }, scan);
        }

        navigateToPage("radar");
        writeLog(`[SYS] Scan report ${scan.id} loaded back into diagnostics console.`);
    }

    // Bookmark / Share report links
    saveBookmarkBtn.addEventListener("click", async () => {
        if (!state.currentScanReport) return;
        if (!state.user) {
            alert("Please login to save bookmarks.");
            return;
        }
        if (!state.currentScanReportId) {
            alert("Perform an audit scan first to bookmark it.");
            return;
        }

        try {
            const res = await fetch("/api/bookmarks/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: state.user.id,
                    scan_id: state.currentScanReportId
                })
            });
            const result = await res.json();
            if (result.success) {
                writeLog("[DB] Saved analysis report to database research vault.");
                alert("Report bookmarked successfully!");
            } else {
                alert("Bookmark failed: " + (result.error || "already bookmarked"));
            }
        } catch (e) {
            writeLog(`[ERROR] Bookmark save failed: ${e.message}`, true);
        }
    });

    shareReportBtn.addEventListener("click", () => {
        if (!state.currentScanReport) return;
        const mockLink = `${window.location.origin}/report/${state.currentScanReportId || 'scan-id'}`;
        navigator.clipboard.writeText(mockLink);
        writeLog(`[SYS] Share link copied: ${mockLink}`);
        alert("Report link copied to clipboard!");
    });

    // ==========================================
    // 9. LATEST NEWS IN SHORT (HOMEPAGE PANEL)
    // ==========================================
    async function loadLatestNewsShort() {
        const shortNewsFeed = document.getElementById("latestNewsShortFeed");
        if (!shortNewsFeed) return;
        
        try {
            const res = await fetch("/api/feeds");
            const data = await res.json();
            const news = data.global_news || [];
            
            shortNewsFeed.innerHTML = "";
            if (news.length === 0) {
                shortNewsFeed.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;">No news available.</div>';
                return;
            }
            
            // Show top 3 news items in short
            news.slice(0, 3).forEach(item => {
                const itemEl = document.createElement("div");
                itemEl.className = "short-news-item";
                itemEl.innerHTML = `
                    <div class="short-news-header">
                        <span class="short-news-source">${item.source.toUpperCase()}</span>
                        <span class="short-news-time">VERIFIED</span>
                    </div>
                    <h4 class="short-news-title">${item.title}</h4>
                    <p class="short-news-desc">${item.summary.substring(0, 75)}...</p>
                    <a href="#" class="short-news-link">Read Full Analysis →</a>
                `;
                
                // Add click events to open the news modal
                const openAction = (e) => {
                    e.preventDefault();
                    openNewsModal(item);
                };
                
                itemEl.querySelector(".short-news-title").addEventListener("click", openAction);
                itemEl.querySelector(".short-news-link").addEventListener("click", openAction);
                shortNewsFeed.appendChild(itemEl);
            });
            
        } catch (e) {
            shortNewsFeed.innerHTML = '<div style="font-size:12px;color:var(--color-danger);text-align:center;">Failed to load short news.</div>';
        }
    }

    // ==========================================
    // 10. FORENSICS CHATBOT CLIENT INTERACTION
    // ==========================================
    const chatbotTrigger = document.getElementById("chatbotTrigger");
    const chatbotPanel = document.getElementById("chatbotPanel");
    const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
    const chatbotForm = document.getElementById("chatbotForm");
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotBody = document.getElementById("chatbotBody");

    chatbotTrigger.addEventListener("click", () => {
        chatbotPanel.classList.toggle("active");
        if (chatbotPanel.classList.contains("active")) {
            chatbotInput.focus();
        }
    });

    chatbotCloseBtn.addEventListener("click", () => {
        chatbotPanel.classList.remove("active");
    });

    // Handle suggestion button clicks
    chatbotBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".chat-suggest-btn");
        if (btn) {
            const question = btn.getAttribute("data-q");
            sendChatMessage(question);
        }
    });

    chatbotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = chatbotInput.value.trim();
        if (!msg) return;
        
        sendChatMessage(msg);
        chatbotInput.value = "";
    });

    async function sendChatMessage(message) {
        // Render User Message
        appendMessageBubble("user", message);
        
        // Remove suggestions box if present
        const suggestionsWrap = chatbotBody.querySelector(".chat-suggestions");
        if (suggestionsWrap) {
            suggestionsWrap.remove();
        }
        
        // Scroll body
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        
        // Render Loading Indicator
        const loadingEl = document.createElement("div");
        loadingEl.className = "chat-message assistant chat-loading";
        loadingEl.innerHTML = `<span class="pulsing" style="color:var(--text-muted)">Agent typing...</span>`;
        chatbotBody.appendChild(loadingEl);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    history: state.chatHistory
                })
            });
            const data = await res.json();
            
            // Remove loading
            loadingEl.remove();
            
            // Render Assistant Message
            appendMessageBubble("assistant", data.reply);
            
            // Update chat history state
            state.chatHistory.push({ role: "user", content: message });
            state.chatHistory.push({ role: "model", content: data.reply });
            if (state.chatHistory.length > 20) {
                state.chatHistory.shift();
                state.chatHistory.shift();
            }
            
        } catch (e) {
            loadingEl.remove();
            appendMessageBubble("assistant", "Guidance link offline. Unable to reach forensics assistant.");
        }
        
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function appendMessageBubble(sender, text) {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${sender}`;
        
        // Replace newlines with <br> and format bold markdown
        let formatted = text
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>");
            
        bubble.innerHTML = `<p>${formatted}</p>`;
        chatbotBody.appendChild(bubble);
    }

    // ==========================================
    // 11. EXTRA INTERACTION POLISH
    // ==========================================

    // Click outside modal overlays to close
    window.addEventListener("click", (e) => {
        if (e.target === authModal) {
            authModal.classList.remove("active");
        }
        if (e.target === newsPreviewModal) {
            newsPreviewModal.classList.remove("active");
        }
    });

    // Classy 3D Card Hover Tilt Effect (Insta Reels Style)
    function applyCardTilt() {
        const cards = document.querySelectorAll(".card, .latest-news-short-card, .feed-item, .vault-bookmark-card");
        
        cards.forEach(card => {
            card.onmousemove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                // Tilt multiplier (max 4 degrees)
                const angleX = -(y - yc) / yc * 4;
                const angleY = (x - xc) / xc * 4;
                
                card.style.transform = `perspective(800px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.015, 1.015, 1.015)`;
                card.style.transition = "transform 0.05s ease";
            };
            
            card.onmouseleave = () => {
                card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
            };
        });
    }

    // Run Startup Initializers
    initConfig();
});
