"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var apkpurelink = 'https://apkpure.com/search?q=';
/**
 * The function `proxy` takes a URL as input and returns a Google Translate proxy URL for translating
 * from French to English.
 * @param url - The `url` parameter is a string representing the URL of the webpage that you want to
 * translate from French to English using Google Translate.
 * @returns The function `proxy` returns a URL string that redirects to Google Translate with the
 * specified French URL encoded as a parameter for translation to English.
 */
var proxy = function (url) {
    return url ? "https://translate.google.com/translate?sl=fr&tl=en&hl=en&u=".concat(encodeURIComponent(url), "&client=webapp") : '';
};
/**
 * The function `api` takes an ID, path, and query parameters to construct a URL for an API request.
 * @param ID - The `ID` parameter is the base URL for the API endpoint.
 * @param [path=/] - The `path` parameter in the `api` function is a string that represents the path or
 * endpoint of the API that you want to access. It is optional and defaults to `'/'` if not provided.
 * @param query - The `query` parameter in the `api` function is an object that contains key-value
 * pairs representing the query parameters to be included in the API request URL. These query
 * parameters are used to provide additional information to the API endpoint being called.
 * @returns The `api` function is returning the result of calling the `proxy` function with the
 * constructed URL formed by concatenating the `baseURL`, `path`, and `queryString` (if it exists).
 */
function api(ID, path, query) {
    if (path === void 0) { path = '/'; }
    if (query === void 0) { query = {}; }
    var baseURL = ID;
    var queryString = new URLSearchParams(Object.entries(__assign({}, query))).toString();
    return proxy(baseURL + path + (queryString ? '?' + queryString : ''));
}
;
/**
 * The function `apkpure` in TypeScript fetches and processes data from a website to provide
 * information about Android applications.
 * @param query - The `apkpure` function you provided seems to be a web scraping function that searches
 * for an app on APKPure based on a query and retrieves information about the app such as download
 * link, developer, file size, etc.
 * @returns The function `apkpure` returns an object with the following properties:
 * - `appName`: The name of the app
 * - `image`: The image URL of the app
 * - `Downloadlink`: The download link of the app
 * - `downloadCount`: The download count of the app
 * - `packageName`: The package name of the app
 * - `appFormat`: The format of the
 */
