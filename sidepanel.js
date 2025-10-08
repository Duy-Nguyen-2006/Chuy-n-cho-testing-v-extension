// === KHAI BÁO BIẾN TOÀN CỤC ===
let isRunning = false;
let isPaused = false;
let stopRequested = false;
let promptList = [];
let currentIndex = 0;
let flowTabId = null;
let currentLang = 'vi';
let promptsSentThisSession = 0;
let downloadInterval = null;
let currentProjectId = null;
let promptsFinished = false;
let previouslyDownloadedIdentifiers = [];
// UI Elements
let promptsTextarea, uploadPromptButton, fileInput, mainActionButton, stopButton,
    progressBar, liveStatus, logDisplay, mainInterface, wrongPageInterface,
    navigateToFlowButton, startFromInput, languageSelector, repeatCountInput,
    minInitialWaitTimeInput, maxInitialWaitTimeInput,
    autoDownloadCheckbox, openDownloadsSettingsLink;

// UI Elements cho AI Prompt Generator
let geminiApiKeyInput, aiTopic, aiNumPrompts, aiVideoStyle, aiDialogueLanguage, aiSubtitles, generateScriptButton;


// === BẢN DỊCH NGÔN NGỮ ===
const translations = {
    vi: {
        download_button_text: "Tải xuống",
        download_option_text: "Kích thước gốc",
        status_prompts_sent_now_scanning: "Đã gửi xong prompt. Đang chạy ngầm để quét video...",
        log_prompts_sent_now_scanning: "Đã gửi tất cả prompt vào hàng đợi. Tool sẽ tiếp tục chạy ngầm để quét và tải video khi hoàn tất.",
        status_not_on_project_page: "Bạn chưa ở trong một dự án. Hãy tạo mới hoặc mở một dự án đã có sẵn để bắt đầu nhé!",
        initial_wait_time_label: "Thời gian chờ tạo video (giây):",
        to_label: "đến",
        log_wait_for_video: "Đã gửi prompt. Bắt đầu chờ tạo video trong {seconds} giây...",
        log_submit_success: "Đã gửi thành công prompt #{index}.",
        log_paused: "Tạm dừng tại prompt #{index}.",
        wrong_page_message: "Tool chỉ chạy trên trang Google Flow.",
        go_to_flow: "Chuyển đến Flow",
        prompt_list: "📝 Danh sách prompt",
        import_from_file: "Nhập từ file (.txt)",
        prompt_placeholder: "Mỗi prompt một dòng...",
        start_button: "▶️ Bắt đầu",
        start_button_title: "Bắt đầu",
        stop_button: "⏹️ Dừng",
        stop_button_title: "Dừng",
        status_ready: "Sẵn sàng",
        settings_title: "⚙️ Cài đặt",
        subheader_general_settings: "Cài đặt Chung",
        repeat_count_label: "Thực thi mỗi prompt:",
        unit_times: "lần",
        start_from_label: "Bắt đầu từ prompt:",
        unit_number: "số",
        language_label: "Ngôn ngữ (Language):",
        log_title: "📄 Log chi tiết",
        continue_button: "▶️ Tiếp tục",
        continue_button_title: "Tiếp tục",
        pause_button: "⏸️ Tạm dừng",
        pause_button_title: "Tạm dừng",
        status_paused: "Đã tạm dừng ở prompt {index}",
        log_resumed: "Tiếp tục chạy...",
        status_no_prompts: "Vui lòng nhập prompt",
        status_preparing: "Đang chuẩn bị môi trường...",
        log_session_ready: "SẴN SÀNG BẮT ĐẦU PHIÊN MỚI.",
        status_invalid_start_pos: "Vị trí bắt đầu ({start}) lớn hơn tổng số prompt ({total}).",
        status_start_error: "Lỗi khi bắt đầu: {error}",
        reset_error: "Dừng do lỗi khởi tạo.",
        log_stop_request: "Yêu cầu dừng...",
        log_prompt_completed: "Hoàn tất gửi prompt {index}.",
        reset_user_stop: "Đã dừng bởi người dùng!",
        reset_completed: "✅ ĐÃ HOÀN THÀNH!",
        log_critical_error: "Lỗi nghiêm trọng: Mất ID của tab làm việc.",
        log_scripting_error: "Lỗi scripting: {error}",
        error_tab_closed: "LỖI: Tab làm việc đã bị đóng!",
        log_processing: "Đang xử lý prompt {index}/{total} (Lần {repeat}/{maxRepeat})...",
        log_waiting_for_queue: "Hàng đợi đang đầy ({count}/5), đang chờ...",
        log_submit_fail: "Lỗi: Không tìm thấy ô nhập prompt hoặc nút gửi.",
        donate_title: "Nhóm zalo hỗ trợ",
        buy_me_a_coffee: "Nhóm zalo hỗ trợ",
        subheader_download_settings: "Cài đặt Tải Video",
        auto_download_label: "Tự động tải video:",
        downloads_settings_link: "Cấu hình thư mục",
        downloads_settings_hint: "Mẹo: Tắt 'Hỏi vị trí lưu...' trong cài đặt trình duyệt để tải không bị gián đoạn.",
        log_downloader_started: "Đã kích hoạt bộ quét tải video tự động.",
        log_downloader_stopped: "Đã dừng bộ quét tải video.",
        log_scan_started: "Bắt đầu quét và tải video mới...",
        log_scan_found_and_downloaded: "[QUÉT] Đã phát hiện và tải về {count} video mới.",
        log_no_new_videos: "[QUÉT] Không tìm thấy video mới.",
        log_loaded_history: "Đã tải lịch sử {count} video đã tải cho project này.",
        log_saved_history: "Đã lưu lịch sử tải. Tổng cộng: {count} video.",
        log_no_project_id: "Không thể xác định ID của project. Lịch sử tải sẽ chỉ có hiệu lực trong phiên này.",
        // AI Generator translations
        ai_generating: "🧠 AI đang sáng tạo, vui lòng chờ...",
        ai_error_no_api_key: "Vui lòng nhập Gemini API Key.",
        ai_error_no_scene: "Vui lòng nhập Mô tả cảnh chính.",
        ai_error_api_call: "Lỗi gọi API Gemini: {error}",
        ai_success: "🎉 Đã tạo xong! Kiểm tra danh sách prompt.",
        ai_prompt_generation_error: "AI không thể tạo prompt. Phản hồi trống.",
    },
    en: {
        download_button_text: "Download",
        download_option_text: "Original size",
        status_prompts_sent_now_scanning: "All prompts sent. Scanning for completed videos in the background...",
        log_prompts_sent_now_scanning: "All prompts have been queued. The tool will continue running in the background to scan and download completed videos.",
        status_not_on_project_page: "You are not in a project. Please create a new one or open an existing project to start.",
        initial_wait_time_label: "Video generation wait time (s):",
        to_label: "to",
        log_wait_for_video: "Prompt sent. Starting video generation wait for {seconds} seconds...",
        log_submit_success: "Successfully submitted prompt #{index}.",
        log_paused: "Paused at prompt #{index}.",
        wrong_page_message: "This tool only runs on the Google Flow page.",
        go_to_flow: "Go to Flow",
        prompt_list: "📝 Prompt List",
        import_from_file: "Import from file (.txt)",
        prompt_placeholder: "One prompt per line...",
        start_button: "▶️ Start",
        start_button_title: "Start",
        stop_button: "⏹️ Stop",
        stop_button_title: "Stop",
        status_ready: "Ready",
        settings_title: "⚙️ Settings",
        subheader_general_settings: "General Settings",
        repeat_count_label: "Runs per prompt:",
        unit_times: "times",
        start_from_label: "Start from prompt:",
        unit_number: "number",
        language_label: "Language:",
        log_title: "📄 Detailed Log",
        continue_button: "▶️ Resume",
        continue_button_title: "Resume",
        pause_button: "⏸️ Pause",
        pause_button_title: "Pause",
        status_paused: "Paused at prompt {index}",
        log_resumed: "Resuming...",
        status_no_prompts: "Please enter some prompts",
        status_preparing: "Preparing environment...",
        log_session_ready: "READY TO START NEW SESSION.",
        status_invalid_start_pos: "Start position ({start}) is greater than the total number of prompts ({total}).",
        status_start_error: "Error starting: {error}",
        reset_error: "Stopped due to initialization error.",
        log_stop_request: "Stop requested...",
        log_prompt_completed: "Finished submitting prompt {index}.",
        reset_user_stop: "Stopped by user!",
        reset_completed: "✅ ALL DONE!",
        log_critical_error: "Critical Error: Lost the working tab ID.",
        log_scripting_error: "Scripting error: {error}",
        error_tab_closed: "ERROR: The working tab was closed!",
        log_processing: "Processing prompt {index}/{total} (Rep {repeat}/{maxRepeat})...",
        log_waiting_for_queue: "Queue is full ({count}/5), waiting...",
        log_submit_fail: "Error: Could not find prompt input or submit button.",
        donate_title: "Buy the author a coffee!",
        buy_me_a_coffee: "Buy Me a Coffee",
        subheader_download_settings: "Video Download Settings",
        auto_download_label: "Auto-download videos:",
        downloads_settings_link: "Configure folder",
        downloads_settings_hint: "Tip: Turn off 'Ask where to save...' in your browser settings for seamless downloads.",
        log_downloader_started: "Auto video download scanner has been activated.",
        log_downloader_stopped: "Auto video download scanner has been stopped.",
        log_scan_started: "Starting scan for new videos to download...",
        log_scan_found_and_downloaded: "[SCAN] Detected and downloaded {count} new videos.",
        log_no_new_videos: "No new videos found to download.",
        log_loaded_history: "Loaded history of {count} downloaded videos for this project.",
        log_saved_history: "Saved download history. Total: {count} videos.",
        log_no_project_id: "Could not determine Project ID. Download history will be for this session only.",
        // AI Generator translations
        ai_generating: "🧠 AI is creating, please wait...",
        ai_error_no_api_key: "Please enter your Gemini API Key.",
        ai_error_no_scene: "Please enter the Main Scene Description.",
        ai_error_api_call: "Error calling Gemini API: {error}",
        ai_success: "🎉 Generation complete! Check the prompt list.",
        ai_prompt_generation_error: "AI could not generate prompts. Empty response.",
    }
};

