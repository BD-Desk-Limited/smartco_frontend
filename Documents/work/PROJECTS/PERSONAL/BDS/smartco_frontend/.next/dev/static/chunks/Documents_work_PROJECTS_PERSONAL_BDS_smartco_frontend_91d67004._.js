(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/companyDataContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompanyDataProvider",
    ()=>CompanyDataProvider,
    "useCompanyData",
    ()=>useCompanyData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
// Create a context for company data
const CompanyDataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const getInitialCompanyData = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const storedCompanyData = localStorage.getItem('companyData');
        const fetchedData = storedCompanyData ? JSON.parse(storedCompanyData) : null;
        return {
            ...fetchedData,
            isLoaded: true
        };
    } catch (error) {
        console.error('Failed to read companyData from localStorage', error);
        return {
            isLoaded: true
        };
    }
};
const CompanyDataProvider = ({ children })=>{
    _s();
    const [companyData, SetCompanyDataState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialCompanyData);
    const setCompanyData = (data)=>{
        // Update the company data in state and localStorage
        SetCompanyDataState({
            ...data,
            isLoaded: true
        });
        localStorage.setItem('companyData', JSON.stringify(data));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompanyDataContext.Provider, {
        value: {
            companyData,
            setCompanyData
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/companyDataContext.jsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CompanyDataProvider, "O4h7w0y8QCh3hSCpAUsyUlKMq8Y=");
_c = CompanyDataProvider;
const useCompanyData = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CompanyDataContext);
};
_s1(useCompanyData, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "CompanyDataProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/services/authServices.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authorizeDeviceService",
    ()=>authorizeDeviceService,
    "getUserService",
    ()=>getUserService,
    "loginService",
    ()=>loginService,
    "requestPasswordResetService",
    ()=>requestPasswordResetService,
    "resendOTPService",
    ()=>resendOTPService,
    "resetPasswordService",
    ()=>resetPasswordService,
    "salesPointLoginService",
    ()=>salesPointLoginService,
    "signupService",
    ()=>signupService,
    "verifyOTPService",
    ()=>verifyOTPService,
    "verifyPasswordResetLinkService",
    ()=>verifyPasswordResetLinkService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// safely access sessionStorage in client-side code
// This function checks if the code is running in a browser environment
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:4000/api");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const getToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return sessionStorage.getItem('token');
    }
    //TURBOPACK unreachable
    ;
};
const loginService = async (form)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            console.log('Error:', errorMessage);
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        return {
            error: 'Internal server error, please try again or contact support'
        };
    }
};
const resendOTPService = async (body)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error resending OTP, please try again'
        };
    }
};
const verifyOTPService = async (body)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error verifying OTP, please try again'
        };
    }
};
const authorizeDeviceService = async (body)=>{
    const token = getToken();
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/add-trusted-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error authorizing device, please try again'
        };
    }
};
const requestPasswordResetService = async (emailOrPhone)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailOrPhone
            })
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error requesting password reset, please try again'
        };
    }
};
const verifyPasswordResetLinkService = async (token)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/verify-password-reset-link/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error verifying password reset link, please try again'
        };
    }
};
const resetPasswordService = async (body)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/reset-password/${body.token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error resetting password, please try again'
        };
    }
};
const signupService = async (body)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/companies/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error signing up, please try again'
        };
    }
};
const getUserService = async (token)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error getting user details, please try again'
        };
    }
};
const salesPointLoginService = async (body)=>{
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/auth/sales-point-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData
            };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            return {
                error: errorMessage
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'error logging in, please try again'
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/authContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/jwt-decode/build/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$services$2f$authServices$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/services/authServices.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Create a context for authentication
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AuthProvider = ({ children })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            let isCurrent = true;
            const syncAuthState = {
                "AuthProvider.useEffect.syncAuthState": async ()=>{
                    const token = sessionStorage.getItem('token');
                    if (token !== null) {
                        try {
                            const decodedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jwtDecode"])(token);
                            const currentTime = Date.now() / 1000;
                            if (decodedToken.exp < currentTime) {
                                sessionStorage.removeItem('token');
                                if (!isCurrent) return;
                                setIsAuthenticated(false);
                                setUser(null);
                                setIsLoading(false);
                                router.push('/pages/splash/splash3');
                                return;
                            }
                            const isSalesPointRoute = pathname?.startsWith('/pages/account/sales-point') || pathname?.startsWith('/pages/auth/login/sales-point');
                            const isOfflineMode = !navigator.onLine || localStorage.getItem('userMode') === 'offline';
                            if (!isCurrent) return;
                            setIsAuthenticated(true);
                            if (isOfflineMode && isSalesPointRoute) {
                                localStorage.setItem('userMode', 'offline');
                                setUser(decodedToken);
                                setIsLoading(false);
                                return;
                            }
                            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$services$2f$authServices$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserService"])(token);
                            if (!isCurrent) return;
                            if (userData?.data) {
                                setUser(userData.data);
                                setIsLoading(false);
                                return;
                            }
                            const hasRecoverableFetchError = !navigator.onLine || userData?.error === 'error getting user details, please try again';
                            if (isSalesPointRoute && hasRecoverableFetchError) {
                                localStorage.setItem('userMode', 'offline');
                                setUser(decodedToken);
                                setIsLoading(false);
                                return;
                            }
                            sessionStorage.removeItem('token');
                            setIsAuthenticated(false);
                            setUser(null);
                            setIsLoading(false);
                            router.push('/pages/splash/splash3');
                            return;
                        } catch (error) {
                            if (!isCurrent) return;
                            console.error('Auth token decode/rehydration failed:', error);
                            sessionStorage.removeItem('token');
                            setIsAuthenticated(false);
                            setUser(null);
                            setIsLoading(false);
                            router.push('/pages/splash/splash3');
                            return;
                        }
                    }
                    if (!isCurrent) return;
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsLoading(false);
                    if (pathname && !pathname.startsWith('/pages/auth') && !pathname.startsWith('/pages/splash')) {
                        router.push('/pages/splash/splash3');
                    }
                }
            }["AuthProvider.useEffect.syncAuthState"];
            syncAuthState();
            return ({
                "AuthProvider.useEffect": ()=>{
                    isCurrent = false;
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        router,
        pathname
    ]);
    const logOut = ()=>{
        sessionStorage.removeItem('token');
        localStorage.removeItem('userMode');
        setIsAuthenticated(false);
        setUser(null);
        router.push('/pages/splash/splash3');
    };
    const logOutSalesPoint = ()=>{
        const workBranchKey = `workBranch_${user?._id}`;
        sessionStorage.removeItem('token');
        localStorage.removeItem('userMode');
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem(workBranchKey);
        router.push('/pages/auth/login/sales-point');
    };
    if (!isAuthenticated && pathname && !pathname.startsWith('/pages/auth') && !pathname.startsWith('/pages/splash')) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/authContext.jsx",
            lineNumber: 145,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isAuthenticated,
            user,
            setUser,
            logOut,
            logOutSalesPoint,
            isLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/authContext.jsx",
        lineNumber: 149,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "t6MM9gft33JdG5AfI3+UBpxCS7Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/internetStatusContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InternetStatusProvider",
    ()=>InternetStatusProvider,
    "useInternetStatus",
    ()=>useInternetStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
// Create a online-offline tracker context
const InternetStatusContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const InternetStatusProvider = ({ children })=>{
    _s();
    const [internetStatus, setInternetStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('online');
    const [userMode, setUserMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "InternetStatusProvider.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedUserMode = localStorage.getItem('userMode');
                if (savedUserMode === 'online' || savedUserMode === 'offline') {
                    return savedUserMode;
                }
            }
            return 'online';
        }
    }["InternetStatusProvider.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InternetStatusProvider.useEffect": ()=>{
            // check if window is defined (to avoid issues during server-side rendering)
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // Function to update online status
            const updateOnlineStatus = {
                "InternetStatusProvider.useEffect.updateOnlineStatus": ()=>{
                    setInternetStatus(navigator.onLine ? 'online' : 'offline');
                }
            }["InternetStatusProvider.useEffect.updateOnlineStatus"];
            // Set initial status
            updateOnlineStatus();
            // Add event listeners for online/offline events
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            // No effect to sync userMode from localStorage
            // Cleanup event listeners on unmount
            return ({
                "InternetStatusProvider.useEffect": ()=>{
                    window.removeEventListener('online', updateOnlineStatus);
                    window.removeEventListener('offline', updateOnlineStatus);
                }
            })["InternetStatusProvider.useEffect"];
        }
    }["InternetStatusProvider.useEffect"], []);
    // Function to toggle user mode
    const toggleUserMode = (mode)=>{
        if (mode === 'online' || mode === 'offline') {
            setUserMode(mode);
            localStorage.setItem('userMode', mode);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InternetStatusContext.Provider, {
        value: {
            internetStatus,
            userMode,
            toggleUserMode
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/internetStatusContext.jsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(InternetStatusProvider, "AVzH2fHw7QkxMk22gryuIXLC2PA=");
_c = InternetStatusProvider;
const useInternetStatus = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(InternetStatusContext);
};
_s1(useInternetStatus, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "InternetStatusProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/services/setupServices.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkCompanySetupCompletionService",
    ()=>checkCompanySetupCompletionService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
const getToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return sessionStorage.getItem('token');
    }
    //TURBOPACK unreachable
    ;
};
const checkCompanySetupCompletionService = async ()=>{
    const token = getToken();
    try {
        const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:4000/api")}/setups/company`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            const responseData = await response.json();
            return {
                data: responseData.data
            };
        } else {
            const errorData = await response.json();
            return {
                error: errorData.message
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            error: 'Error checking setup completion'
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/components/account/Spinner.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const Spinner = ({ size = 16, spaceHeight = '50vh', color = 'blue-500' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-center items-center",
        style: {
            height: spaceHeight
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-${size} h-${size} border-4 border-${color} border-t-transparent border-solid rounded-full animate-spin`
        }, void 0, false, {
            fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/components/account/Spinner.jsx",
            lineNumber: 9,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/components/account/Spinner.jsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Spinner;
const __TURBOPACK__default__export__ = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/setupContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SetupProvider",
    ()=>SetupProvider,
    "useSetup",
    ()=>useSetup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$authContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/authContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$internetStatusContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/internetStatusContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$services$2f$setupServices$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/services/setupServices.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$components$2f$account$2f$Spinner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/components/account/Spinner.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const SetupContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
//pages that can be accessed whether setup is complete or not by anyone
const publicPaths = [
    '/pages/auth/',
    '/pages/splash/'
];
// Roles that are exempt from setup restrictions
const rolesExemptFromSetup = [
    'supplier',
    'support'
];
const useSetup = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SetupContext);
    if (!context) {
        throw new Error('useSetup must be used within a SetupProvider');
    }
    return context;
};
_s(useSetup, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const SetupProvider = ({ children })=>{
    _s1();
    const [setupComplete, setSetupComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [setupProgress, setSetupProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSetUpAdmin, setIsSetUpAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [adminStatusChecked, setAdminStatusChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$authContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { internetStatus, userMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$internetStatusContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInternetStatus"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const shouldBypassSetupChecks = pathname?.startsWith('/pages/account/sales-point') || pathname?.startsWith('/pages/auth/login/sales-point') || user?.role === 'seller' || internetStatus === 'offline' || userMode === 'offline';
    //Helper Function to get allowed pages from sessionStorage
    const getAllowedPages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SetupProvider.useCallback[getAllowedPages]": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const stored = sessionStorage.getItem('setupAllowedPages');
                    return stored ? JSON.parse(stored) : [];
                } catch (error) {
                    console.error('Error parsing setupAllowedPages from sessionStorage:', error);
                    return [];
                }
            }
            return [];
        }
    }["SetupProvider.useCallback[getAllowedPages]"], []);
    // Helper function to check if a page is allowed
    const isPageAllowed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SetupProvider.useCallback[isPageAllowed]": (pathname)=>{
            const allowed = getAllowedPages(); //retrieve latest allowed pages from sessionStorage
            const isPublic = publicPaths.some({
                "SetupProvider.useCallback[isPageAllowed].isPublic": (path)=>pathname.startsWith(path)
            }["SetupProvider.useCallback[isPageAllowed].isPublic"]); //check if page is a public path
            // Always allow public pages
            if (isPublic) {
                return true;
            }
            // If no allowed pages are set, deny access
            if (!allowed || allowed.length === 0) {
                return false;
            }
            // Always allow exact matches
            if (allowed.includes(pathname)) {
                return true;
            }
            return false;
        }
    }["SetupProvider.useCallback[isPageAllowed]"], [
        getAllowedPages
    ]);
    // Helper function to check setup completion and progress
    const checkSetupStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SetupProvider.useCallback[checkSetupStatus]": async ()=>{
            if (shouldBypassSetupChecks) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$services$2f$setupServices$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkCompanySetupCompletionService"])();
                if (response.data) {
                    setSetupComplete(Boolean(response.data.isMandatorySetUpComplete));
                    setSetupProgress(response.data);
                }
            } catch (error) {
                console.error('Error checking setup status:', error);
                setError(error);
            } finally{
                setLoading(false);
            }
        }
    }["SetupProvider.useCallback[checkSetupStatus]"], [
        setSetupComplete,
        setSetupProgress,
        setLoading,
        setError,
        shouldBypassSetupChecks
    ]);
    // Check if user is admin and has required access to perform setup. If so, check setup status.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SetupProvider.useEffect": ()=>{
            const checkAdminStatus = {
                "SetupProvider.useEffect.checkAdminStatus": ()=>{
                    if (shouldBypassSetupChecks) {
                        setLoading(false);
                        return;
                    }
                    if (!user || adminStatusChecked) return;
                    const hasAdminAccess = user && (user.superAdmin || user?.accessLevel?.map({
                        "SetupProvider.useEffect.checkAdminStatus": (access)=>access.accessName
                    }["SetupProvider.useEffect.checkAdminStatus"]).includes('All_Access') && user?.accessLevel?.find({
                        "SetupProvider.useEffect.checkAdminStatus": (access)=>access.accessName === 'All_Access'
                    }["SetupProvider.useEffect.checkAdminStatus"]).accessGranted);
                    setIsSetUpAdmin(hasAdminAccess);
                    checkSetupStatus();
                    setLoading(false);
                    setAdminStatusChecked(true);
                }
            }["SetupProvider.useEffect.checkAdminStatus"];
            checkAdminStatus();
        }
    }["SetupProvider.useEffect"], [
        user,
        adminStatusChecked,
        checkSetupStatus,
        shouldBypassSetupChecks
    ]);
    // Redirect logic based on setup status and allowed pages to track which pages can be accessed during setup by authorized admins
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SetupProvider.useEffect": ()=>{
            if (shouldBypassSetupChecks) {
                return;
            }
            // Don't redirect if still loading or user not loaded
            if (loading || !user || !adminStatusChecked || setupComplete === null) {
                return;
            }
            // If setup is complete, allow all pages
            if (setupComplete) {
                return;
            }
            // if not an admin or any other role not restricted by setup, and company is not set up, redirect to admin home where user can be informed of lack of access
            if (!isSetUpAdmin && !setupComplete && !rolesExemptFromSetup.includes(user.role)) {
                router.push('/pages/account/admin');
                return;
            }
            // If mandatory setup is not complete, check if current page is allowed
            if (adminStatusChecked && !setupComplete && !isPageAllowed(pathname)) {
                console.log('Non-admin or exempt role trying to access during setup.', 'pathAllowed:', isPageAllowed(pathname), 'AdminStatusChecked:', adminStatusChecked, 'isSetupComplete:', setupComplete, 'isSetUpAdmin:', isSetUpAdmin, 'userRole:', user.role);
                router.push('/pages/account/admin');
                return;
            }
        }
    }["SetupProvider.useEffect"], [
        setupComplete,
        isSetUpAdmin,
        loading,
        pathname,
        user,
        router,
        adminStatusChecked,
        isPageAllowed,
        shouldBypassSetupChecks
    ]);
    // Helper function to determine if we should display any content yet on the page
    const dontDisplayYet = ()=>{
        if (shouldBypassSetupChecks) {
            return false;
        }
        if (!setupComplete && !isPageAllowed(pathname) && pathname !== '/pages/account/admin') return true; // Admin on disallowed page during setup
        return false;
    };
    const value = {
        setupComplete,
        setupProgress,
        loading,
        isSetUpAdmin,
        error,
        checkSetupStatus
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SetupContext.Provider, {
        value: value,
        children: dontDisplayYet() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$components$2f$account$2f$Spinner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/setupContext.jsx",
            lineNumber: 234,
            columnNumber: 27
        }, ("TURBOPACK compile-time value", void 0)) : children
    }, void 0, false, {
        fileName: "[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/src/contexts/setupContext.jsx",
        lineNumber: 233,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(SetupProvider, "nxHH8vSHXGnJvd3sC1ZuPqBgKc8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$authContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$src$2f$contexts$2f$internetStatusContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInternetStatus"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SetupProvider;
var _c;
__turbopack_context__.k.register(_c, "SetupProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$work$2f$PROJECTS$2f$PERSONAL$2f$BDS$2f$smartco_frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/Documents/work/PROJECTS/PERSONAL/BDS/smartco_frontend/node_modules/jwt-decode/build/esm/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InvalidTokenError",
    ()=>InvalidTokenError,
    "jwtDecode",
    ()=>jwtDecode
]);
class InvalidTokenError extends Error {
}
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p)=>{
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = "0" + code;
        }
        return "%" + code;
    }));
}
function base64UrlDecode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch(output.length % 4){
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw new Error("base64 string is not of the correct length");
    }
    try {
        return b64DecodeUnicode(output);
    } catch (err) {
        return atob(output);
    }
}
function jwtDecode(token, options) {
    if (typeof token !== "string") {
        throw new InvalidTokenError("Invalid token specified: must be a string");
    }
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") {
        throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
    }
    let decoded;
    try {
        decoded = base64UrlDecode(part);
    } catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
        return JSON.parse(decoded);
    } catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
}
}),
]);

//# sourceMappingURL=Documents_work_PROJECTS_PERSONAL_BDS_smartco_frontend_91d67004._.js.map