function apkpure(query) {
    return __awaiter(this, void 0, void 0, function () {
        var formattedQuery, response, $_1, results_1, firstLink, infoResult, finalUrlResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    formattedQuery = query.replace(/\s+/g, '+');
                    return [4 /*yield*/, axios_1.default.get(api(apkpurelink + formattedQuery))];
                case 1:
                    response = _a.sent();
                    $_1 = cheerio_1.default.load(response.data);
                    results_1 = [];
                    if ($_1('div.first.first-apk.sa-all-div.sa-apps-div.mb').length > 0) {
                        $_1('div.first.first-apk.sa-all-div.sa-apps-div.mb').each(function (index, element) {
                            var appName = $_1(element).find('.p1').text().trim(), appImage = $_1(element).find('img.first-info-img').attr('src');
                            var appLink = $_1(element).find('a.first-info').attr('href');
                            appLink = api(appLink === null || appLink === void 0 ? void 0 : appLink.replace('https://apkpure-com.translate.goog', 'https://apkpure.com').split('?')[0].replace(/_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp/g, ''));
                            results_1.push({
                                name: appName,
                                link: appLink,
                                image: appImage
                            });
                        });
                    }
                    else {
                        $_1('dl[data-dt-recid]').each(function (index, element) {
                            var appName = $_1(element).find('.p1').text().trim();
                            var appLink = $_1(element).find('a.dd').attr('href');
                            var appImage = $_1(element).find('img').attr('src');
                            appLink = api(appLink === null || appLink === void 0 ? void 0 : appLink.replace('https://apkpure-com.translate.goog', 'https://apkpure.com').split('?')[0].replace(/_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp/g, ''));
                            results_1.push({
                                name: appName,
                                link: appLink,
                                image: appImage
                            });
                        });
                    }
                    if (!(results_1.length > 0)) return [3 /*break*/, 4];
                    firstLink = results_1[0].link;
                    return [4 /*yield*/, info(firstLink)];
                case 2:
                    infoResult = _a.sent();
                    results_1[0].developer = infoResult.developer;
                    results_1[0].modifiedDownloadLink = infoResult.modifiedDownloadLink;
                    return [4 /*yield*/, getFinalUrl(infoResult.modifiedDownloadLink)];
                case 3:
                    finalUrlResult = _a.sent();
                    results_1[0].downloadLink = finalUrlResult.downloadLink;
                    results_1[0].fileSize = finalUrlResult.fileSize;
                    results_1[0].downloadCount = finalUrlResult.downloadCount;
                    results_1[0].packageName = finalUrlResult.packageName;
                    results_1[0].appFormat = finalUrlResult.appFormat;
                    return [2 /*return*/, {
                            appName: results_1[0].name,
                            image: results_1[0].image,
                            Downloadlink: results_1[0].downloadLink,
                            downloadCount: results_1[0].downloadCount,
                            packageName: results_1[0].packageName,
                            appFormat: results_1[0].appFormat
                        }];
                case 4: return [2 /*return*/, {}];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error fetching data:', error_1);
                    return [2 /*return*/, {}];
                case 7: return [2 /*return*/];
            }
        });
    });
}
;
/**
 * This TypeScript function fetches information from a given link, extracts developer and download link
 * details using Cheerio, and returns them after modifying the download link.
 * @param link - The `info` function you provided is an asynchronous function that fetches data from a
 * given link using Axios and Cheerio. It then extracts the developer name and a modified download link
 * from the fetched data before returning them in an object.
 * @returns The `info` function returns an object with two properties: `developer` and
 * `modifiedDownloadLink`. The `developer` property contains the developer name extracted from the HTML
 * using Cheerio, and the `modifiedDownloadLink` property contains a modified download link after some
 * processing.
 */
function info(link) {
    return __awaiter(this, void 0, void 0, function () {
        var res, $, developer, downloadLink, modifiedDownloadLink, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(link)];
                case 1:
                    res = _a.sent();
                    $ = cheerio_1.default.load(res.data);
                    developer = $('span.developer').find('a').text().trim();
                    downloadLink = $('.download-btn-box a.download_apk_news').attr('href');
                    modifiedDownloadLink = api(downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.replace('https://apkpure-com.translate.goog', 'https://apkpure.com').split('?')[0].replace(/_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp/g, ''));
                    return [2 /*return*/, {
                            developer: developer,
                            modifiedDownloadLink: modifiedDownloadLink
                        }];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching data:', error_2);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * This TypeScript function uses axios and cheerio to fetch and extract data from a given URL,
 * returning information about a downloadable app.
 * @param arg - The `getFinalUrl` function is an asynchronous function that takes a URL (`arg`) as a
 * parameter. It uses Axios to make a GET request to the provided URL and then uses Cheerio to parse
 * the HTML response.
 * @returns The function `getFinalUrl` is returning an object with the following properties:
 * - downloadLink
 * - fileSize
 * - downloadCount
 * - packageName
 * - appFormat
 */
function getFinalUrl(arg) {
    return __awaiter(this, void 0, void 0, function () {
        var linkResponse, $, downloadText, appFormat, downloadLink, fileSize, downloadCount, packageName, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(arg)];
                case 1:
                    linkResponse = _a.sent();
                    $ = cheerio_1.default.load(linkResponse.data);
                    downloadText = $('span.download-text.one-line').text().trim();
                    appFormat = downloadText.replace("Download ", "").toLocaleLowerCase();
                    downloadLink = $('a.download-start-btn').attr('href'), fileSize = $('span.download-file-size').text().trim(), downloadCount = $('span.download-count').text().trim(), packageName = $('a.value.double-lines').text().trim();
                    return [2 /*return*/, {
                            downloadLink: downloadLink,
                            fileSize: fileSize,
                            downloadCount: downloadCount,
                            packageName: packageName,
                            appFormat: appFormat
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching data:', error_3);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
module.exports = apkpure;