// === KHỞI TẠO & CÁC HÀM TIỆN ÍCH ===

document.addEventListener('DOMContentLoaded', async () => {
    initializeTool();
    updateInterfaceVisibility();
    chrome.tabs.onActivated.addListener(updateInterfaceVisibility);
    chrome.tabs.onUpdated.addListener(updateInterfaceVisibility);
});

function initializeTool() {
    // Original UI Elements
    mainInterface = document.getElementById('main-interface');
    wrongPageInterface = document.getElementById('wrong-page-interface');
    promptsTextarea = document.getElementById('prompts');
    uploadPromptButton = document.getElementById('uploadPromptButton');
    fileInput = document.getElementById('fileInput');
    mainActionButton = document.getElementById('mainActionButton');
    stopButton = document.getElementById('stopButton');
    progressBar = document.getElementById('progressBar');
    liveStatus = document.getElementById('liveStatus');
    logDisplay = document.getElementById('logDisplay');
    navigateToFlowButton = document.getElementById('navigateToFlowButton');
    startFromInput = document.getElementById('startFromInput');
    languageSelector = document.getElementById('languageSelector');
    repeatCountInput = document.getElementById('repeatCountInput');
    minInitialWaitTimeInput = document.getElementById('minInitialWaitTime');
    maxInitialWaitTimeInput = document.getElementById('maxInitialWaitTime');
    autoDownloadCheckbox = document.getElementById('autoDownloadCheckbox');
    openDownloadsSettingsLink = document.getElementById('openDownloadsSettingsLink');

    // UI Elements cho AI Prompt Generator
    geminiApiKeyInput = document.getElementById('geminiApiKey');
    aiTopic = document.getElementById('aiTopic');
    aiNumPrompts = document.getElementById('aiNumPrompts');
    aiVideoStyle = document.getElementById('aiVideoStyle');
    aiDialogueLanguage = document.getElementById('aiDialogueLanguage');
    aiSubtitles = document.getElementById('aiSubtitles');
    generateScriptButton = document.getElementById('generateScriptButton');


    loadSettings();
    attachEventListeners();
}

