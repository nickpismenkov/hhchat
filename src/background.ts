import {Logger} from "./helpers/Logger";
import {ExtensionMessageAction, ShowPopupMessage} from "./helpers/ExtensionMessage";
import Settings from "./Settings";
import * as $ from "jquery";

export default class BackgroundController {

    constructor () {
        this.init();
    }

    init() {
        Logger.log("App started");
		chrome.webNavigation.onCommitted.addListener(function(details) {
			if (!details.frameId) {
				chrome.tabs.executeScript(details.tabId, {
					file: "js/content.js"
				});
			}
		}, {
			url: [{
				// Runs on example.com, example.net, but also example.foo.com
				urlContains: '.'
			}]
		});
		chrome.pageAction.onClicked.addListener((tab) => {
			new ShowPopupMessage().sendToTab(tab.id);
		});
        chrome.runtime.onInstalled.addListener(() => {
			chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
				chrome.declarativeContent.onPageChanged.addRules([{
					conditions: [
						new chrome.declarativeContent.PageStateMatcher({
							pageUrl: { urlContains: '.' }
						})
					],
					actions: [
						new chrome.declarativeContent.ShowPageAction()
					]
				}]);
			});
		});
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			switch (message.action) {
				case ExtensionMessageAction.GetTabId:
					sendResponse(sender.tab.id);
					break;
				case ExtensionMessageAction.GoogleOAuth:
					this.oAuth("google").then((result) => {
						sendResponse(result);
					});
					break;
				case ExtensionMessageAction.VkOAuth:
					this.oAuth("vk").then((result) => {
						sendResponse(result);
					});
					break;
				case ExtensionMessageAction.FacebookOAuth:
					this.oAuth("facebook").then((result) => {
						sendResponse(result);
					});
					break;
			}
			return true;
		});
    }

	oAuth(provider: string) {
    	return new Promise((resolve) => {
    		try {
				$.ajax({
					url: `${Settings.BASE_URI}/oauth/get-url`,
					type: 'GET',
					dataType: 'json',
					data: {
						provider: provider,
						extRedirectURL: chrome.identity.getRedirectURL()
					},
					success: async (data) => {
						console.log(data.auth_url);
						chrome.identity.launchWebAuthFlow({
							url: data.auth_url,
							interactive: true
						}, async (redirect_url: string) => {
							console.log(redirect_url);
							if (!redirect_url) {
								// user denied
								resolve({
									error: "Доступ не предоставлен"
								});
								return;
							}
							if (provider === "vk") {
								$.ajax({
									url : `${Settings.BASE_URI}/oauth/${provider}`,
									type : 'GET',
									dataType:'json',
									data : {
										code: redirect_url.split("?code=")[1],
										redirect_uri: chrome.identity.getRedirectURL()
									},
									success: async (response) => {
										resolve(response);
									},
									error: (request,error) => {
										resolve({
											error: error
										});
									}
								});
							} else {
								let data = this.parseHash(redirect_url);
								$.ajax({
									url : `${Settings.BASE_URI}/oauth/${provider}`,
									type : 'GET',
									dataType:'json',
									data : {
										access_token: data.access_token
									},
									success: async (response) => {
										resolve(response);
									},
									error: (request,error) => {
										resolve({
											error: error
										});
									}
								});
							}
						});
					},
					error: (request,error) => {
						resolve({
							error: error
						});
					}
				});
			} catch (e) {
				resolve({
					error: "Ошибка, попробуйте позже"
				});
			}
		});
	}

	async signedRequest(url: string, accessToken: string):Promise<any> {
    	return new Promise((resolve) => {
			$.ajax({
				url : url,
				type : 'GET',
				dataType:'json',
				cache: false,
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				success : async (data) => {
					resolve(data);
				},
				error : (request,error) => {
					resolve({
						error: error
					});
				}
			});
		});
	}

	parseHash(url: string) {
		var hash = url.split("#")[1].split('&'),
			parsed:any = {};

		for(var i =0,el;i<hash.length; i++ ){
			el=hash[i].split('=');
			parsed[el[0]] = el[1];
		}
		return parsed;
	};

    hashStr(str: string) {
		var hash = 0;
		if (str.length == 0) {
			return hash;
		}
		for (var i = 0; i < str.length; i++) {
			var char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}
}

(<any>window).controller = new BackgroundController() as any;

// author: stationfuk@gmail.com