export enum ExtensionMessageAction {
    Notification,
    ShowPopup,
    HidePopup,
    GetTabId,
    GoogleOAuth,
    VkOAuth,
    FacebookOAuth,
}

export default class ExtensionMessage {
    action: ExtensionMessageAction;
    data: object;
    sendToBackend(callback: (any) = () => {}) {
        chrome.runtime.sendMessage(this, callback);
    }
    sendToTab(tabId: number, callback: (any) = () => {}) {
        chrome.tabs.sendMessage(tabId, this, callback);
    }
}

export class NotificationMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.Notification;
    data: {
        notification: Notification;
    };
    constructor(notification: Notification) {
        super();
        this.data = {
            notification: notification
        }
    }
}

export class ShowPopupMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.ShowPopup;
}

export class HidePopupMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.HidePopup;
}

export class GetTabIdMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.GetTabId;
}

export class GoogleOAuthMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.GoogleOAuth;
}

export class VkOAuthMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.VkOAuth;
}

export class FacebookOAuthMessage extends ExtensionMessage {
    action: ExtensionMessageAction = ExtensionMessageAction.FacebookOAuth;
}