function loadSettings() {
    chrome.storage.local.get([
        'prompts', 'startFrom', 'language', 'repeatCount', 'minInitialWait', 
        'maxInitialWait', 'autoDownloadFlow', 'geminiApiKey'
    ], (result) => {
        if (result.prompts) promptsTextarea.value = result.prompts;
        if (result.startFrom) startFromInput.value = result.startFrom;
        if (result.repeatCount) repeatCountInput.value = Math.max(1, parseInt(result.repeatCount, 10));
        minInitialWaitTimeInput.value = result.minInitialWait || 90;
        maxInitialWaitTimeInput.value = result.maxInitialWait || 120;
        autoDownloadCheckbox.checked = result.autoDownloadFlow === true;
        if (result.geminiApiKey) geminiApiKeyInput.value = result.geminiApiKey;
        
        const lang = result.language || 'vi';
        languageSelector.value = lang;
        setLanguage(lang);
    });
    updateMainButton();
}

function attachEventListeners() {
    // Event listeners của tool auto VEO
    promptsTextarea.addEventListener('input', () => { chrome.storage.local.set({ prompts: promptsTextarea.value }); });
    startFromInput.addEventListener('input', () => { chrome.storage.local.set({ startFrom: startFromInput.value }); });
    repeatCountInput.addEventListener('input', () => {
        if (parseInt(repeatCountInput.value, 10) < 1) repeatCountInput.value = 1;
        chrome.storage.local.set({ repeatCount: repeatCountInput.value });
    });
    languageSelector.addEventListener('change', (event) => {
        const newLang = event.target.value;
        chrome.storage.local.set({ language: newLang });
        setLanguage(newLang);
    });
    minInitialWaitTimeInput.addEventListener('input', () => {
        let minVal = parseInt(minInitialWaitTimeInput.value, 10);
        let maxVal = parseInt(maxInitialWaitTimeInput.value, 10);
        if (minVal < 1) minVal = 1;
        if (minVal > maxVal) maxInitialWaitTimeInput.value = minVal;
        minInitialWaitTimeInput.value = minVal;
        chrome.storage.local.set({ minInitialWait: minInitialWaitTimeInput.value, maxInitialWait: maxInitialWaitTimeInput.value });
    });
    maxInitialWaitTimeInput.addEventListener('input', () => {
        let minVal = parseInt(minInitialWaitTimeInput.value, 10);
        let maxVal = parseInt(maxInitialWaitTimeInput.value, 10);
        if (maxVal < 1) maxVal = 1;
        if (maxVal < minVal) minInitialWaitTimeInput.value = maxVal;
        maxInitialWaitTimeInput.value = maxVal;
        chrome.storage.local.set({ minInitialWait: minInitialWaitTimeInput.value, maxInitialWait: maxInitialWaitTimeInput.value });
    });
    uploadPromptButton.addEventListener('click', (event) => {
        event.stopPropagation();
        fileInput.click();
    });
    mainActionButton.addEventListener('click', handleMainActionClick);
    stopButton.addEventListener('click', handleStopClick);
    navigateToFlowButton.addEventListener('click', handleNavigateToFlow);
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { promptsTextarea.value = e.target.result; };
            reader.readAsText(file);
        }
    });
    autoDownloadCheckbox.addEventListener('change', () => {
        chrome.storage.local.set({ autoDownloadFlow: autoDownloadCheckbox.checked });
    });
    openDownloadsSettingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({ type: 'openDownloadsSettings' });
    });

    geminiApiKeyInput.addEventListener('input', () => {
        chrome.storage.local.set({ geminiApiKey: geminiApiKeyInput.value });
    });
    generateScriptButton.addEventListener('click', handleGenerateScript);
}

// === LICENSE CHECK LOGIC (FROM WHISK AUTO) ===

const LICENSE_API = "https://script.google.com/macros/s/AKfycbzDu60PnKeGZtdWuD_lvn1eo2WUfE0Q3ZvQ3ntKAzrLVILq0qIxarl-auHNajZo4qKa/exec";
const LICENSE_API_KEY = "WF-PRIVATE-2025-01";
const AI_UNLOCK_FLAG = "ai_unlocked"; // Use a unique flag for Auto Veo3

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const bytes = new Uint8Array(buf);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getWebGLInfo() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return { v:'', r:'' };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    return { v:String(vendor), r:String(renderer) };
  } catch { return { v:'', r:'' }; }
}

function getCanvasStamp() {
  try {
    const c = document.createElement('canvas'); c.width = 280; c.height = 60;
    const x = c.getContext('2d');
    x.textBaseline = 'top'; x.font = '16px Arial';
    x.fillStyle = '#f60'; x.fillRect(125,1,62,20);
    x.fillStyle = '#069'; x.fillText('autoveo3-fp', 2, 15);
    x.strokeStyle = '#ff5500'; x.arc(80,10,20,0,Math.PI,true); x.stroke();
    return c.toDataURL();
  } catch { return ''; }
}

async function computeHardwareFingerprint() {
  const r = await chrome.storage.local.get('hardwareFingerprint_veo3');
  if (r.hardwareFingerprint_veo3) return r.hardwareFingerprint_veo3;

  const gl = getWebGLInfo();
  const parts = [
    navigator.userAgent || '',
    navigator.language || '',
    navigator.platform || '',
    String(navigator.hardwareConcurrency || 0),
    String(navigator.deviceMemory || 0),
    [screen?.width, screen?.height, screen?.colorDepth].join('x'),
    String(devicePixelRatio || 1),
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    gl.v, gl.r,
    getCanvasStamp()
  ];
  const fp = await sha256Hex(parts.join('|'));
  await chrome.storage.local.set({ hardwareFingerprint_veo3: fp });
  return fp;
}

async function checkLicenseByHWFP(hwfp, phoneOptional) {
  const res = await fetch(LICENSE_API, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ hwfp, phone: phoneOptional || '', api_key: LICENSE_API_KEY })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

function setAILocked(locked, note = '') {
    const generatorForm = document.getElementById('aiPromptGeneratorForm');
    const payNotice = document.getElementById('aiPayNotice');

    if (generatorForm) {
        generatorForm.style.opacity = locked ? '0.2' : '1';
        generatorForm.style.pointerEvents = locked ? 'none' : 'auto';
    }
    
    if (payNotice) {
        payNotice.style.display = locked ? 'block' : 'none';
        if (locked) {
            const reasonElement = payNotice.querySelector('div > strong');
            if (reasonElement) {
                 reasonElement.parentElement.innerHTML = `<strong>${note}</strong> Nội dung thanh toán vui lòng ghi <b>số điện thoại</b> của bạn.`;
            }
        }
    }
}


async function fillHWFPInNotice(){
  try{
    const fp = await computeHardwareFingerprint();
    const el = document.getElementById('aiHWFP');
    if (el) el.value = fp;
  }catch {}
}

