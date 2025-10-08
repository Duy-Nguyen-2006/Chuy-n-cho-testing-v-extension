const FLOW_URL = "https://labs.google/fx/";

async function updateActionState(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.url && tab.url.startsWith(FLOW_URL)) {
      await chrome.action.enable(tabId);
    } else {
      await chrome.action.disable(tabId);
    }
  } catch (error) {
    // Bỏ qua lỗi với các tab không thể truy cập
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateActionState(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    await updateActionState(tabId);
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// MỚI: Thêm listener để mở trang cài đặt của trình duyệt
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'openDownloadsSettings') {
    chrome.tabs.create({ url: 'chrome://settings/downloads' });
  }
});