async function handleGenerateScript() {
    // ĐÃ BỎ: kiểm tra license / setAILocked

    const apiKey = geminiApiKeyInput.value.trim();
    if (!apiKey) {
        updateLiveStatus(i18n('ai_error_no_api_key'), 'error');
        return;
    }

    const topic = aiTopic.value.trim();
    if (!topic) {
        updateLiveStatus('Vui lòng nhập Chủ đề hoặc Tóm tắt câu chuyện.', 'error');
        return;
    }

    generateScriptButton.disabled = true;
    generateScriptButton.querySelector('span').textContent = '🧠 AI đang viết...';
    updateLiveStatus('AI đang sáng tạo, vui lòng chờ...', 'info');
    logMessage('Bắt đầu tạo prompt bằng AI...', 'system');

    try {
        const numPrompts = parseInt(aiNumPrompts.value, 10);
        const videoStyle = aiVideoStyle.value;
        const dialogueLang = aiDialogueLanguage.value;
        const subtitles = aiSubtitles.value;

        const masterPrompt = buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLang, subtitles);
        logMessage('Đã tạo master prompt, đang gửi đến AI...', 'info');

        const jsonResponseString = await callGeminiApi(apiKey, masterPrompt);
        logMessage(`Phản hồi thô từ AI: ${jsonResponseString}`, 'info');

        let responseData;
        try {
            const cleanedJsonString = jsonResponseString.replace(/```json/g, '').replace(/```/g, '').trim();
            responseData = JSON.parse(cleanedJsonString);
            logMessage('Phân tích JSON thành công.', 'success');
        } catch (parseError) {
            logMessage(`Lỗi phân tích JSON: ${parseError.message}`, 'error');
            throw new Error("AI đã trả về định dạng JSON không hợp lệ. Vui lòng kiểm tra Log chi tiết.");
        }

        if (!responseData || !responseData.script) {
            throw new Error("Phản hồi JSON từ AI không chứa key 'script' hợp lệ.");
        }
        if (!Array.isArray(responseData.script) || responseData.script.length === 0) {
            logMessage("AI đã trả về một danh sách script rỗng.", 'warn');
            throw new Error("AI không tạo được prompt nào cho chủ đề này.");
        }

        if (responseData.characterAnalysis && responseData.characterAnalysis.length > 0) {
            logMessage(`AI đã phân tích xong ${responseData.characterAnalysis.length} nhân vật.`, 'success');
        }

        const generatedPrompts = responseData.script.join('\n');
        promptsTextarea.value = generatedPrompts;
        chrome.storage.local.set({ prompts: promptsTextarea.value });

        updateLiveStatus(`🎉 AI đã tạo ${responseData.script.length} prompt mới!`, 'success');
        logMessage(`AI đã tạo thành công ${responseData.script.length} prompts.`, 'success');

    } catch (error) {
        console.error("Lỗi khi tạo prompt bằng AI:", error);
        updateLiveStatus(`Lỗi: ${error.message}`, 'error');
        logMessage(`Lỗi AI: ${error.message}`, 'error');
    } finally {
        generateScriptButton.disabled = false;
        generateScriptButton.querySelector('span').textContent = '✨ Generate Script';
    }
}

function buildMasterPrompt(topic, numPrompts, videoStyle, dialogueLanguage, subtitles) {
    return `
    You are an expert scriptwriter and prompt engineer for an advanced text-to-video AI model called "Veo3". Your task is to generate a detailed video script based on a user's story idea. Each prompt you create will generate an 8-second video clip. Consistency across clips is paramount.

    User's Request:
    - Topic/Story: ${topic}
    - Number of Prompts: ${numPrompts}
    - Video Style: ${videoStyle}
    - Dialogue Language: ${dialogueLanguage}
    - Subtitles: ${subtitles}

    Your task is to generate a JSON object with two main keys: "characterAnalysis" and "script".

    1.  **characterAnalysis**:
        - First, analyze the main characters from the story.
        - For each character, provide a very detailed description covering their name, physical appearance (face, hair, clothing, body type, specific markings), personality traits, and a specific description of their voice (e.g., "youthful, earnest mid-high pitch, gentle breathy cadence").
        - This detailed description is the source of truth and MUST be used to ensure consistency in the script prompts.
        - The value should be an array of objects, where each object represents a character with keys "name", "description", and "voice".

    2.  **script**:
        - Generate a sequence of ${numPrompts} prompts.
        - Each prompt must be a single, long string following a strict, pipe-delimited format.
        - The scenes should logically follow each other to tell the story, with each scene representing an 8-second clip.

    **Crucial Prompt Formatting Rules (Apply to EVERY prompt in the 'script' array):**

    Each prompt string MUST be structured exactly like this, using the pipe '|' as a separator:

    \`Scene [Number] – [Brief Scene Title] | [Character 1 Description] | [Character 2 Description (if present)] | [Style Description] | [Character Voices] | [Camera Shot] | [Setting Details] | [Mood] | [Audio Cues] | [Dialog] | [Subtitles]\`

    **Detailed breakdown of each part:**

    * **Language:** All parts of the prompt string MUST be in ENGLISH, except for the [Dialog] part, which must be in the specified **${dialogueLanguage}**. This is a critical instruction.
    * **Scene & Title:** Start with "Scene [Number] –" and a short, descriptive title for the scene. The numbering should start from 1.
    * **Character Description:**
        - For every character in the scene, copy their full description from the 'characterAnalysis' section.
        - Start with \`CharacterName (Alias):\` followed by the detailed description.
        - If a character's state changes (e.g., they put on shoes), modify only that part of the description.
    * **Style Description:**
        - Start with \`[Video Style] style:\` and describe it based on the user's requested style: "${videoStyle}".
    * **Character Voices:**
        - Start with \`Character voices:\`
        - List the voice descriptions from 'characterAnalysis'. Example: \`Character voices: Turtle = youthful, earnest mid-high pitch...; Hare = confident light tenor...\`
    * **Camera Shot:** Describe the camera work (e.g., \`Wide establishing pan\`, \`Close-up\`, \`Tracking shot\`).
    * **Setting Details:** Describe the immediate environment.
    * **Mood:** Describe the emotional tone of the scene (e.g., \`Crisp morning optimism\`, \`Chaotic, risky\`).
    * **Audio Cues:** Include sound effects and background music.
    * **Dialog:**
        - Start with \`Dialog:\`
        - Format as \`CharacterName (speaking tone): "Line of dialog"\`
        - The dialog MUST be in **${dialogueLanguage}**. If the language is "None", this part should be empty.
    * **Subtitles:** Specify if subtitles are on or off. It MUST be set to \`${subtitles}\`. (e.g., \`Subtitles ${subtitles}\`).

    Here is a perfect example of a single prompt string:
    \`Scene 01 – Dawn at a woodland track; banner “Forest Fun Run” flutters | Turtle (Little Turtle): small green turtle; glossy emerald carapace with hexagonal plates and light mossy edge wear; warm yellow plastron with subtle scuffs; big hazel-brown eyes with large round pupils and soft lower lashes; tiny beak-like mouth; two faint cheek freckles per side; short sturdy limbs with three rounded toes; small tail; no clothing (bare feet) | Hare (Rival): tall slender gray hare; smooth silver-gray fur, white muzzle and belly; very long upright ears with pink inner; amber narrow eyes; small black nose; long athletic legs; no clothing | Cartoon style: stylized 3D cartoon, toon-shaded, soft PBR, clean outline rim, saturated pastel palette, gentle squash-and-stretch, 24 fps | Character voices: Turtle = youthful, earnest mid-high pitch, gentle breathy cadence; Hare = confident light tenor, quick cadence | Wide establishing pan | Forest clearing race track with paper flags | Crisp morning optimism | Audio cues: flag flaps, soft birdsong, distant chatter; BGM light marimba | Dialog: Turtle: "I’ll do my best—slow and steady!" | Subtitles OFF\`

    The final output MUST be a valid JSON object. Do not include any text or markdown formatting outside of the JSON object.
  `;
}

async function callGeminiApi(apiKey, promptText) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: promptText
            }]
        }],
        generationConfig: {
            "responseMimeType": "application/json",
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
        throw new Error("Cấu trúc phản hồi từ API không hợp lệ.");
    }
    return data.candidates[0].content.parts[0].text;
}


// === LOGIC CHÍNH CỦA TOOL (AUTO VEO) ===

function handleMainActionClick() {
    if (isRunning) {
        isPaused = !isPaused;
        if (isPaused) {
            updateLiveStatus(i18n('status_paused', { index: currentIndex + 1 }), 'warn');
            logMessage(i18n('log_paused', { index: currentIndex + 1 }), 'warn');
        } else {
            logMessage(i18n('log_resumed'), 'info');
        }
        updateMainButton();
    } else {
        startAutomation();
    }
}

async function startAutomation() {
    const prompts = promptsTextarea.value.trim().split('\n').filter(p => p.trim() !== '');
    if (prompts.length === 0) {
        updateLiveStatus(i18n('status_no_prompts'), 'error');
        return;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes('/tools/flow/project/')) {
        updateLiveStatus(i18n('status_not_on_project_page'), 'error');
        logMessage(i18n('status_not_on_project_page'), 'error');
        mainActionButton.disabled = false;
        return;
    }
    mainActionButton.disabled = true;
    updateLiveStatus(i18n('status_preparing'), 'info');
    try {
        flowTabId = tab.id;
        chrome.tabs.onRemoved.addListener(handleTabRemoval);
        logDisplay.innerHTML = '';
        logMessage(i18n('log_session_ready'), 'system');
        promptList = prompts;
        const startFrom = parseInt(startFromInput.value, 10) || 1;
        currentIndex = Math.max(0, startFrom - 1);
        promptsFinished = false;

        currentProjectId = getProjectIdFromUrl(tab.url); 
        
        if (autoDownloadCheckbox.checked) {
            if (downloadInterval) clearInterval(downloadInterval);
            const totalVideosToDownload = (promptList.length - currentIndex) * parseInt(repeatCountInput.value, 10);
            downloadInterval = setInterval(() => scanAndDownload(totalVideosToDownload), 15000);
            scanAndDownload(totalVideosToDownload);
            logMessage(i18n('log_downloader_started'), 'system');
        }
        
        if (currentIndex >= promptList.length) {
            updateLiveStatus(i18n('status_invalid_start_pos', { start: startFrom, total: promptList.length }), 'error');
            resetState();
            return;
        }
        isRunning = true;
        stopRequested = false;
        isPaused = false;
        updateButtonStates(true);
        mainLoop();
    } catch (error) {
        console.error("startAutomation: CRITICAL ERROR in try block:", error);
        logMessage("LỖI KHỞI TẠO: " + error.message, 'error');
        resetState(i18n('reset_error')); 
        
        if (mainActionButton) {
            mainActionButton.disabled = false;
            const buttonSpan = mainActionButton.querySelector('span');
            if (buttonSpan) {
                 buttonSpan.textContent = i18n('start_button');
            }
        }
    }
}

async function mainLoop() {
    const repeatCount = Math.max(1, parseInt(repeatCountInput.value, 10) || 1);
    const totalTasks = (promptList.length - currentIndex) * repeatCount;
    let completedTasksInLoop = 0;
    logMessage(`Bắt đầu mainLoop. Total tasks: ${totalTasks}, Start index: ${currentIndex}`, 'system');
    while (currentIndex < promptList.length && isRunning && !stopRequested) {
        const prompt = promptList[currentIndex];
        logMessage(`Xử lý prompt ${currentIndex + 1}/${promptList.length}: "${prompt.slice(0, 50)}..."`, 'info');
        for (let repeatIndex = 1; repeatIndex <= repeatCount; repeatIndex++) {
            await pauseIfNeeded();
            if (stopRequested) {
                logMessage(`Dừng tại prompt ${currentIndex + 1}, repeat ${repeatIndex}`, 'warn');
                break;
            }
            updateProgressBar(completedTasksInLoop, totalTasks);
            logMessage(i18n('log_processing', { index: currentIndex + 1, total: promptList.length, repeat: repeatIndex, maxRepeat: repeatCount }), 'info');
            const success = await injectScript(processPromptOnPage, [prompt]);
            if (!success) {
                logMessage(i18n('log_submit_fail'), 'error');
                logMessage(`Lỗi gửi prompt ${currentIndex + 1}. Kiểm tra tab Flow.`, 'error');
                stopRequested = true;
                break;
            }
            logMessage(i18n('log_submit_success', { index: currentIndex + 1 }), 'success');
            completedTasksInLoop++;
            const waitTime = getRandomWait(minInitialWaitTimeInput.value, maxInitialWaitTimeInput.value);
            logMessage(i18n('log_wait_for_video', { seconds: Math.round(waitTime / 1000) }), 'info');
            await interruptibleSleep(waitTime);

            if (autoDownloadCheckbox.checked) {
                logMessage(`Bắt đầu tải video cho prompt ${currentIndex + 1}`, 'info');
                let downloadSuccess = false;
                while (!downloadSuccess && !stopRequested) {
                    const downloadResult = await injectScript(performDownloadActions_Flow_V4, [previouslyDownloadedIdentifiers, i18n('download_button_text'), i18n('download_option_text')]);
                    if (downloadResult) {
                        previouslyDownloadedIdentifiers = previouslyDownloadedIdentifiers.concat(downloadResult.downloaded);
                        downloadResult.logs.forEach(log => logMessage(log, 'info'));
                        logMessage(`Tải xong: ${downloadResult.downloaded.length} video`, 'success');
                        
                        const data = await chrome.storage.local.get('flowDownloads');
                        const allDownloads = data.flowDownloads || {};
                        let projectDownloads = allDownloads[currentProjectId] || [];
                        const currentList = new Set(projectDownloads);
                        downloadResult.downloaded.forEach(id => currentList.add(id));
                        allDownloads[currentProjectId] = Array.from(currentList);
                        await chrome.storage.local.set({ flowDownloads: allDownloads });
                        logMessage(i18n('log_saved_history', { count: allDownloads[currentProjectId].length }), 'info');
                        
                        const processingVideos = await injectScript(() => {
                            return Array.from(document.querySelectorAll('div.sc-43558102-2 video, div.sc-ad287003-0 video, div.sc-dfb46854-0 video'))
                                .some(video => {
                                    const container = video.closest('div.sc-43558102-2, div.sc-ad287003-0, div.sc-dfb46854-0');
                                    return container && container.querySelector('div:contains("Processing"), div[class*="loading"]');
                                });
                        });
                        if (processingVideos) {
                            logMessage(`Vẫn còn video đang xử lý. Chờ thêm 60 giây...`, 'info');
                            await interruptibleSleep(60000);
                        } else {
                            downloadSuccess = true;
                        }
                    } else {
                        logMessage(`Lỗi tải video cho prompt ${currentIndex + 1}. Kiểm tra log chi tiết.`, 'error');
                        downloadSuccess = true; // Bỏ qua nếu lỗi để tiếp tục
                    }
                }
            }
            if (stopRequested) break;
        }
        if (stopRequested) break;
        logMessage(i18n('log_prompt_completed', { index: currentIndex + 1 }), 'system');
        currentIndex++;
    }

    if (!stopRequested && isRunning) {
        updateProgressBar(totalTasks, totalTasks);
        promptsFinished = true;
        logMessage(i18n('log_prompts_sent_now_scanning'), 'system');
        updateLiveStatus(i18n('status_prompts_sent_now_scanning'), 'info');
        if (!autoDownloadCheckbox.checked) {
            resetState(i18n('reset_completed'));
        } else {
            logMessage(`Chạy quét cuối cùng để tải tất cả video`, 'info');
            let allVideosDownloaded = false;
            while (!allVideosDownloaded && !stopRequested) {
                const downloadResult = await injectScript(performDownloadActions_Flow_V4, [previouslyDownloadedIdentifiers, i18n('download_button_text'), i18n('download_option_text')]);
                if (downloadResult) {
                    previouslyDownloadedIdentifiers = previouslyDownloadedIdentifiers.concat(downloadResult.downloaded);
                    downloadResult.logs.forEach(log => logMessage(log, 'info'));
                    const data = await chrome.storage.local.get('flowDownloads');
                    const allDownloads = data.flowDownloads || {};
                    let projectDownloads = allDownloads[currentProjectId] || [];
                    const currentList = new Set(projectDownloads);
                    downloadResult.downloaded.forEach(id => currentList.add(id));
                    allDownloads[currentProjectId] = Array.from(currentList);
                    await chrome.storage.local.set({ flowDownloads: allDownloads });
                    logMessage(i18n('log_saved_history', { count: allDownloads[currentProjectId].length }), 'info');
                    
                    const processingVideos = await injectScript(() => {
                        return Array.from(document.querySelectorAll('div.sc-43558102-2 video, div.sc-ad287003-0 video, div.sc-dfb46854-0 video'))
                            .some(video => {
                                const container = video.closest('div.sc-43558102-2, div.sc-ad287003-0, div.sc-dfb46854-0');
                                return container && container.querySelector('div:contains("Processing"), div[class*="loading"]');
                            });
                    });
                    if (processingVideos) {
                        logMessage(`Vẫn còn video đang xử lý. Chờ thêm 60 giây...`, 'info');
                        await interruptibleSleep(60000);
                    } else {
                        allVideosDownloaded = true;
                    }
                } else {
                    allVideosDownloaded = true; // Dừng nếu không có kết quả
                }
            }
            resetState(i18n('reset_completed'));
        }
    } else if (stopRequested) {
        resetState(i18n('reset_user_stop'));
    }
}

async function scanAndDownload(totalVideosToDownload) {
    if (!isRunning || stopRequested) {
        if (downloadInterval) clearInterval(downloadInterval);
        return;
    };

    logMessage("--- Bắt đầu phiên quét video ---", 'system');

    if (!currentProjectId) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if(tab) currentProjectId = getProjectIdFromUrl(tab.url);
        if(!currentProjectId) {
             if(isRunning) logMessage(i18n('log_no_project_id'), 'warn');
             logMessage("--- Kết thúc phiên quét (lỗi ID dự án) ---", 'system');
             return;
        };
    }
    
    const data = await chrome.storage.local.get('flowDownloads');
    const allDownloads = data.flowDownloads || {};
    let projectDownloads = allDownloads[currentProjectId] || [];

    logMessage(`Lịch sử hiện có ${projectDownloads.length} video đã tải.`, 'info');

    const downloadButtonText = i18n('download_button_text');
    const downloadOptionText = i18n('download_option_text');

    const result = await injectScript(performDownloadActions_Flow_V4, [projectDownloads, downloadButtonText, downloadOptionText]);
	if (result) {
		result.logs.forEach(log => logMessage(log, 'info')); 
	}

    if (result && result.logs && result.logs.length > 0) {
        logMessage("Log chi tiết từ bên trong trang Flow:", 'system');
        result.logs.forEach(log => logMessage(`   > ${log}`, 'info'));
    } else {
        logMessage("Script quét không tạo ra log chi tiết nào.", 'warn');
    }

    const newlyDownloadedIdentifiers = (result && result.downloaded) ? result.downloaded : [];

    if (newlyDownloadedIdentifiers.length > 0) {
        logMessage(i18n('log_scan_found_and_downloaded', { count: newlyDownloadedIdentifiers.length }), 'success');
        
        const currentList = new Set(projectDownloads);
        newlyDownloadedIdentifiers.forEach(id => currentList.add(id));
        allDownloads[currentProjectId] = Array.from(currentList);
        await chrome.storage.local.set({ flowDownloads: allDownloads });
        logMessage(i18n('log_saved_history', {count: allDownloads[currentProjectId].length }), 'info');
        projectDownloads = allDownloads[currentProjectId];
    } else {
        logMessage(i18n('log_no_new_videos'), 'info');
    }

    if (promptsFinished && projectDownloads.length >= totalVideosToDownload) {
        resetState(i18n('reset_completed'));
    }
    
    logMessage("--- Kết thúc phiên quét ---", 'system');
}

// === CÁC HÀM HỖ TRỢ & GIAO DIỆN ===
function getProjectIdFromUrl(url) {
    if (!url) return null;
    const match = url.match(/project\/([a-f0-9-]+)/);
    return match ? match[1] : null;
}

function getRandomWait(minSeconds, maxSeconds) {
    const min = parseFloat(minSeconds) * 1000;
    const max = parseFloat(maxSeconds) * 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleStopClick() {
    if (!isRunning) return;
    stopRequested = true;
    isPaused = false;
    resetState(i18n('reset_user_stop'));
}

function getFlowUrl() {
    const baseUrl = "https://labs.google/fx/";
    const path = "tools/flow";
    return currentLang === 'vi' ? `${baseUrl}vi/${path}` : `${baseUrl}en/${path}`;
}

async function handleNavigateToFlow() {
    const flowUrl = getFlowUrl();
    try {
        const tabs = await chrome.tabs.query({ url: `${flowUrl}*` });
        if (tabs.length > 0) {
            await chrome.tabs.update(tabs[0].id, { active: true });
        } else {
            await chrome.tabs.create({ url: flowUrl });
        }
    } catch (e) { console.error("Error navigating:", e); }
}

async function updateInterfaceVisibility() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.url.startsWith("https://labs.google/fx/")) {
            wrongPageInterface.style.display = 'none';
        } else {
            wrongPageInterface.style.display = 'flex';
        }
    } catch (e) {
        wrongPageInterface.style.display = 'flex';
    }
}

function i18n(key, replacements = {}) {
    let translation = (translations[currentLang]?.[key]) || (translations['en']?.[key] || `[${key}]`);
    for (const placeholder in replacements) {
        translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    }
    return translation;
}

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[lang]?.[key]) el.innerHTML = i18n(key);
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (translations[lang]?.[key]) el.placeholder = i18n(key);
    });
    document.querySelectorAll('[data-lang-title]').forEach(el => {
        const key = el.getAttribute('data-lang-title');
        if (translations[lang] && translations[lang][key]) {
            el.title = i18n(key);
        }
    });
    updateMainButton();
}

function resetState(message) {
    if (downloadInterval) {
        clearInterval(downloadInterval);
        downloadInterval = null;
        if(isRunning) logMessage(i18n('log_downloader_stopped'), 'system');
    }
    chrome.tabs.onRemoved.removeListener(handleTabRemoval);
    isRunning = false; isPaused = false; stopRequested = false; flowTabId = null; currentProjectId = null; promptsFinished = false;
    updateButtonStates(false);
    if (message) {
        const type = message.includes('✅') ? 'success' : 'warn';
        updateLiveStatus(message, type);
        logMessage(message, 'system');
    } else {
        updateLiveStatus(i18n('status_ready'));
        progressBar.value = 0;
    }
}

function updateButtonStates(isProcessing) {
    mainActionButton.disabled = isProcessing;
    stopButton.disabled = !isProcessing;
    promptsTextarea.disabled = isProcessing;
    uploadPromptButton.disabled = isProcessing;
    startFromInput.disabled = isProcessing;
    languageSelector.disabled = isProcessing;
    repeatCountInput.disabled = isProcessing;
    minInitialWaitTimeInput.disabled = isProcessing;
    maxInitialWaitTimeInput.disabled = isProcessing;
    autoDownloadCheckbox.disabled = isProcessing;
    updateMainButton();
}

function updateMainButton() {
    const buttonSpan = mainActionButton.querySelector('span');
    if (!buttonSpan) return; // Guard clause
    if (!isRunning) {
        buttonSpan.textContent = i18n('start_button');
        mainActionButton.title = i18n('start_button_title');
    } else if (isPaused) {
        buttonSpan.textContent = i18n('continue_button');
        mainActionButton.title = i18n('continue_button_title');
    } else {
        buttonSpan.textContent = i18n('pause_button');
        mainActionButton.title = i18n('pause_button_title');
    }
}

async function pauseIfNeeded() {
    while (isPaused && !stopRequested) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function interruptibleSleep(ms) {
    const steps = Math.ceil(ms / 250);
    for (let i = 0; i < steps; i++) {
        if (stopRequested) return;
        await new Promise(resolve => setTimeout(resolve, 250));
    }
}

function handleTabRemoval(tabId) {
    if (tabId === flowTabId && isRunning) {
        stopRequested = true; isPaused = false;
        resetState(i18n("error_tab_closed"));
    }
}

function updateProgressBar(completed, total) {
    progressBar.value = total > 0 ? (completed / total) * 100 : 0;
}

function updateLiveStatus(message, type = 'info') {
    if (!liveStatus) return;
    liveStatus.textContent = message;
    const colorMap = { 'info': 'var(--text-color)', 'success': 'var(--success-color)', 'warn': 'var(--warning-color)', 'error': 'var(--error-color)' };
    liveStatus.style.color = colorMap[type];
    liveStatus.style.fontWeight = (type === 'error' || type === 'warn') ? 'bold' : 'normal';
}

function logMessage(message, type = 'info') {
    if (!logDisplay) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString('vi-VN');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'log-timestamp';
    timestampSpan.textContent = timestamp;
    const messageSpan = document.createElement('span');
    messageSpan.className = 'log-message';
    let icon = '';
    switch (type) {
        case 'system':  icon = '🔵'; break;
        case 'success': icon = '🟢'; break;
        case 'warn':    icon = '🟡'; break;
        case 'error':   icon = '🔴'; break;
        case 'info':
        default:        icon = '⚪️'; break;
    }
    messageSpan.textContent = `${icon} ${message}`;
    logEntry.appendChild(timestampSpan);
    logEntry.appendChild(messageSpan);
    logDisplay.appendChild(logEntry);
    logDisplay.scrollTop = logDisplay.scrollHeight;
}


// === SCRIPT ĐƯỢC TIÊM VÀO TRANG WEB ===
async function injectScript(func, args = []) {
    if (!flowTabId) {
        logMessage(i18n('log_critical_error'), 'error');
        return undefined;
    }
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: flowTabId },
            function: func,
            args: args,
            world: 'MAIN'
        });
        return results?.[0]?.result;
    } catch (e) {
        logMessage(i18n('log_scripting_error', { error: e.message }), 'error');
        if (e.message.includes("No tab with id")) {
            logMessage(i18n('error_tab_closed'), 'error');
            stopRequested = true;
            resetState(i18n('error_tab_closed'));
        }
        return undefined;
    }
}

async function processPromptOnPage(prompt) {
    const promptInput = document.getElementById("PINHOLE_TEXT_AREA_ELEMENT_ID");
    if (!promptInput) {
        console.error("Auto VEO: Không tìm thấy ô nhập prompt.");
        return false;
    }
    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeTextareaValueSetter.call(promptInput, prompt);
    promptInput.dispatchEvent(new Event('input', { bubbles: true }));

    for (let i = 0; i < 30; i++) {
        let generateButton = null;
        const allButtons = document.querySelectorAll('button');

        for (const btn of allButtons) {
            const icon = btn.querySelector('i.google-symbols, span'); 
            if (icon && icon.textContent.trim() === 'arrow_forward') {
                generateButton = btn;
                break;
            }
        }

        if (generateButton && !generateButton.disabled) {
            generateButton.click();
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.error("Auto VEO: Không tìm thấy hoặc không thể nhấn nút Gửi sau nhiều lần thử.");
    return false;
}

function performDownloadActions_Flow_V4(previouslyDownloadedIdentifiers, downloadButtonText, downloadOptionText) {
    const newlyDownloadedIdentifiers = [];
    const debugLogs = [];
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async function waitForMenu(timeout = 25000) { 
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const menu = document.querySelector('div[role="menu"], div[class*="menu"], div[data-radix-popper-content-wrapper], div[role="dialog"]');
            if (menu) {
                debugLogs.push(`Menu xuất hiện: ${menu.outerHTML.slice(0, 150)}...`);
                return menu;
            }
            await sleep(300);
        }
        debugLogs.push("LỖI: Menu không xuất hiện sau 25 giây.");
        return null;
    }

    function click720pOption(menu) {
        const menuItems = Array.from(menu.querySelectorAll('div[role="menuitem"], div[class*="item"], button'));
        debugLogs.push(`Quét ${menuItems.length} mục menu...`);
        for (const item of menuItems) {
            const itemText = item.textContent?.trim().toLowerCase() || '';
            if (itemText.includes('720p') || itemText.includes(downloadOptionText.toLowerCase())) {
                debugLogs.push(`Tìm thấy tùy chọn '${itemText}', clicking...`);
                item.click();
                return true;
            }
        }
        debugLogs.push("LỖI: Không tìm thấy tùy chọn '720p' hoặc tương đương.");
        return false;
    }

    async function processDownloads() {
        try {
            const allMedia = Array.from(document.querySelectorAll('div.sc-43558102-2 video, div.sc-ad287003-0 video, div.sc-dfb46854-0 video'));
            debugLogs.push(`Tìm thấy ${allMedia.length} video elements.`);
            if (allMedia.length === 0) {
                debugLogs.push("LỖI: Không tìm thấy video trên trang.");
                return { downloaded: newlyDownloadedIdentifiers, logs: debugLogs };
            }

            for (const video of allMedia) {
                const identifier = video.src || video.poster || video.outerHTML.slice(0, 50);
                if (previouslyDownloadedIdentifiers.includes(identifier)) {
                    debugLogs.push(`Bỏ qua: ${identifier.slice(-40)} (đã tải).`);
                    continue;
                }
                const container = video.closest('div.sc-43558102-2, div.sc-ad287003-0, div.sc-dfb46854-0');
                if (!container) {
                    debugLogs.push(`LỖI: Không tìm thấy container cho ${identifier.slice(-40)}.`);
                    continue;
                }
                debugLogs.push(`Xử lý video: ${identifier.slice(-40)}. Container: ${container.outerHTML.slice(0, 150)}...`);

                let downloaded = false;
                const downloadButton = Array.from(container.querySelectorAll('button')).find(btn => {
                    const icon = btn.querySelector('i.google-symbols, i.material-icons');
                    const iconText = icon?.textContent?.trim().toLowerCase() || '';
                    const btnText = btn.textContent?.trim().toLowerCase() || '';
                    return (iconText === 'download' || btnText.includes('tải xuống'));
                });

                if (downloadButton) {
                    debugLogs.push(`Tìm thấy nút 'Tải xuống': ${downloadButton.outerHTML.slice(0, 150)}...`);
                    if (!downloadButton.disabled) {
                        downloadButton.click();
                        await sleep(2000); 
                        const qualityMenu = await waitForMenu();
                        if (qualityMenu && click720pOption(qualityMenu)) {
                            downloaded = true;
                            debugLogs.push(`Tải thành công: ${identifier.slice(-40)}.`);
                        }
                    } else {
                        debugLogs.push(`LỖI: Nút 'Tải xuống' bị vô hiệu hóa cho ${identifier.slice(-40)}.`);
                    }
                } else {
                    debugLogs.push(`LỖI: Không tìm thấy nút 'Tải xuống' trong ${container.outerHTML.slice(0, 150)}...`);
                }

                if (downloaded) {
                    newlyDownloadedIdentifiers.push(identifier);
                    await sleep(5000);
                }
            }
            debugLogs.push(`Hoàn tất quét: Tải được ${newlyDownloadedIdentifiers.length} video.`);
        } catch (error) {
            debugLogs.push(`LỖI NGHIÊM TRỌNG: ${error.message}. Stack: ${error.stack.slice(0, 200)}`);
        }
        return { downloaded: newlyDownloadedIdentifiers, logs: debugLogs };
    }

    return processDownloads();
}