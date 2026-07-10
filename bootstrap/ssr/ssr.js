import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { route as route$1 } from "ziggy-js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/lib/analytics.js
var PAGE_VIEW_KEY = "__elevasiLastGaPage";
function canTrack() {
	return typeof window !== "undefined" && typeof window.gtag === "function";
}
/**
* @param {string} measurementId
*/
function ensureGtag(measurementId) {
	if (!measurementId || typeof window === "undefined" || typeof document === "undefined") return;
	window.dataLayer = window.dataLayer || [];
	if (typeof window.gtag !== "function") window.gtag = function gtag() {
		window.dataLayer.push(arguments);
	};
	if (!document.getElementById("ga-gtag")) {
		const script = document.createElement("script");
		script.id = "ga-gtag";
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
		document.head.appendChild(script);
		window.gtag("js", /* @__PURE__ */ new Date());
		window.gtag("config", measurementId, {
			send_page_view: false,
			anonymize_ip: true
		});
	}
}
/**
* Track a page view for Inertia SPA navigations.
* @param {string} [url]
* @param {string} [title]
*/
function trackPageView(url, title) {
	if (!canTrack()) return;
	const pagePath = url || `${window.location.pathname}${window.location.search}`;
	if (window[PAGE_VIEW_KEY] === pagePath) return;
	window[PAGE_VIEW_KEY] = pagePath;
	window.gtag("event", "page_view", {
		page_path: pagePath,
		page_location: window.location.href,
		page_title: title || document.title
	});
}
/**
* @param {string} eventName
* @param {Record<string, unknown>} [params]
*/
function trackEvent(eventName, params = {}) {
	if (!canTrack() || !eventName) return;
	window.gtag("event", eventName, params);
}
//#endregion
//#region resources/js/Components/GoogleAnalytics.jsx
function GoogleAnalytics() {
	const { url, settings } = usePage().props;
	const measurementId = settings?.gaMeasurementId;
	useEffect(() => {
		if (!measurementId) return;
		ensureGtag(measurementId);
		trackPageView(url, document.title);
	}, [measurementId, url]);
	return null;
}
//#endregion
//#region resources/images/Logo-Elevasi-White.png
var Logo_Elevasi_White_default = "/build/assets/Logo-Elevasi-White-BKeJgjJT.png";
//#endregion
//#region resources/js/lib/gsap.js
var gsapInstance = null;
function prefersReducedMotion$1() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
async function loadGsap() {
	if (gsapInstance) return gsapInstance;
	const { gsap } = await import("gsap");
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	gsap.registerPlugin(ScrollTrigger);
	gsapInstance = gsap;
	return gsapInstance;
}
async function refreshScrollTriggers() {
	if (prefersReducedMotion$1()) return;
	await loadGsap();
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	ScrollTrigger.refresh();
}
//#endregion
//#region resources/js/lib/waitForSiteReady.js
function waitForImage(img, timeoutMs = 3500) {
	if (!img) return Promise.resolve();
	if (img.complete && img.naturalWidth > 0) return Promise.resolve();
	return new Promise((resolve) => {
		const done = () => {
			window.clearTimeout(timer);
			resolve();
		};
		const timer = window.setTimeout(done, timeoutMs);
		img.addEventListener("load", done, { once: true });
		img.addEventListener("error", done, { once: true });
	});
}
function delay(ms, signal) {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const timer = window.setTimeout(resolve, ms);
		signal?.addEventListener("abort", () => {
			window.clearTimeout(timer);
			resolve();
		}, { once: true });
	});
}
function getCriticalImages() {
	const seen = /* @__PURE__ */ new Set();
	return [...document.querySelectorAll("[data-splash-logo], img[loading=\"eager\"][fetchpriority=\"high\"]")].filter((img) => {
		if (!img || seen.has(img)) return false;
		seen.add(img);
		return true;
	});
}
/**
* Waits for document, fonts, and above-the-fold images while reporting 0–1 progress.
*/
async function waitForSiteReady({ onProgress, signal, minDuration = 2400, maxDuration = 9e3 } = {}) {
	const start = performance.now();
	let current = 0;
	const report = (value) => {
		current = Math.max(current, Math.min(1, value));
		onProgress?.(current);
	};
	const remaining = () => Math.max(0, maxDuration - (performance.now() - start));
	report(.06);
	if (document.readyState !== "complete") await Promise.race([new Promise((resolve) => window.addEventListener("load", resolve, { once: true })), delay(remaining(), signal)]);
	report(.24);
	try {
		await Promise.race([document.fonts.ready, delay(Math.min(2e3, remaining()), signal)]);
	} catch {}
	report(.48);
	const images = getCriticalImages();
	await Promise.race([Promise.all(images.map((img) => waitForImage(img, Math.min(3500, remaining())))), delay(Math.min(4e3, remaining()), signal)]);
	report(.82);
	const elapsed = performance.now() - start;
	if (elapsed < minDuration) {
		const hold = minDuration - elapsed;
		const steps = 6;
		const stepMs = hold / steps;
		for (let i = 1; i <= steps; i += 1) {
			await delay(stepMs, signal);
			report(.82 + .18 * i / steps);
		}
	} else report(1);
	report(1);
	return { elapsed: performance.now() - start };
}
//#endregion
//#region resources/js/Components/SplashScreen.jsx
function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
var splashPlayed = false;
var SPLASH_STORAGE_KEY = "elevasi-splash-seen";
function shouldPlaySplash() {
	if (prefersReducedMotion()) return false;
	if (splashPlayed) return false;
	if (performance.getEntriesByType("navigation")[0]?.type === "reload") return true;
	try {
		return !sessionStorage.getItem(SPLASH_STORAGE_KEY);
	} catch {
		return true;
	}
}
function markSplashPlayed() {
	splashPlayed = true;
	try {
		sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
	} catch {}
}
function SplashScreen() {
	const { cms } = usePage().props;
	const splash = cms?.splash ?? {};
	const location = splash.location ?? "Jakarta, Indonesia";
	const services = splash.services ?? [];
	const rootRef = useRef(null);
	const [visible, setVisible] = useState(() => shouldPlaySplash());
	useEffect(() => {
		if (!shouldPlaySplash()) {
			setVisible(false);
			return;
		}
		document.body.classList.add("overflow-hidden");
		let cancelled = false;
		let enterTimeline;
		let exitTimeline;
		let failsafeTimer;
		const abort = new AbortController();
		const finish = () => {
			markSplashPlayed();
			window.clearTimeout(failsafeTimer);
			setVisible(false);
			document.body.classList.remove("overflow-hidden");
		};
		const playExit = (gsap, { backdrop, leftCurtain, rightCurtain, content }) => {
			if (cancelled || exitTimeline) return;
			exitTimeline = gsap.timeline({ onComplete: finish }).to(content, {
				opacity: 0,
				y: -8,
				scale: .98,
				duration: .65,
				ease: "power2.in"
			}).call(() => {
				gsap.set(backdrop, { autoAlpha: 0 });
				gsap.set([leftCurtain, rightCurtain], {
					xPercent: 0,
					autoAlpha: 1
				});
			}).to(leftCurtain, {
				xPercent: -100,
				duration: 1,
				ease: "power4.inOut",
				force3D: true
			}).to(rightCurtain, {
				xPercent: 100,
				duration: 1,
				ease: "power4.inOut",
				force3D: true
			}, "<");
		};
		failsafeTimer = window.setTimeout(() => {
			if (!cancelled) finish();
		}, 12e3);
		(async () => {
			try {
				const gsap = await loadGsap();
				if (cancelled || !rootRef.current) return;
				const root = rootRef.current;
				const backdrop = root.querySelector("[data-splash-backdrop]");
				const leftCurtain = root.querySelector("[data-splash-curtain=\"left\"]");
				const rightCurtain = root.querySelector("[data-splash-curtain=\"right\"]");
				const content = root.querySelector("[data-splash-content]");
				const logo = root.querySelector("[data-splash-logo]");
				const locationEl = root.querySelector("[data-splash-location]");
				const servicesEl = root.querySelector("[data-splash-services]");
				const progress = root.querySelector("[data-splash-progress]");
				const loading = root.querySelector("[data-splash-loading]");
				gsap.set([
					logo,
					locationEl,
					loading,
					servicesEl
				].filter(Boolean), { opacity: 0 });
				gsap.set(progress, {
					scaleX: 0,
					transformOrigin: "left center"
				});
				gsap.set(backdrop, { autoAlpha: 1 });
				gsap.set([leftCurtain, rightCurtain], {
					xPercent: 0,
					autoAlpha: 0
				});
				gsap.set(content, {
					opacity: 1,
					y: 0,
					scale: 1
				});
				const animateProgress = gsap.quickTo(progress, "scaleX", {
					duration: .55,
					ease: "power2.out"
				});
				let enterDone = false;
				let loadDone = false;
				const maybeExit = () => {
					if (!enterDone || !loadDone || cancelled) return;
					window.setTimeout(() => {
						playExit(gsap, {
							backdrop,
							leftCurtain,
							rightCurtain,
							content
						});
					}, 280);
				};
				enterTimeline = gsap.timeline({
					defaults: { ease: "power3.out" },
					onComplete: () => {
						enterDone = true;
						maybeExit();
					}
				}).fromTo(logo, {
					y: 24,
					scale: .92,
					opacity: 0
				}, {
					y: 0,
					scale: 1,
					opacity: 1,
					duration: 1.1
				}, .15);
				if (servicesEl) enterTimeline.fromTo(servicesEl, {
					y: 6,
					opacity: 0
				}, {
					y: 0,
					opacity: 1,
					duration: .55
				}, .62);
				enterTimeline.fromTo(locationEl, {
					y: 8,
					opacity: 0
				}, {
					y: 0,
					opacity: 1,
					duration: .65
				}, servicesEl ? .88 : .72).fromTo(loading, { opacity: 0 }, {
					opacity: 1,
					duration: .45
				}, servicesEl ? 1.02 : .86);
				await waitForSiteReady({
					signal: abort.signal,
					minDuration: 2400,
					maxDuration: 9e3,
					onProgress: (value) => {
						if (cancelled) return;
						animateProgress(value);
					}
				});
				if (cancelled) return;
				animateProgress(1);
				loadDone = true;
				maybeExit();
			} catch (error) {
				console.error("SplashScreen animation failed:", error);
				finish();
			}
		})();
		return () => {
			cancelled = true;
			window.clearTimeout(failsafeTimer);
			abort.abort();
			enterTimeline?.kill();
			exitTimeline?.kill();
			document.body.classList.remove("overflow-hidden");
		};
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ jsxs("div", {
		ref: rootRef,
		className: "fixed inset-0 z-[200] overflow-hidden motion-reduce:hidden",
		"aria-hidden": "true",
		role: "presentation",
		children: [
			/* @__PURE__ */ jsx("div", {
				"data-splash-backdrop": true,
				className: "absolute inset-0 bg-ink"
			}),
			/* @__PURE__ */ jsx("div", {
				"data-splash-curtain": "left",
				className: "invisible absolute inset-y-0 left-0 z-[1] w-1/2 bg-ink opacity-0 will-change-transform"
			}),
			/* @__PURE__ */ jsx("div", {
				"data-splash-curtain": "right",
				className: "invisible absolute inset-y-0 right-0 z-[1] w-1/2 bg-ink opacity-0 will-change-transform"
			}),
			/* @__PURE__ */ jsx("div", {
				"data-splash-content": true,
				className: "relative z-[2] grid min-h-[100dvh] place-items-center px-5 text-paper sm:px-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex w-[min(88vw,300px)] flex-col items-center gap-3 text-center sm:w-[min(84vw,360px)] sm:gap-3.5 md:w-[22rem]",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-full",
							children: /* @__PURE__ */ jsx("img", {
								"data-splash-logo": true,
								src: Logo_Elevasi_White_default,
								alt: "Elevasi Design & Build",
								className: "block h-auto w-full opacity-0 will-change-transform"
							})
						}),
						services.length > 0 && /* @__PURE__ */ jsx("p", {
							"data-splash-services": true,
							className: "text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[rgba(243,243,240,0.75)] opacity-0 sm:text-[10px] sm:tracking-[0.14em]",
							children: services.map((service, index) => /* @__PURE__ */ jsxs("span", { children: [index > 0 && /* @__PURE__ */ jsx("span", {
								className: "mx-1.5 text-[rgba(243,243,240,0.35)] sm:mx-2",
								children: "·"
							}), service.name] }, service.number ?? index))
						}),
						/* @__PURE__ */ jsx("p", {
							"data-splash-location": true,
							className: "font-mono text-[9px] uppercase tracking-[0.16em] text-accent opacity-0 sm:text-[10px]",
							children: location
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex w-full flex-col items-center gap-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-px w-full overflow-hidden rounded-full bg-[rgba(243,243,240,0.12)]",
								children: /* @__PURE__ */ jsx("div", {
									"data-splash-progress": true,
									className: "h-full w-full origin-left scale-x-0 rounded-full bg-accent will-change-transform"
								})
							}), /* @__PURE__ */ jsx("span", {
								"data-splash-loading": true,
								className: "font-mono text-[9px] uppercase tracking-[0.12em] text-[rgba(243,243,240,0.45)] opacity-0 sm:text-[10px]",
								children: "Loading"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Components/WhatsAppInquiryDialog.jsx
var fieldClass = "w-full rounded-xl border border-[rgba(27,28,26,0.1)] bg-[rgba(255,255,255,0.88)] px-4 py-3.5 text-base outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:border-[rgb(31,122,70)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(31,122,70,0.12)]";
function WhatsAppInquiryDialog({ open, onClose, sourcePage, copy }) {
	const titleId = useId();
	const descriptionId = useId();
	const firstFieldRef = useRef(null);
	const backdropRef = useRef(null);
	const panelRef = useRef(null);
	const rootRef = useRef(null);
	const { url } = usePage().props;
	const [isRendered, setIsRendered] = useState(open);
	const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
		name: "",
		contact: "",
		message: "",
		company: "",
		source_page: sourcePage || url || "/"
	});
	useEffect(() => {
		if (open) setIsRendered(true);
	}, [open]);
	useEffect(() => {
		setData("source_page", sourcePage || url || "/");
	}, [
		sourcePage,
		url,
		setData
	]);
	useEffect(() => {
		if (!isRendered || !open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const isDesktop = window.matchMedia("(min-width: 640px)").matches;
		const timer = window.setTimeout(() => {
			if (isDesktop) firstFieldRef.current?.focus();
		}, 520);
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.clearTimeout(timer);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [
		open,
		isRendered,
		onClose
	]);
	useEffect(() => {
		if (!isRendered) return;
		if (prefersReducedMotion$1()) {
			if (!open) setIsRendered(false);
			return;
		}
		let cancelled = false;
		let ctx;
		(async () => {
			const gsap = await loadGsap();
			if (cancelled) return;
			const backdrop = backdropRef.current;
			const panel = panelRef.current;
			const root = rootRef.current;
			const isMobile = window.matchMedia("(max-width: 639px)").matches;
			if (!backdrop || !panel || !root) return;
			const parts = root.querySelectorAll("[data-dialog-part]");
			if (open) {
				gsap.set(backdrop, { autoAlpha: 0 });
				gsap.set(panel, {
					autoAlpha: 1,
					yPercent: isMobile ? 100 : 0,
					y: isMobile ? 0 : 28,
					scale: isMobile ? 1 : .94
				});
				gsap.set(parts, {
					y: 18,
					autoAlpha: 0
				});
				ctx = gsap.context(() => {
					const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
					tl.to(backdrop, {
						autoAlpha: 1,
						duration: .55,
						ease: "power2.out"
					});
					if (isMobile) tl.to(panel, {
						yPercent: 0,
						duration: .88,
						ease: "power4.out"
					}, "-=0.42");
					else tl.to(panel, {
						y: 0,
						scale: 1,
						autoAlpha: 1,
						duration: .78,
						ease: "power4.out"
					}, "-=0.42");
					tl.to(parts, {
						y: 0,
						autoAlpha: 1,
						duration: .62,
						stagger: .07,
						ease: "power3.out"
					}, "-=0.48");
				}, root);
			} else ctx = gsap.context(() => {
				const onDone = () => {
					if (!cancelled) setIsRendered(false);
				};
				if (isMobile) {
					const tl = gsap.timeline({ onComplete: onDone });
					tl.to(panel, {
						yPercent: 100,
						duration: .5,
						ease: "power3.in"
					});
					tl.to(backdrop, {
						autoAlpha: 0,
						duration: .32,
						ease: "power2.in"
					}, "-=0.24");
				} else gsap.to([backdrop, panel], {
					autoAlpha: 0,
					duration: .26,
					ease: "power2.out",
					onComplete: onDone
				});
			}, root);
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	}, [open, isRendered]);
	const handleClose = () => {
		clearErrors();
		reset();
		onClose();
	};
	const submit = (event) => {
		event.preventDefault();
		post(route("kontak.store"), {
			preserveScroll: true,
			onSuccess: () => {
				trackEvent("generate_lead", {
					event_category: "conversion",
					event_label: sourcePage || url || "/"
				});
				reset();
				onClose();
			}
		});
	};
	if (!isRendered) return null;
	return /* @__PURE__ */ jsxs("div", {
		ref: rootRef,
		className: "fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6",
		children: [/* @__PURE__ */ jsx("button", {
			ref: backdropRef,
			type: "button",
			className: "absolute inset-0 bg-[rgba(27,28,26,0.42)] backdrop-blur-md",
			"aria-label": copy.cancel,
			onClick: handleClose
		}), /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			"aria-describedby": descriptionId,
			className: "relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-[rgba(27,28,26,0.08)] bg-[rgb(243,243,240)] shadow-[0_-20px_60px_rgba(27,28,26,0.16)] sm:max-h-[min(88vh,760px)] sm:rounded-2xl sm:shadow-[0_32px_90px_rgba(27,28,26,0.16)]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex shrink-0 items-center justify-center pt-3.5 sm:hidden",
					"data-dialog-part": true,
					children: /* @__PURE__ */ jsx("span", {
						className: "h-1 w-12 rounded-full bg-[rgba(27,28,26,0.12)]",
						"aria-hidden": "true"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					"data-dialog-part": true,
					className: "flex shrink-0 items-start justify-between gap-4 px-5 pb-5 pt-1 sm:px-8 sm:pb-6 sm:pt-7",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "mono-label",
								children: "( WhatsApp )"
							}),
							/* @__PURE__ */ jsx("h2", {
								id: titleId,
								className: "m-0 mt-2.5 text-[clamp(22px,5.5vw,30px)] font-semibold uppercase leading-[1.08] tracking-[-0.02em] [text-wrap:balance]",
								children: copy.title
							}),
							/* @__PURE__ */ jsx("p", {
								id: descriptionId,
								className: "mt-2.5 text-[15px] leading-[1.65] text-[rgba(27,28,26,0.58)] sm:mt-3",
								children: copy.description
							})
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleClose,
						className: "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(27,28,26,0.05)] text-lg leading-none text-[rgba(27,28,26,0.45)] transition duration-300 hover:bg-[rgba(27,28,26,0.1)] hover:text-[rgb(27,28,26)]",
						"aria-label": copy.cancel,
						children: "×"
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "flex min-h-0 flex-1 flex-col",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 sm:px-8 sm:pb-3",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							name: "company",
							value: data.company,
							onChange: (event) => setData("company", event.target.value),
							className: "hidden",
							tabIndex: -1,
							autoComplete: "off"
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									"data-dialog-part": true,
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "inquiry-name",
											className: "mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]",
											children: copy.nameLabel
										}),
										/* @__PURE__ */ jsx("input", {
											ref: firstFieldRef,
											id: "inquiry-name",
											type: "text",
											value: data.name,
											onChange: (event) => setData("name", event.target.value),
											className: fieldClass,
											autoComplete: "name",
											required: true
										}),
										errors.name && /* @__PURE__ */ jsx("p", {
											className: "mt-1.5 text-sm text-red-700",
											children: errors.name
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									"data-dialog-part": true,
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "inquiry-contact",
											className: "mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]",
											children: copy.contactLabel
										}),
										/* @__PURE__ */ jsx("input", {
											id: "inquiry-contact",
											type: "tel",
											value: data.contact,
											onChange: (event) => setData("contact", event.target.value),
											className: fieldClass,
											autoComplete: "tel",
											inputMode: "tel",
											placeholder: copy.contactPlaceholder,
											required: true
										}),
										errors.contact && /* @__PURE__ */ jsx("p", {
											className: "mt-1.5 text-sm text-red-700",
											children: errors.contact
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									"data-dialog-part": true,
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "inquiry-message",
											className: "mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]",
											children: copy.messageLabel
										}),
										/* @__PURE__ */ jsx("textarea", {
											id: "inquiry-message",
											value: data.message,
											onChange: (event) => setData("message", event.target.value),
											rows: 4,
											className: `${fieldClass} min-h-[112px] resize-y leading-[1.6]`,
											placeholder: copy.messagePlaceholder,
											required: true
										}),
										errors.message && /* @__PURE__ */ jsx("p", {
											className: "mt-1.5 text-sm text-red-700",
											children: errors.message
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						"data-dialog-part": true,
						className: "shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-start",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition duration-300 hover:bg-[rgb(27,28,26)] disabled:opacity-60 sm:w-auto",
								disabled: processing,
								children: processing ? copy.submitting : `${copy.submit} ↗`
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClose,
								className: "inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(27,28,26,0.14)] bg-[rgba(255,255,255,0.45)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgba(27,28,26,0.72)] transition duration-300 hover:border-[rgba(27,28,26,0.22)] hover:bg-white sm:w-auto",
								disabled: processing,
								children: copy.cancel
							})]
						})
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/contexts/WhatsAppInquiryContext.jsx
var WhatsAppInquiryContext = createContext(null);
function WhatsAppInquiryProvider({ children, copy, onOpen }) {
	const [isOpen, setIsOpen] = useState(false);
	const [sourcePage, setSourcePage] = useState("");
	const openDialog = useCallback((source = "") => {
		onOpen?.();
		setSourcePage(source || window.location.pathname);
		setIsOpen(true);
	}, [onOpen]);
	const closeDialog = useCallback(() => {
		setIsOpen(false);
	}, []);
	const value = useMemo(() => ({ openDialog }), [openDialog]);
	return /* @__PURE__ */ jsxs(WhatsAppInquiryContext.Provider, {
		value,
		children: [children, /* @__PURE__ */ jsx(WhatsAppInquiryDialog, {
			open: isOpen,
			onClose: closeDialog,
			sourcePage,
			copy
		})]
	});
}
function useWhatsAppInquiry() {
	const context = useContext(WhatsAppInquiryContext);
	if (!context) throw new Error("useWhatsAppInquiry must be used within WhatsAppInquiryProvider");
	return context;
}
//#endregion
//#region resources/js/Components/WhatsAppButton.jsx
function WhatsAppButton({ children, className = "", source, showArrow = true, disabled = false, onClick, ...props }) {
	const { openDialog } = useWhatsAppInquiry();
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		className,
		disabled,
		onClick: (event) => {
			trackEvent("whatsapp_click", {
				event_category: "engagement",
				event_label: source || "unknown"
			});
			openDialog(source);
			onClick?.(event);
		},
		...props,
		children: [children, showArrow ? " ↗" : null]
	});
}
//#endregion
//#region resources/js/hooks/usePageTransition.js
var exitHandlerBound = false;
function shouldAnimateVisit(visit) {
	if (!visit) return false;
	if (visit.prefetch) return false;
	if (Array.isArray(visit.only) && visit.only.length > 0) return false;
	return true;
}
function bindExitTransition() {
	if (exitHandlerBound || typeof window === "undefined") return;
	exitHandlerBound = true;
	router.on("before", (event) => {
		if (prefersReducedMotion$1() || !shouldAnimateVisit(event.detail.visit)) return;
		const page = document.getElementById("page-content");
		if (!page) return;
		event.pause();
		loadGsap().then((gsap) => {
			gsap.to(page, {
				autoAlpha: 0,
				y: -20,
				duration: .42,
				ease: "power2.in",
				onComplete: () => event.resume()
			});
		});
	});
	router.on("finish", () => {
		refreshScrollTriggers();
	});
}
function usePageTransition() {
	const pageRef = useRef(null);
	const { url } = usePage();
	const isFirstRender = useRef(true);
	useEffect(() => {
		bindExitTransition();
	}, []);
	useEffect(() => {
		if (prefersReducedMotion$1()) return;
		const page = pageRef.current;
		if (!page) return;
		let ctx;
		(async () => {
			const gsap = await loadGsap();
			if (!pageRef.current) return;
			if (isFirstRender.current) {
				isFirstRender.current = false;
				gsap.set(page, {
					autoAlpha: 1,
					y: 0
				});
				refreshScrollTriggers();
				return;
			}
			ctx = gsap.context(() => {
				gsap.fromTo(page, {
					autoAlpha: 0,
					y: 28
				}, {
					autoAlpha: 1,
					y: 0,
					duration: .95,
					ease: "power3.out",
					onComplete: () => refreshScrollTriggers()
				});
			}, page);
		})();
		return () => {
			ctx?.revert();
		};
	}, [url]);
	return pageRef;
}
//#endregion
//#region resources/js/Components/OptimizedImage.jsx
/**
* Image defaults tuned for performance: async decode, lazy by default, optional srcset.
*/
function OptimizedImage({ src, srcSet, sizes, alt = "", loading = "lazy", fetchPriority, className, ...rest }) {
	if (!src) return null;
	return /* @__PURE__ */ jsx("img", {
		src,
		srcSet: srcSet || void 0,
		sizes: srcSet && sizes ? sizes : void 0,
		alt,
		loading,
		fetchpriority: fetchPriority,
		decoding: "async",
		className,
		...rest
	});
}
//#endregion
//#region resources/images/elevasi-logo.gif
var elevasi_logo_default = "/build/assets/elevasi-logo-CfvkopY_.gif";
//#endregion
//#region resources/js/Layouts/SiteLayout.jsx
function NavCta({ cms, className, onClick }) {
	const label = cms.nav.cta;
	return /* @__PURE__ */ jsxs(WhatsAppButton, {
		className: `inline-flex w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(27,28,26)] md:w-auto md:px-5 md:py-2.5 md:text-xs ${className ?? ""}`,
		onClick,
		showArrow: false,
		children: [label, " →"]
	});
}
function SiteLayout({ children }) {
	const { props } = usePage();
	const { locale, altLocaleUrl, settings, cms, url } = props;
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const pageRef = usePageTransition();
	const isProjectsArea = url.startsWith("/proyek") || url.startsWith("/id/proyek");
	const isStudioArea = url === "/tentang" || url === "/id/tentang";
	const isContactPage = url === "/kontak" || url === "/id/kontak";
	const closeMobileNav = () => setIsMobileNavOpen(false);
	const homeUrl = locale === "id" ? "/id" : "/";
	const goHome = () => {
		closeMobileNav();
		router.visit(homeUrl);
	};
	const navLinkClass = (active) => `text-xs font-medium uppercase tracking-[0.08em] transition ${active ? "text-[rgb(31,122,70)]" : "text-[rgb(27,28,26)] hover:text-[rgb(31,122,70)]"}`;
	useEffect(() => {
		setIsMobileNavOpen(false);
	}, [url]);
	useEffect(() => {
		document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileNavOpen]);
	return /* @__PURE__ */ jsxs(WhatsAppInquiryProvider, {
		copy: cms.inquiry,
		onOpen: closeMobileNav,
		children: [
			/* @__PURE__ */ jsx(SplashScreen, {}),
			/* @__PURE__ */ jsx(GoogleAnalytics, {}),
			/* @__PURE__ */ jsx("header", {
				className: "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "pointer-events-auto mx-auto flex max-w-5xl items-center gap-2.5 rounded-full border border-[rgba(27,28,26,0.1)] bg-[rgba(243,243,240,0.82)] px-3 py-2.5 shadow-[0_12px_40px_rgba(27,28,26,0.07)] backdrop-blur-xl sm:gap-3 sm:px-3.5 md:gap-6 md:px-5 md:py-2.5",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: goHome,
							className: "flex min-w-0 shrink-0 items-center bg-transparent p-0 border-0 cursor-pointer",
							"aria-label": "Go to home page",
							children: /* @__PURE__ */ jsx(OptimizedImage, {
								src: elevasi_logo_default,
								alt: "Elevasi Design & Build",
								className: "h-12 w-auto sm:h-[52px] md:h-14",
								loading: "eager",
								fetchPriority: "low"
							})
						}),
						/* @__PURE__ */ jsxs("nav", {
							className: "hidden flex-1 items-center justify-center gap-7 md:flex",
							children: [/* @__PURE__ */ jsx(Link, {
								href: route("projects.index"),
								className: navLinkClass(isProjectsArea),
								children: cms.nav.work
							}), /* @__PURE__ */ jsx(Link, {
								href: route("tentang"),
								className: navLinkClass(isStudioArea),
								children: cms.nav.studio
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ml-auto flex shrink-0 items-center gap-1.5 md:gap-3",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "hidden gap-0.5 rounded-full border border-[rgba(27,28,26,0.12)] bg-[rgba(255,255,255,0.35)] p-0.5 text-[10px] text-[rgba(27,28,26,0.45)] md:inline-flex",
									children: [/* @__PURE__ */ jsx(Link, {
										href: locale === "en" ? url : altLocaleUrl,
										className: `inline-block rounded-full px-2 py-1 ${locale === "en" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
										children: "EN"
									}), /* @__PURE__ */ jsx(Link, {
										href: locale === "id" ? url : altLocaleUrl,
										className: `inline-block rounded-full px-2 py-1 ${locale === "id" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
										children: "ID"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "hidden md:contents",
									children: /* @__PURE__ */ jsx(NavCta, { cms })
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									className: "inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-[rgba(27,28,26,0.12)] bg-[rgba(255,255,255,0.45)] md:hidden",
									"aria-expanded": isMobileNavOpen,
									"aria-controls": "site-nav",
									onClick: () => setIsMobileNavOpen((open) => !open),
									children: [
										/* @__PURE__ */ jsx("span", { className: `block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? "translate-y-[7px] rotate-45" : ""}` }),
										/* @__PURE__ */ jsx("span", { className: `block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? "opacity-0" : ""}` }),
										/* @__PURE__ */ jsx("span", { className: `block h-0.5 w-4 bg-[rgb(27,28,26)] transition duration-200 ${isMobileNavOpen ? "-translate-y-[7px] -rotate-45" : ""}` }),
										/* @__PURE__ */ jsx("span", {
											className: "sr-only",
											children: "Toggle navigation menu"
										})
									]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				id: "site-nav",
				className: `fixed inset-0 z-40 flex flex-col bg-[rgb(243,243,240)] px-5 pb-8 pt-[100px] transition duration-300 md:hidden ${isMobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`,
				"aria-hidden": !isMobileNavOpen,
				children: [/* @__PURE__ */ jsxs("nav", {
					className: "flex flex-1 flex-col justify-center gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						href: route("projects.index"),
						className: `border-b border-[rgba(27,28,26,0.08)] py-5 text-[clamp(32px,9vw,48px)] font-semibold uppercase leading-none tracking-[-0.03em] ${isProjectsArea ? "text-[rgb(31,122,70)]" : "text-[rgb(27,28,26)]"}`,
						onClick: closeMobileNav,
						children: cms.nav.work
					}), /* @__PURE__ */ jsx(Link, {
						href: route("tentang"),
						className: `border-b border-[rgba(27,28,26,0.08)] py-5 text-[clamp(32px,9vw,48px)] font-semibold uppercase leading-none tracking-[-0.03em] ${isStudioArea ? "text-[rgb(31,122,70)]" : "text-[rgb(27,28,26)]"}`,
						onClick: closeMobileNav,
						children: cms.nav.studio
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-auto space-y-5 border-t border-[rgba(27,28,26,0.1)] pt-6 pb-[env(safe-area-inset-bottom)]",
					children: [/* @__PURE__ */ jsx(NavCta, {
						cms,
						onClick: closeMobileNav
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "inline-flex gap-0.5 rounded-full border border-[rgba(27,28,26,0.15)] p-0.5 text-xs",
							children: [/* @__PURE__ */ jsx(Link, {
								href: locale === "en" ? url : altLocaleUrl,
								className: `rounded-full px-3 py-1.5 ${locale === "en" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
								onClick: closeMobileNav,
								children: "EN"
							}), /* @__PURE__ */ jsx(Link, {
								href: locale === "id" ? url : altLocaleUrl,
								className: `rounded-full px-3 py-1.5 ${locale === "id" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
								onClick: closeMobileNav,
								children: "ID"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.4)]",
							children: "Elevasi"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				id: "page-content",
				ref: pageRef,
				children
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: `mt-10 overflow-hidden rounded-t-3xl bg-[rgb(27,28,26)] text-[rgb(243,243,240)] ${isContactPage ? "pt-10" : ""}`,
				children: [!isContactPage && /* @__PURE__ */ jsxs("div", {
					className: "relative px-5 pb-20 pt-20 text-center md:px-10 md:pb-[100px] md:pt-[110px]",
					children: [cms.footer.ctaImage && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(OptimizedImage, {
						src: cms.footer.ctaImage,
						srcSet: cms.footer.ctaImageSrcSet,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover",
						sizes: "100vw",
						loading: "lazy",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 bg-[rgba(27,28,26,0.72)]",
						"aria-hidden": "true"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "relative z-10",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-7 font-mono text-xs uppercase tracking-[0.08em] text-[rgba(243,243,240,0.45)]",
								children: [
									"( ",
									cms.footer.eyebrow,
									" )"
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-[clamp(42px,7vw,120px)] font-semibold uppercase leading-[1] tracking-[-0.035em]",
								children: [
									cms.footer.titleLine1,
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx("span", {
										className: "serif-italic",
										children: cms.footer.titleLine2
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-10 flex justify-center md:mt-12",
								children: /* @__PURE__ */ jsx(WhatsAppButton, {
									className: "w-full max-w-sm rounded-full bg-[rgb(31,122,70)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(243,243,240)] hover:text-[rgb(27,28,26)] sm:w-auto sm:max-w-none",
									source: "/footer",
									children: cms.footer.whatsapp
								})
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative z-10 flex flex-col gap-4 border-t border-[rgba(243,243,240,0.15)] px-5 pt-7 pb-9 text-xs uppercase tracking-[0.06em] text-[rgba(243,243,240,0.5)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:px-10",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "text-sm font-bold tracking-[0.02em] text-[rgb(243,243,240)]",
							children: ["ELEVASI ", /* @__PURE__ */ jsx("span", { children: "Design & Build" })]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex flex-wrap gap-4 sm:gap-6",
							children: [settings.instagramUrl && /* @__PURE__ */ jsx("a", {
								href: settings.instagramUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]",
								children: cms.footer.instagramLabel
							}), /* @__PURE__ */ jsx(WhatsAppButton, {
								className: "text-[rgba(243,243,240,0.6)] transition hover:text-[rgb(243,243,240)]",
								source: "/footer-link",
								showArrow: false,
								children: cms.footer.whatsappLabel
							})]
						}),
						/* @__PURE__ */ jsx("span", { children: cms.footer.copyright })
					]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Placeholder.jsx
/**
* Striped placeholder standing in for a real project photo. Swap for a real
* <img> once photography is delivered — same aspect ratio / caption props.
*/
function Placeholder({ caption, parallax = 0, size = "md", className = "", style, ...rest }) {
	const captionClass = size === "sm" ? "placeholder-caption placeholder-caption--sm" : size === "xs" ? "placeholder-caption placeholder-caption--xs" : "placeholder-caption";
	return /* @__PURE__ */ jsx("div", {
		className: `placeholder ${className}`,
		style,
		...rest,
		children: /* @__PURE__ */ jsx("div", {
			className: "placeholder-fill",
			"data-parallax": parallax || void 0,
			children: /* @__PURE__ */ jsxs("span", {
				className: captionClass,
				children: [
					"[ ",
					caption,
					" ]"
				]
			})
		})
	});
}
//#endregion
//#region resources/js/Components/Seo.jsx
function absoluteUrl(path, appUrl) {
	if (!path) return appUrl;
	if (String(path).startsWith("http://") || String(path).startsWith("https://")) return path;
	const base = String(appUrl || "").replace(/\/$/, "");
	const normalized = path === "/" ? "/" : `/${String(path).replace(/^\/+/, "")}`;
	return `${base}${normalized === "/" ? "/" : normalized}`;
}
function Seo({ title, description, image, type = "website", noIndex = false, preloadImage = false }) {
	const { props } = usePage();
	const { locale, url, altLocaleUrl, seo: siteSeo } = props;
	const appUrl = siteSeo?.appUrl || "";
	const siteName = siteSeo?.siteName || "Elevasi Design & Build";
	const metaDescription = description || siteSeo?.defaultDescription || "Elevasi Design & Build — kontraktor design-build di Jakarta untuk rumah, kantor, dan ruang komersial.";
	const ogImage = absoluteUrl(image || siteSeo?.defaultImage, appUrl);
	const canonicalPath = !url || url === "/" ? "/" : url;
	const canonical = absoluteUrl(canonicalPath, appUrl);
	const idPath = locale === "id" ? canonicalPath : altLocaleUrl;
	const enPath = locale === "en" ? canonicalPath : altLocaleUrl;
	const alternateId = absoluteUrl(idPath, appUrl);
	const alternateEn = absoluteUrl(enPath, appUrl);
	const documentTitle = !title || title === siteName ? void 0 : title;
	const ogTitle = documentTitle ? `${documentTitle} — ${siteName}` : siteName;
	return /* @__PURE__ */ jsxs(Head, {
		title: documentTitle,
		children: [
			/* @__PURE__ */ jsx("meta", {
				"head-key": "description",
				name: "description",
				content: metaDescription
			}),
			noIndex ? /* @__PURE__ */ jsx("meta", {
				"head-key": "robots",
				name: "robots",
				content: "noindex,nofollow"
			}) : /* @__PURE__ */ jsx("meta", {
				"head-key": "robots",
				name: "robots",
				content: "index,follow"
			}),
			/* @__PURE__ */ jsx("link", {
				"head-key": "canonical",
				rel: "canonical",
				href: canonical
			}),
			/* @__PURE__ */ jsx("link", {
				"head-key": "hreflang-id",
				rel: "alternate",
				hrefLang: "id",
				href: alternateId
			}),
			/* @__PURE__ */ jsx("link", {
				"head-key": "hreflang-en",
				rel: "alternate",
				hrefLang: "en",
				href: alternateEn
			}),
			/* @__PURE__ */ jsx("link", {
				"head-key": "hreflang-default",
				rel: "alternate",
				hrefLang: "x-default",
				href: alternateEn
			}),
			preloadImage && image ? /* @__PURE__ */ jsx("link", {
				"head-key": "preload-lcp",
				rel: "preload",
				as: "image",
				href: absoluteUrl(image, appUrl)
			}) : null,
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:type",
				property: "og:type",
				content: type
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:site_name",
				property: "og:site_name",
				content: siteName
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:locale",
				property: "og:locale",
				content: locale === "en" ? "en_US" : "id_ID"
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:locale:alt",
				property: "og:locale:alternate",
				content: locale === "en" ? "id_ID" : "en_US"
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:title",
				property: "og:title",
				content: ogTitle
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:description",
				property: "og:description",
				content: metaDescription
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "og:url",
				property: "og:url",
				content: canonical
			}),
			ogImage ? /* @__PURE__ */ jsx("meta", {
				"head-key": "og:image",
				property: "og:image",
				content: ogImage
			}) : null,
			/* @__PURE__ */ jsx("meta", {
				"head-key": "twitter:card",
				name: "twitter:card",
				content: "summary_large_image"
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "twitter:title",
				name: "twitter:title",
				content: ogTitle
			}),
			/* @__PURE__ */ jsx("meta", {
				"head-key": "twitter:description",
				name: "twitter:description",
				content: metaDescription
			}),
			ogImage ? /* @__PURE__ */ jsx("meta", {
				"head-key": "twitter:image",
				name: "twitter:image",
				content: ogImage
			}) : null,
			siteSeo?.organizationJsonLd ? /* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				children: JSON.stringify(siteSeo.organizationJsonLd)
			}) : null
		]
	});
}
//#endregion
//#region resources/js/lib/defer.js
/**
* Defers non-critical work until the browser is idle so LCP / first paint stay fast.
*/
function whenIdle(timeout = 1800) {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve();
			return;
		}
		if ("requestIdleCallback" in window) {
			window.requestIdleCallback(() => resolve(), { timeout });
			return;
		}
		window.setTimeout(resolve, 1);
	});
}
//#endregion
//#region resources/js/hooks/useScrollReveal.js
/**
* Scroll-triggered reveal for every [data-reveal] inside `containerRef`.
* `data-reveal` = delay in ms. Optional `data-reveal-variant`: up | scale | clip.
*/
function useScrollReveal(containerRef, deps = []) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const elements = Array.from(container.querySelectorAll("[data-reveal]"));
		if (elements.length === 0) return;
		if (prefersReducedMotion$1()) {
			elements.forEach((el) => {
				el.style.opacity = "1";
				el.style.transform = "none";
				el.style.clipPath = "none";
			});
			return;
		}
		let ctx;
		let cancelled = false;
		(async () => {
			await whenIdle();
			const gsap = await loadGsap();
			if (cancelled || !containerRef.current) return;
			ctx = gsap.context(() => {
				elements.forEach((el) => {
					const delay = (parseInt(el.dataset.reveal, 10) || 0) / 1e3;
					const variant = el.dataset.revealVariant || "up";
					const from = { opacity: 0 };
					const to = {
						opacity: 1,
						duration: 1.05,
						delay,
						ease: "power3.out"
					};
					if (variant === "scale") {
						from.scale = .94;
						to.scale = 1;
					} else if (variant === "clip") {
						from.clipPath = "inset(100% 0 0 0)";
						to.clipPath = "inset(0% 0 0 0)";
						to.duration = 1.2;
					} else {
						from.y = 32;
						to.y = 0;
					}
					gsap.fromTo(el, from, {
						...to,
						scrollTrigger: {
							trigger: el,
							start: "top 88%",
							once: true
						}
					});
				});
			}, container);
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	}, [containerRef, ...deps]);
}
//#endregion
//#region resources/js/hooks/useParallax.js
/**
* Smooth scrub parallax on [data-parallax] elements (value = intensity, default 0.08).
*/
function useParallax(containerRef) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container || prefersReducedMotion$1()) return;
		const elements = Array.from(container.querySelectorAll("[data-parallax]"));
		if (elements.length === 0) return;
		let ctx;
		let cancelled = false;
		(async () => {
			await whenIdle();
			const gsap = await loadGsap();
			if (cancelled) return;
			ctx = gsap.context(() => {
				elements.forEach((el) => {
					const host = el.parentElement;
					if (!host) return;
					const speed = parseFloat(el.dataset.parallax) || .08;
					const travel = Math.max(24, Math.round(speed * 320));
					gsap.fromTo(el, { y: -travel / 2 }, {
						y: travel / 2,
						ease: "none",
						scrollTrigger: {
							trigger: host,
							start: "top bottom",
							end: "bottom top",
							scrub: .65
						}
					});
				});
			}, container);
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	}, [containerRef]);
}
//#endregion
//#region resources/js/Pages/Home.jsx
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => Home });
function Hero({ hero }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", {
		className: "px-5 pb-0 pt-36 md:px-10 md:pt-[170px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-baseline justify-between gap-2 border-b border-[rgba(27,28,26,0.12)] pb-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)] md:text-xs",
				"data-reveal": "0",
				children: [
					/* @__PURE__ */ jsx("span", { children: hero.eyebrow }),
					/* @__PURE__ */ jsx("span", { children: hero.location }),
					/* @__PURE__ */ jsx("span", { children: hero.established })
				]
			}),
			/* @__PURE__ */ jsxs("h1", {
				className: "mt-8 max-w-[14ch] text-[clamp(52px,9.5vw,168px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em]",
				"data-reveal": "100",
				children: [
					hero.headlineLine1,
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-[3vw]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "serif-italic text-[rgb(31,122,70)]",
							children: hero.headlineAccent
						}), /* @__PURE__ */ jsxs("span", { children: [hero.headlineWord, /* @__PURE__ */ jsx("span", {
							className: "serif-italic",
							children: "."
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-12 mt-10 flex flex-col items-start justify-between gap-5 md:mb-14 md:mt-12 md:flex-row md:items-end md:gap-10",
				"data-reveal": "200",
				children: [/* @__PURE__ */ jsx("p", {
					className: "m-0 max-w-[420px] text-base leading-relaxed text-[rgba(27,28,26,0.65)] md:text-[17px]",
					children: hero.lede
				}), /* @__PURE__ */ jsxs(Link, {
					href: route("projects.index"),
					className: "flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.06em]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "inline-block h-11 w-11 rounded-full border border-[rgba(27,28,26,0.25)] text-center text-base leading-[44px]",
						children: "↓"
					}), hero.viewWork]
				})]
			})
		]
	}), /* @__PURE__ */ jsx("section", {
		className: "px-5 md:px-10",
		children: /* @__PURE__ */ jsxs("div", {
			"data-reveal": "0",
			"data-reveal-variant": "clip",
			className: "relative overflow-hidden rounded-sm",
			children: [
				hero.coverImage ? /* @__PURE__ */ jsx("div", {
					className: "relative h-[62vh] overflow-hidden md:h-[76vh]",
					children: /* @__PURE__ */ jsx(OptimizedImage, {
						src: hero.coverImage,
						srcSet: hero.coverSrcSet,
						alt: hero.coverCaption || "Hero cover image",
						className: "h-full w-full object-cover",
						"data-parallax": "0.12",
						loading: "eager",
						fetchPriority: "high",
						sizes: "100vw"
					})
				}) : /* @__PURE__ */ jsx(Placeholder, {
					caption: hero.coverCaption,
					parallax: .12,
					className: "h-[62vh] md:h-[76vh]"
				}),
				/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(27,28,26,0.12)] via-transparent to-transparent" }),
				hero.badgeLabel && /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-4 left-4 rounded-full border border-[rgba(243,243,240,0.45)] bg-[rgba(27,28,26,0.45)] px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-[rgb(243,243,240)] backdrop-blur-sm md:bottom-6 md:left-6 md:text-xs",
					children: hero.badgeLabel
				})
			]
		})
	})] });
}
function Marquee({ text }) {
	const renderSegments = (prefix) => Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsxs("span", {
		className: "inline-flex shrink-0 items-center whitespace-nowrap px-10 text-sm uppercase tracking-[0.14em] text-[rgba(27,28,26,0.55)] md:px-12 md:text-[15px]",
		children: [text, /* @__PURE__ */ jsx("span", {
			className: "mx-10 text-[rgba(27,28,26,0.28)] md:mx-12",
			"aria-hidden": "true",
			children: "✦"
		})]
	}, `${prefix}-${i}`));
	return /* @__PURE__ */ jsx("section", {
		className: "mt-20 overflow-hidden border-y border-[rgba(27,28,26,0.1)] py-5 md:mt-[90px] md:py-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "marquee-track flex w-max",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 items-center",
				children: renderSegments("a")
			}), /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 items-center",
				"aria-hidden": "true",
				children: renderSegments("b")
			})]
		})
	});
}
function FeaturedWork({ featured, home }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "px-5 pb-10 pt-20 md:px-10 md:pb-10 md:pt-[110px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-14",
				"data-reveal": "0",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "m-0 text-[clamp(40px,5vw,80px)] font-semibold uppercase tracking-[-0.03em]",
					children: [
						home.workHeading,
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "serif-italic",
							children: home.workHeadingAccent
						})
					]
				}), /* @__PURE__ */ jsxs("span", {
					className: "font-mono text-xs text-[rgba(27,28,26,0.5)]",
					children: [
						"( ",
						home.workRange,
						" )"
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 items-start gap-7 md:grid-cols-2",
				children: featured.map((project, i) => /* @__PURE__ */ jsxs(Link, {
					href: route("projects.show", project.slug),
					className: `group block ${i % 2 === 1 ? "md:mt-20" : ""}`,
					"data-reveal": i % 2 * 100,
					children: [
						project.coverImage ? /* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-[2px]",
							children: /* @__PURE__ */ jsx(OptimizedImage, {
								src: project.coverImage,
								srcSet: project.coverSrcSet,
								sizes: "(min-width: 768px) 50vw, 100vw",
								alt: project.caption || project.title,
								className: "aspect-[var(--ratio)] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]",
								style: { "--ratio": i % 3 === 0 ? "4 / 4.6" : "4 / 3" },
								loading: "lazy"
							})
						}) : /* @__PURE__ */ jsx(Placeholder, {
							caption: project.caption,
							parallax: .07,
							className: "aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]",
							style: { "--ratio": i % 3 === 0 ? "4 / 4.6" : "4 / 3" }
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between px-0.5 pb-0 pt-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-lg font-semibold tracking-[-0.01em] transition group-hover:text-[rgb(31,122,70)] md:text-xl",
								children: project.title
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs uppercase text-[rgba(27,28,26,0.5)]",
								children: [
									project.category,
									" · ",
									project.year
								]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-0.5 pt-1 text-[13px] text-[rgba(27,28,26,0.5)]",
							children: project.location
						})
					]
				}, project.slug))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-14 text-center md:mt-[72px]",
				"data-reveal": "0",
				children: /* @__PURE__ */ jsxs(Link, {
					href: route("projects.index"),
					className: "inline-block rounded-full border border-[rgba(27,28,26,0.3)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]",
					children: [home.workAllProjects, " →"]
				})
			})
		]
	});
}
function Services({ services, home }) {
	const [openIndex, setOpenIndex] = useState(null);
	const toggleService = (index) => {
		setOpenIndex((current) => current === index ? null : index);
	};
	const relatedProjectsUrl = (categorySlug) => {
		if (!categorySlug) return route("projects.index");
		return `${route("projects.index")}?category=${categorySlug}`;
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "services",
		className: "scroll-mt-28 px-5 py-20 md:px-10 md:py-[110px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mono-label mb-7",
			"data-reveal": "0",
			children: [
				"( ",
				home.servicesEyebrow,
				" )"
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: services.map((service, i) => {
				const isOpen = openIndex === i;
				return /* @__PURE__ */ jsxs("div", {
					className: "border-t border-[rgba(27,28,26,0.12)]",
					"data-reveal": i * 60,
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => toggleService(i),
						className: "group grid w-full cursor-pointer grid-cols-[40px_1fr_40px] gap-4 px-2 py-6 text-left transition hover:bg-[rgb(236,236,232)] md:grid-cols-[80px_1fr_1fr_40px] md:items-center md:gap-6 md:py-[34px]",
						"aria-expanded": isOpen,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[13px] text-[rgb(31,122,70)]",
								children: service.number
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[clamp(24px,3vw,44px)] font-semibold uppercase tracking-[-0.02em] transition group-hover:translate-x-1",
								children: service.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "col-start-2 max-w-[420px] text-sm leading-[1.55] text-[rgba(27,28,26,0.55)] md:col-auto",
								children: service.description
							}),
							/* @__PURE__ */ jsx("span", {
								className: `text-xl transition group-hover:text-[rgb(31,122,70)] ${isOpen ? "rotate-45 text-[rgb(31,122,70)]" : "text-[rgba(27,28,26,0.4)]"}`,
								children: "+"
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: `grid overflow-hidden transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`,
						children: /* @__PURE__ */ jsx("div", {
							className: "min-h-0",
							children: /* @__PURE__ */ jsxs("div", {
								className: "px-2 pb-8 pt-0 md:px-[104px] md:pb-10",
								children: [/* @__PURE__ */ jsx("p", {
									className: "m-0 max-w-[640px] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.7)]",
									children: service.detail
								}), /* @__PURE__ */ jsxs(Link, {
									href: relatedProjectsUrl(service.categorySlug),
									className: "mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(31,122,70)] transition hover:translate-x-1",
									children: [home.servicesViewProjects, " →"]
								})]
							})
						})
					})]
				}, service.number);
			})
		})]
	});
}
function Testimonials({ testimonials, home }) {
	const items = testimonials ?? [];
	const count = items.length;
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const touchStartX = useRef(null);
	useEffect(() => {
		if (count <= 1 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => {
			setIndex((current) => (current + 1) % count);
		}, 6e3);
		return () => window.clearInterval(timer);
	}, [count, paused]);
	if (count === 0) return null;
	const goTo = (nextIndex) => {
		setIndex((nextIndex % count + count) % count);
	};
	const active = items[index];
	return /* @__PURE__ */ jsxs("section", {
		className: "px-5 pb-24 pt-10 text-center md:px-10 md:pb-[130px]",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocusCapture: () => setPaused(true),
		onBlurCapture: (event) => {
			if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mono-label mb-8 md:mb-9",
				"data-reveal": "0",
				children: [
					"( ",
					home.testimonialEyebrow,
					" )"
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto max-w-[980px]",
				"data-reveal": "100",
				onTouchStart: (event) => {
					touchStartX.current = event.changedTouches[0]?.clientX ?? null;
				},
				onTouchEnd: (event) => {
					if (count <= 1 || touchStartX.current === null) return;
					const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
					touchStartX.current = null;
					if (Math.abs(delta) < 40) return;
					goTo(index + (delta < 0 ? 1 : -1));
				},
				children: [/* @__PURE__ */ jsxs("blockquote", {
					className: "animate-[fadeIn_500ms_ease] text-[clamp(28px,3.6vw,52px)] leading-[1.25] text-[rgb(27,28,26)] [text-wrap:balance]",
					children: [
						"“",
						active.quote,
						"”"
					]
				}, active.id), /* @__PURE__ */ jsxs("div", {
					className: "mt-8 text-[13px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)]",
					children: ["— ", active.attribution]
				})]
			}),
			count > 1 && /* @__PURE__ */ jsxs("div", {
				className: "mt-10 flex items-center justify-center gap-4 md:mt-12",
				"data-reveal": "200",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => goTo(index - 1),
						className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] text-sm transition hover:border-[rgb(27,28,26)] hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]",
						"aria-label": "Testimoni sebelumnya",
						children: "←"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2",
						children: items.map((item, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => goTo(i),
							className: `h-2 rounded-full transition ${i === index ? "w-6 bg-[rgb(31,122,70)]" : "w-2 bg-[rgba(27,28,26,0.2)] hover:bg-[rgba(27,28,26,0.4)]"}`,
							"aria-label": `Testimoni ${i + 1}`,
							"aria-current": i === index
						}, item.id))
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => goTo(index + 1),
						className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] text-sm transition hover:border-[rgb(27,28,26)] hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]",
						"aria-label": "Testimoni berikutnya",
						children: "→"
					})
				]
			})
		]
	});
}
function Home({ hero, home, featured, marqueeText, services, testimonials }) {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	useParallax(containerRef);
	useEffect(() => {
		if (window.location.hash === "#services") document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
	}, []);
	return /* @__PURE__ */ jsxs("main", {
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Seo, {
				title: hero.pageTitle,
				description: hero.metaDescription,
				image: hero.coverImage,
				preloadImage: true
			}),
			/* @__PURE__ */ jsx(Hero, { hero }),
			/* @__PURE__ */ jsx(Marquee, { text: marqueeText }),
			/* @__PURE__ */ jsx(FeaturedWork, {
				featured,
				home
			}),
			/* @__PURE__ */ jsx(Services, {
				services,
				home
			}),
			/* @__PURE__ */ jsx(Testimonials, {
				testimonials,
				home
			})
		]
	});
}
Home.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/Components/ProcessSteps.jsx
function ProcessSteps({ steps, className = "" }) {
	if (!steps?.length) return null;
	return /* @__PURE__ */ jsx("ol", {
		className: `divide-y divide-[rgba(27,28,26,0.12)] ${className}`,
		children: steps.map((step, i) => /* @__PURE__ */ jsxs("li", {
			className: "grid grid-cols-[minmax(56px,88px)_1fr] gap-5 py-9 md:grid-cols-[minmax(96px,140px)_1fr] md:gap-10 md:py-12",
			"data-reveal": i * 70,
			children: [/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				className: "pt-1 font-mono text-[clamp(36px,6vw,72px)] font-semibold leading-none tracking-[-0.05em] text-[rgba(27,28,26,0.12)]",
				children: step.step
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-[clamp(22px,3.2vw,38px)] font-semibold uppercase leading-[1.05] tracking-[-0.025em] [text-wrap:balance]",
					children: step.title
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.62)] md:text-[16px]",
					children: step.description
				})]
			})]
		}, step.step))
	});
}
//#endregion
//#region resources/js/Pages/Kontak.jsx
var Kontak_exports = /* @__PURE__ */ __exportAll({ default: () => Kontak });
function Kontak({ content, recentProjects }) {
	const { props } = usePage();
	const { settings } = props;
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	const labels = content.labels ?? {};
	const prepareItems = content.prepareItems ?? [];
	const processSteps = content.processSteps ?? [];
	return /* @__PURE__ */ jsxs("main", {
		className: "px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-[170px]",
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Seo, {
				title: content.pageTitle,
				description: content.subheading || void 0,
				image: content.pageImage || void 0
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative overflow-hidden rounded-sm bg-[rgb(27,28,26)] px-6 py-14 text-[rgb(243,243,240)] md:px-12 md:py-20",
				"data-reveal": "0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 max-w-[900px]",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "mono-label text-[rgba(243,243,240,0.45)]",
							children: [
								"( ",
								content.eyebrow,
								" )"
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "m-0 mt-5 max-w-[14ch] text-[clamp(40px,7vw,96px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]",
							children: content.heading
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-6 max-w-[480px] text-base leading-relaxed text-[rgba(243,243,240,0.65)] md:text-[17px]",
							children: content.subheading
						}),
						/* @__PURE__ */ jsx(WhatsAppButton, {
							source: "/kontak-hero",
							className: "mt-10 inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[rgb(31,122,70)] px-9 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:scale-[1.02] hover:bg-[rgb(243,243,240)] hover:text-[rgb(27,28,26)] sm:w-auto sm:max-w-none",
							children: content.ctaLabel
						})
					]
				}), /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[rgba(31,122,70,0.15)] blur-3xl" })]
			}),
			(content.responseTime || content.serviceArea) && /* @__PURE__ */ jsxs("section", {
				className: "mt-10 grid grid-cols-1 gap-6 border-b border-[rgba(27,28,26,0.12)] pb-12 md:mt-14 md:grid-cols-2 md:gap-10 md:pb-16",
				children: [content.responseTime && /* @__PURE__ */ jsxs("div", {
					"data-reveal": "60",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mono-label mb-3",
						children: [
							"( ",
							labels.responseTime,
							" )"
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "m-0 text-[17px] leading-[1.6] text-[rgba(27,28,26,0.75)]",
						children: content.responseTime
					})]
				}), content.serviceArea && /* @__PURE__ */ jsxs("div", {
					"data-reveal": "120",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mono-label mb-3",
						children: [
							"( ",
							labels.serviceArea,
							" )"
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "m-0 text-[17px] leading-[1.6] text-[rgba(27,28,26,0.75)]",
						children: content.serviceArea
					})]
				})]
			}),
			prepareItems.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-12 md:mt-16",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mono-label mb-8",
					"data-reveal": "0",
					children: [
						"( ",
						labels.prepare,
						" )"
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-16 md:gap-y-10",
					children: prepareItems.map((item, i) => /* @__PURE__ */ jsxs("div", {
						className: "group border-t border-[rgba(27,28,26,0.12)] pt-6",
						"data-reveal": i * 60,
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mb-2 font-mono text-[13px] text-[rgb(31,122,70)]",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "m-0 text-xl font-semibold uppercase tracking-[-0.01em] transition group-hover:text-[rgb(31,122,70)] md:text-2xl",
								children: item.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 text-[15px] leading-[1.6] text-[rgba(27,28,26,0.6)]",
								children: item.description
							})
						]
					}, item.title))
				})]
			}),
			content.pageImage && /* @__PURE__ */ jsx("section", {
				className: "mt-14 md:mt-20",
				"data-reveal": "0",
				children: /* @__PURE__ */ jsx("div", {
					className: "relative overflow-hidden rounded-sm",
					children: /* @__PURE__ */ jsx(OptimizedImage, {
						src: content.pageImage,
						srcSet: content.pageImageSrcSet,
						alt: content.heading,
						className: "aspect-[16/9] w-full object-cover md:aspect-[21/9]",
						sizes: "100vw",
						loading: "lazy"
					})
				})
			}),
			processSteps.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-14 md:mt-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mono-label mb-8 md:mb-10",
					"data-reveal": "0",
					children: [
						"( ",
						labels.process,
						" )"
					]
				}), /* @__PURE__ */ jsx(ProcessSteps, { steps: processSteps })]
			}),
			recentProjects.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-14 md:mt-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					"data-reveal": "0",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "mono-label",
						children: [
							"( ",
							labels.recentWork,
							" )"
						]
					}), settings.instagramUrl && /* @__PURE__ */ jsxs("a", {
						href: settings.instagramUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-sm font-semibold uppercase tracking-[0.06em] transition hover:text-[rgb(31,122,70)]",
						children: [labels.followInstagram, " ↗"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4",
					children: recentProjects.map((project, i) => /* @__PURE__ */ jsx(Link, {
						href: route("projects.show", project.slug),
						className: "group overflow-hidden rounded-sm",
						"data-reveal": i * 50,
						children: project.coverImage ? /* @__PURE__ */ jsx(OptimizedImage, {
							src: project.coverImage,
							srcSet: project.coverSrcSet,
							sizes: "(min-width: 768px) 33vw, 50vw",
							alt: project.caption,
							className: "aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]",
							loading: "lazy"
						}) : /* @__PURE__ */ jsx(Placeholder, {
							caption: project.caption,
							className: "aspect-[4/5] transition duration-500 group-hover:scale-[1.03]"
						})
					}, project.slug))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-14 flex flex-col gap-10 border-t border-[rgba(27,28,26,0.12)] pt-12 md:mt-20 md:flex-row md:justify-between md:gap-20 md:pt-16",
				children: [
					/* @__PURE__ */ jsxs("div", {
						"data-reveal": "0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]",
							children: labels.address
						}), /* @__PURE__ */ jsx("div", {
							className: "text-base font-medium",
							children: settings.address
						})]
					}),
					settings.instagramUrl && /* @__PURE__ */ jsxs("div", {
						"data-reveal": "60",
						children: [/* @__PURE__ */ jsx("div", {
							className: "mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]",
							children: labels.instagram
						}), /* @__PURE__ */ jsxs("a", {
							href: settings.instagramUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-base font-medium transition hover:text-[rgb(31,122,70)]",
							children: [labels.instagram, " ↗"]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						"data-reveal": "120",
						children: /* @__PURE__ */ jsx(WhatsAppButton, {
							source: "/kontak-footer",
							className: "inline-flex w-full max-w-sm items-center justify-center rounded-full border border-[rgba(27,28,26,0.3)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)] sm:w-auto sm:max-w-none",
							children: content.ctaLabel
						})
					})
				]
			})
		]
	});
}
Kontak.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/Pages/Layanan.jsx
var Layanan_exports = /* @__PURE__ */ __exportAll({ default: () => Layanan });
function Layanan({ services }) {
	const { props } = usePage();
	const { t } = props;
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	return /* @__PURE__ */ jsxs("main", {
		className: "px-5 pb-10 pt-36 md:px-10 md:pt-[170px]",
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Head, { title: t.nav.services }),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8",
				"data-reveal": "0",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "mono-label",
					children: [
						"( ",
						t.layanan.eyebrow,
						" )"
					]
				}), /* @__PURE__ */ jsx("h1", {
					className: "m-0 mt-5 max-w-[12ch] text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]",
					children: t.layanan.heading
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col",
				children: services.map((service, i) => /* @__PURE__ */ jsxs("div", {
					className: "group grid cursor-default grid-cols-[48px_1fr] gap-4 border-t border-[rgba(27,28,26,0.12)] px-2 py-7 transition hover:bg-[rgb(236,236,232)] md:grid-cols-[80px_1fr] md:gap-6 md:py-9",
					"data-reveal": i * 70,
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-[13px] text-[rgb(31,122,70)]",
						children: service.number
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-3 text-[clamp(22px,2.5vw,36px)] font-semibold uppercase tracking-[-0.02em] transition group-hover:translate-x-1",
						children: service.name
					}), /* @__PURE__ */ jsx("p", {
						className: "m-0 max-w-[560px] text-[15px] leading-[1.65] text-[rgba(27,28,26,0.6)]",
						children: service.detail
					})] })]
				}, service.number))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-16 text-center md:mt-20",
				"data-reveal": "0",
				children: /* @__PURE__ */ jsxs(Link, {
					href: route("kontak"),
					className: "inline-block rounded-full border border-[rgba(27,28,26,0.3)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-[rgb(27,28,26)] hover:text-[rgb(243,243,240)]",
					children: [t.nav.contact, " →"]
				})
			})
		]
	});
}
Layanan.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/Pages/Projects/Index.jsx
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => ProjectsIndex });
function ProjectsIndex({ projects, filters, activeCategory, meta, labels }) {
	const containerRef = useRef(null);
	const projectSignature = (projects.data ?? []).map((project) => project.slug).join("|");
	useScrollReveal(containerRef, [
		activeCategory,
		projects.current_page,
		projectSignature
	]);
	useParallax(containerRef);
	const pickFilter = (slug) => {
		router.get(route("projects.index"), slug ? { category: slug } : {}, {
			preserveState: true,
			preserveScroll: false,
			replace: true
		});
	};
	const pageLinks = (projects.links ?? []).filter((link) => link.url !== null && !link.label.includes("Previous") && !link.label.includes("Next"));
	return /* @__PURE__ */ jsxs("main", {
		className: "px-5 pb-10 pt-36 md:px-10 md:pt-[170px]",
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Seo, {
				title: labels.pageTitle,
				description: labels.pageDescription || (labels.heading && labels.headingAccent ? `${labels.heading} ${labels.headingAccent} — Elevasi Design & Build.` : void 0)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(27,28,26,0.12)] pb-8",
				"data-reveal": "0",
				children: [/* @__PURE__ */ jsxs("h1", {
					className: "m-0 max-w-[12ch] text-[clamp(56px,8vw,132px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]",
					children: [
						labels.heading,
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "serif-italic",
							children: labels.headingAccent
						})
					]
				}), /* @__PURE__ */ jsxs("span", {
					className: "font-mono text-[13px] text-[rgba(27,28,26,0.5)]",
					children: [
						"( ",
						String(meta.total).padStart(2, "0"),
						" )"
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2.5 py-7 pb-12",
				"data-reveal": "80",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `inline-block rounded-full border px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.05em] transition ${!activeCategory ? "border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : "border-[rgba(27,28,26,0.25)] hover:border-[rgba(27,28,26,0.5)]"}`,
					onClick: () => pickFilter(null),
					children: [
						labels.allFilter,
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "font-mono text-[11px] opacity-55",
							children: [
								"(",
								meta.all,
								")"
							]
						})
					]
				}), filters.map((f) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: `inline-block rounded-full border px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.05em] transition ${activeCategory === f.slug ? "border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : "border-[rgba(27,28,26,0.25)] hover:border-[rgba(27,28,26,0.5)]"}`,
					onClick: () => pickFilter(f.slug),
					children: [
						f.name,
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "font-mono text-[11px] opacity-55",
							children: [
								"(",
								f.count,
								")"
							]
						})
					]
				}, f.slug))]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-[26px]",
				children: projects.data.map((project, i) => /* @__PURE__ */ jsxs(Link, {
					href: route("projects.show", project.slug),
					className: "group block",
					"data-reveal": i % 3 * 80,
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-[2px]",
							children: project.coverImage ? /* @__PURE__ */ jsx(OptimizedImage, {
								src: project.coverImage,
								srcSet: project.coverSrcSet,
								sizes: "(min-width: 768px) 33vw, 100vw",
								alt: project.caption || project.title,
								className: "aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]",
								loading: i < 3 ? "eager" : "lazy"
							}) : /* @__PURE__ */ jsx(Placeholder, {
								caption: project.caption,
								parallax: .05,
								className: "aspect-[4/3] transition duration-500 group-hover:scale-[1.015]",
								size: "xs"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between px-0.5 pb-0 pt-3.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[17px] font-semibold transition group-hover:text-[rgb(31,122,70)]",
								children: project.title
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[11px] uppercase text-[rgba(27,28,26,0.5)]",
								children: project.year
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "px-0.5 pt-1 text-[12.5px] uppercase tracking-[0.04em] text-[rgba(27,28,26,0.5)]",
							children: [
								project.category,
								" — ",
								project.location,
								project.area ? ` — ${project.area}` : ""
							]
						})
					]
				}, project.slug))
			}),
			projects.data.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "py-20 text-center text-[rgba(27,28,26,0.5)]",
				"data-reveal": "0",
				children: labels.empty
			}),
			projects.last_page > 1 && /* @__PURE__ */ jsxs("nav", {
				className: "flex items-center justify-center gap-2 pb-14 pt-16 font-mono text-[13px]",
				"data-reveal": "0",
				"aria-label": "Pagination",
				children: [
					projects.prev_page_url ? /* @__PURE__ */ jsx(Link, {
						href: projects.prev_page_url,
						className: "pr-2 text-[rgba(27,28,26,0.6)] transition hover:text-[rgb(31,122,70)]",
						"aria-label": "Previous page",
						children: "←"
					}) : /* @__PURE__ */ jsx("span", {
						className: "pr-2 text-[rgba(27,28,26,0.2)]",
						"aria-hidden": "true",
						children: "←"
					}),
					pageLinks.map((link) => /* @__PURE__ */ jsx(Link, {
						href: link.url,
						"aria-current": link.active ? "page" : void 0,
						className: `h-[38px] w-[38px] rounded-full border text-center leading-[38px] transition ${link.active ? "border-[rgb(27,28,26)] bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : "border-[rgba(27,28,26,0.2)] text-[rgba(27,28,26,0.6)] hover:border-[rgba(27,28,26,0.5)]"}`,
						preserveScroll: false,
						dangerouslySetInnerHTML: { __html: link.label }
					}, link.label)),
					projects.next_page_url ? /* @__PURE__ */ jsx(Link, {
						href: projects.next_page_url,
						className: "pl-2 text-[rgba(27,28,26,0.6)] transition hover:text-[rgb(31,122,70)]",
						"aria-label": "Next page",
						children: "→"
					}) : /* @__PURE__ */ jsx("span", {
						className: "pl-2 text-[rgba(27,28,26,0.2)]",
						"aria-hidden": "true",
						children: "→"
					})
				]
			})
		]
	});
}
ProjectsIndex.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/Components/ImageLightbox.jsx
var SWIPE_THRESHOLD = 48;
var MIN_SCALE = 1;
var MAX_SCALE = 4;
var DOUBLE_TAP_MS = 300;
var DOUBLE_TAP_ZOOM = 2.5;
function resolvePreviewSrc(image) {
	return image?.fullUrl || image?.url || null;
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function touchDistance(touches) {
	const [first, second] = touches;
	const dx = first.clientX - second.clientX;
	const dy = first.clientY - second.clientY;
	return Math.hypot(dx, dy);
}
function clampPan(scale, x, y, width, height) {
	if (scale <= 1) return {
		x: 0,
		y: 0
	};
	const maxX = (scale - 1) * width / 2;
	const maxY = (scale - 1) * height / 2;
	return {
		x: clamp(x, -maxX, maxX),
		y: clamp(y, -maxY, maxY)
	};
}
function ImageLightbox({ images, index, onClose, onNavigate }) {
	const labelId = useId();
	const scrollLockY = useRef(0);
	const viewportRef = useRef(null);
	const lastTapRef = useRef(0);
	const gestureRef = useRef({
		mode: null,
		pinchStartDistance: 0,
		pinchStartScale: 1,
		panStartX: 0,
		panStartY: 0,
		panOriginX: 0,
		panOriginY: 0,
		swipeStartX: null
	});
	const [isMounted, setIsMounted] = useState(false);
	const [isImageReady, setIsImageReady] = useState(false);
	const [zoom, setZoom] = useState({
		scale: 1,
		x: 0,
		y: 0
	});
	const [isGesturing, setIsGesturing] = useState(false);
	const { locale } = usePage().props;
	const isOpen = index !== null;
	const current = isOpen ? images[index] : null;
	const previewSrc = resolvePreviewSrc(current);
	const isZoomed = zoom.scale > 1.01;
	const showPrevious = useCallback(() => {
		onNavigate((index - 1 + images.length) % images.length);
	}, [
		index,
		images.length,
		onNavigate
	]);
	const showNext = useCallback(() => {
		onNavigate((index + 1) % images.length);
	}, [
		index,
		images.length,
		onNavigate
	]);
	const resetZoom = useCallback(() => {
		setZoom({
			scale: 1,
			x: 0,
			y: 0
		});
		gestureRef.current.mode = null;
		gestureRef.current.swipeStartX = null;
	}, []);
	const applyZoom = useCallback((getNext) => {
		setZoom((prev) => {
			const viewport = viewportRef.current;
			const width = viewport?.clientWidth ?? 0;
			const height = viewport?.clientHeight ?? 0;
			const raw = typeof getNext === "function" ? getNext(prev) : getNext;
			const scale = clamp(raw.scale, MIN_SCALE, MAX_SCALE);
			if (scale <= 1) return {
				scale: 1,
				x: 0,
				y: 0
			};
			const pan = clampPan(scale, raw.x ?? prev.x, raw.y ?? prev.y, width, height);
			return {
				scale,
				x: pan.x,
				y: pan.y
			};
		});
	}, []);
	const toggleDoubleTapZoom = useCallback(() => {
		setZoom((prev) => {
			if (prev.scale > 1.01) return {
				scale: 1,
				x: 0,
				y: 0
			};
			return {
				scale: DOUBLE_TAP_ZOOM,
				x: 0,
				y: 0
			};
		});
	}, []);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	useEffect(() => {
		if (!isOpen || !previewSrc) {
			setIsImageReady(false);
			return;
		}
		resetZoom();
		setIsImageReady(false);
		let cancelled = false;
		const loader = new Image();
		loader.decoding = "async";
		loader.src = previewSrc;
		if (loader.complete) setIsImageReady(true);
		loader.onload = () => {
			if (!cancelled) setIsImageReady(true);
		};
		loader.onerror = () => {
			if (!cancelled) setIsImageReady(true);
		};
		return () => {
			cancelled = true;
		};
	}, [
		isOpen,
		previewSrc,
		resetZoom
	]);
	useEffect(() => {
		if (!isOpen) return;
		[(index - 1 + images.length) % images.length, (index + 1) % images.length].forEach((neighborIndex) => {
			const src = resolvePreviewSrc(images[neighborIndex]);
			if (!src) return;
			const img = new Image();
			img.decoding = "async";
			img.src = src;
		});
	}, [
		images,
		index,
		isOpen
	]);
	useEffect(() => {
		if (!isOpen) return;
		scrollLockY.current = window.scrollY;
		const { style: bodyStyle } = document.body;
		const { style: htmlStyle } = document.documentElement;
		const previous = {
			bodyPosition: bodyStyle.position,
			bodyTop: bodyStyle.top,
			bodyWidth: bodyStyle.width,
			bodyOverflow: bodyStyle.overflow,
			htmlOverflow: htmlStyle.overflow
		};
		bodyStyle.position = "fixed";
		bodyStyle.top = `-${scrollLockY.current}px`;
		bodyStyle.width = "100%";
		bodyStyle.overflow = "hidden";
		htmlStyle.overflow = "hidden";
		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				if (isZoomed) {
					resetZoom();
					return;
				}
				onClose();
			} else if (!isZoomed && event.key === "ArrowLeft") showPrevious();
			else if (!isZoomed && event.key === "ArrowRight") showNext();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			bodyStyle.position = previous.bodyPosition;
			bodyStyle.top = previous.bodyTop;
			bodyStyle.width = previous.bodyWidth;
			bodyStyle.overflow = previous.bodyOverflow;
			htmlStyle.overflow = previous.htmlOverflow;
			window.scrollTo(0, scrollLockY.current);
		};
	}, [
		isOpen,
		isZoomed,
		onClose,
		resetZoom,
		showNext,
		showPrevious
	]);
	useEffect(() => {
		const viewport = viewportRef.current;
		if (!isOpen || !viewport) return;
		const onWheel = (event) => {
			event.preventDefault();
			event.stopPropagation();
			const delta = -event.deltaY * .0025;
			applyZoom((prev) => ({
				scale: prev.scale + delta,
				x: prev.x,
				y: prev.y
			}));
		};
		viewport.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			viewport.removeEventListener("wheel", onWheel);
		};
	}, [applyZoom, isOpen]);
	const onTouchStart = (event) => {
		const touches = event.touches;
		if (touches.length === 2) {
			setIsGesturing(true);
			gestureRef.current.mode = "pinch";
			gestureRef.current.pinchStartDistance = touchDistance(touches);
			gestureRef.current.pinchStartScale = zoom.scale;
			gestureRef.current.swipeStartX = null;
			return;
		}
		if (touches.length !== 1) return;
		const touch = touches[0];
		if (isZoomed) {
			setIsGesturing(true);
			gestureRef.current.mode = "pan";
			gestureRef.current.panStartX = touch.clientX;
			gestureRef.current.panStartY = touch.clientY;
			gestureRef.current.panOriginX = zoom.x;
			gestureRef.current.panOriginY = zoom.y;
			gestureRef.current.swipeStartX = null;
			return;
		}
		gestureRef.current.mode = "swipe";
		gestureRef.current.swipeStartX = touch.clientX;
	};
	const onTouchMove = (event) => {
		const touches = event.touches;
		const gesture = gestureRef.current;
		if (gesture.mode === "pinch" && touches.length === 2) {
			event.preventDefault();
			const distance = touchDistance(touches);
			if (gesture.pinchStartDistance <= 0) return;
			const nextScale = gesture.pinchStartScale * (distance / gesture.pinchStartDistance);
			applyZoom((prev) => ({
				scale: nextScale,
				x: prev.x,
				y: prev.y
			}));
			return;
		}
		if (gesture.mode === "pan" && touches.length === 1) {
			event.preventDefault();
			const touch = touches[0];
			const deltaX = touch.clientX - gesture.panStartX;
			const deltaY = touch.clientY - gesture.panStartY;
			applyZoom((prev) => ({
				scale: prev.scale,
				x: gesture.panOriginX + deltaX,
				y: gesture.panOriginY + deltaY
			}));
		}
	};
	const onTouchEnd = (event) => {
		const gesture = gestureRef.current;
		if (gesture.mode === "pinch" || gesture.mode === "pan") {
			if (event.touches.length === 0) {
				gesture.mode = null;
				setIsGesturing(false);
				setZoom((prev) => prev.scale < 1.05 ? {
					scale: 1,
					x: 0,
					y: 0
				} : prev);
			}
			return;
		}
		if (gesture.mode !== "swipe" || gesture.swipeStartX === null) return;
		const touch = event.changedTouches[0];
		const now = Date.now();
		const deltaX = touch.clientX - gesture.swipeStartX;
		gesture.swipeStartX = null;
		gesture.mode = null;
		if (now - lastTapRef.current < DOUBLE_TAP_MS && Math.abs(deltaX) < 12) {
			lastTapRef.current = 0;
			toggleDoubleTapZoom();
			return;
		}
		lastTapRef.current = now;
		if (images.length < 2 || Math.abs(deltaX) < SWIPE_THRESHOLD) return;
		if (deltaX < 0) showNext();
		else showPrevious();
	};
	if (!isMounted || !isOpen || !current || !previewSrc) return null;
	const hasMultiple = images.length > 1;
	const controlClass = "flex items-center justify-center rounded-full border border-[rgba(243,243,240,0.22)] bg-[rgba(27,28,26,0.62)] text-[rgb(243,243,240)] backdrop-blur-sm transition active:scale-95 active:bg-[rgba(27,28,26,0.85)] touch-manipulation";
	const stopClose = (event) => {
		event.stopPropagation();
	};
	const handleNavClick = (event, action) => {
		event.stopPropagation();
		resetZoom();
		action();
	};
	const zoomHint = locale === "id" ? "Cubit / ketuk 2x untuk zoom" : "Pinch / double-tap to zoom";
	const swipeHint = locale === "id" ? "Geser untuk ganti foto" : "Swipe to change photo";
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[200] flex flex-col overscroll-none bg-[rgba(12,12,11,0.96)] backdrop-blur-md",
		style: {
			paddingTop: "env(safe-area-inset-top)",
			paddingBottom: "env(safe-area-inset-bottom)"
		},
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": labelId,
		onClick: onClose,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex h-11 shrink-0 items-center justify-end px-3 sm:h-16 sm:px-8",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: `${controlClass} h-10 w-10 text-2xl leading-none sm:h-11 sm:w-11`,
					onClick: (event) => {
						event.stopPropagation();
						onClose();
					},
					"aria-label": "Close image",
					children: "×"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto flex min-h-0 w-full max-w-[min(100vw,1400px)] flex-1 items-center justify-center px-1 sm:px-20",
				children: [
					hasMultiple && !isZoomed ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `${controlClass} absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 text-xl sm:left-6 sm:flex`,
						onClick: (event) => handleNavClick(event, showPrevious),
						"aria-label": "Previous image",
						children: "←"
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						ref: viewportRef,
						className: "flex h-full w-full touch-none items-center justify-center overflow-hidden",
						onClick: stopClose,
						onDoubleClick: (event) => {
							event.stopPropagation();
							toggleDoubleTapZoom();
						},
						onTouchStart: (event) => {
							event.stopPropagation();
							onTouchStart(event);
						},
						onTouchMove: (event) => {
							event.stopPropagation();
							onTouchMove(event);
						},
						onTouchEnd: (event) => {
							event.stopPropagation();
							onTouchEnd(event);
						},
						children: [!isImageReady ? /* @__PURE__ */ jsx("div", {
							className: "pointer-events-none absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ jsx("div", { className: "pointer-events-auto h-9 w-9 animate-spin rounded-full border-2 border-[rgba(243,243,240,0.2)] border-t-[rgba(243,243,240,0.85)]" })
						}) : null, /* @__PURE__ */ jsx("img", {
							src: previewSrc,
							alt: current.label,
							draggable: false,
							decoding: "async",
							className: `max-h-[min(86dvh,92vh)] max-w-full select-none object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)] will-change-transform sm:max-h-[min(72vh,780px)] ${isImageReady ? "opacity-100" : "opacity-0"} ${isGesturing ? "" : "transition-transform duration-200 ease-out"}`,
							style: { transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})` }
						})]
					}),
					hasMultiple && !isZoomed ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `${controlClass} absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 text-xl sm:right-6 sm:flex`,
						onClick: (event) => handleNavClick(event, showNext),
						"aria-label": "Next image",
						children: "→"
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-center sm:px-4 sm:pb-5",
				children: [
					/* @__PURE__ */ jsxs("p", {
						id: labelId,
						className: "mx-auto mb-2 max-w-2xl px-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[rgba(243,243,240,0.7)] sm:mb-1 sm:text-[11px]",
						children: [current.label, hasMultiple ? /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: ` · ${index + 1} / ${images.length}`
						}) : null]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-3 font-mono text-[9px] uppercase tracking-[0.08em] text-[rgba(243,243,240,0.4)] sm:mb-2",
						children: isZoomed ? locale === "id" ? "Geser untuk geser foto · Esc untuk reset zoom" : "Drag to pan · Esc to reset zoom" : `${zoomHint}${hasMultiple ? ` · ${swipeHint}` : ""}`
					}),
					isZoomed ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: `${controlClass} mx-auto mb-2 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.08em] sm:hidden`,
						onClick: (event) => {
							event.stopPropagation();
							resetZoom();
						},
						children: locale === "id" ? "Reset zoom" : "Reset zoom"
					}) : null,
					hasMultiple && !isZoomed ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-3 sm:hidden",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: `${controlClass} h-12 w-12 shrink-0 text-lg`,
								onClick: (event) => handleNavClick(event, showPrevious),
								"aria-label": "Previous image",
								children: "←"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "min-w-0 flex-1 text-center",
								children: /* @__PURE__ */ jsxs("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.1em] text-[rgba(243,243,240,0.75)]",
									children: [
										index + 1,
										" / ",
										images.length
									]
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: `${controlClass} h-12 w-12 shrink-0 text-lg`,
								onClick: (event) => handleNavClick(event, showNext),
								"aria-label": "Next image",
								children: "→"
							})
						]
					}) : null
				]
			})
		]
	}), document.body);
}
//#endregion
//#region resources/js/Pages/Projects/Show.jsx
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => ProjectShow });
function ProjectShow({ project, gallery, next, labels }) {
	const containerRef = useRef(null);
	const [lightboxIndex, setLightboxIndex] = useState(null);
	useScrollReveal(containerRef);
	useParallax(containerRef);
	const lightboxImages = useMemo(() => [project.coverImage ? {
		url: project.coverImage,
		srcSet: project.coverSrcSet,
		fullUrl: project.coverFullUrl || project.coverImage,
		label: project.coverCaption || project.title
	} : null, ...gallery.filter((item) => item.url)].filter(Boolean), [
		gallery,
		project.coverCaption,
		project.coverFullUrl,
		project.coverImage,
		project.coverSrcSet,
		project.title
	]);
	const metaItems = [
		{
			label: labels.category,
			value: project.category
		},
		project.client ? {
			label: labels.client,
			value: project.client
		} : null,
		{
			label: labels.location,
			value: project.location
		},
		{
			label: labels.yearCompleted,
			value: project.year
		},
		{
			label: labels.scope,
			value: project.scope
		},
		project.area ? {
			label: labels.area,
			value: project.area
		} : null
	].filter(Boolean);
	const seoDescription = [project.description1, project.description2].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 160);
	return /* @__PURE__ */ jsxs("main", {
		className: "px-5 pb-10 pt-36 md:px-10 md:pt-[170px]",
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Seo, {
				title: project.title,
				description: seoDescription || void 0,
				image: project.coverImage || void 0,
				type: "article",
				preloadImage: Boolean(project.coverImage)
			}),
			/* @__PURE__ */ jsxs(Link, {
				href: route("projects.index"),
				className: "font-mono text-xs uppercase tracking-[0.08em] text-[rgba(27,28,26,0.55)] transition hover:text-[rgb(31,122,70)]",
				"data-reveal": "0",
				children: ["← ", labels.allProjects]
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mb-8 mt-7 max-w-[12ch] text-[clamp(52px,7.5vw,124px)] font-semibold uppercase leading-[0.98] tracking-[-0.035em] md:mb-10",
				"data-reveal": "80",
				children: project.title
			}),
			/* @__PURE__ */ jsx("div", {
				className: `mb-10 grid grid-cols-2 gap-4 border-y border-[rgba(27,28,26,0.12)] py-6 md:gap-6 ${metaItems.length > 4 ? "md:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-4"}`,
				"data-reveal": "160",
				children: metaItems.map((item) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]",
					children: item.label
				}), /* @__PURE__ */ jsx("div", {
					className: "text-[15px] font-medium",
					children: item.value
				})] }, item.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mb-6 overflow-hidden rounded-sm md:mb-7",
				"data-reveal": "0",
				"data-reveal-variant": "clip",
				children: [project.coverImage ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "group block w-full cursor-zoom-in touch-manipulation text-left active:opacity-90",
					onClick: () => setLightboxIndex(0),
					"aria-label": `View ${project.coverCaption || project.title}`,
					children: /* @__PURE__ */ jsx(OptimizedImage, {
						src: project.coverImage,
						srcSet: project.coverSrcSet,
						sizes: "100vw",
						alt: project.coverCaption || project.title,
						className: "h-[56vh] w-full object-cover transition duration-500 group-hover:scale-[1.01] md:h-[74vh]",
						loading: "eager",
						fetchPriority: "high"
					})
				}) : /* @__PURE__ */ jsx(Placeholder, {
					caption: `cover — ${project.coverCaption}`,
					parallax: .12,
					className: "h-[56vh] md:h-[74vh]"
				}), /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(27,28,26,0.12)] via-transparent to-transparent" })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-8 py-10 md:grid-cols-[1fr_1.4fr] md:gap-[60px] md:py-[50px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mono-label",
					"data-reveal": "0",
					children: [
						"( ",
						labels.aboutProject,
						" )"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "max-w-[640px] text-lg leading-[1.65] text-[rgba(27,28,26,0.8)] [text-wrap:pretty] md:text-[19px]",
					"data-reveal": "100",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "mb-5",
							children: project.description1
						}),
						project.description2 ? /* @__PURE__ */ jsx("p", {
							className: "mb-8",
							children: project.description2
						}) : null,
						(labels.ctaLabel || labels.ctaNote) && /* @__PURE__ */ jsxs("div", {
							className: "border-t border-[rgba(27,28,26,0.12)] pt-8",
							children: [labels.ctaNote ? /* @__PURE__ */ jsx("p", {
								className: "mb-5 text-base leading-relaxed text-[rgba(27,28,26,0.65)] md:text-[17px]",
								children: labels.ctaNote
							}) : null, labels.ctaLabel ? /* @__PURE__ */ jsx(WhatsAppButton, {
								source: "project-detail",
								className: "inline-flex items-center rounded-full border border-[rgb(27,28,26)] bg-[rgb(27,28,26)] px-6 py-3 text-[13px] font-medium uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(31,122,70)] hover:border-[rgb(31,122,70)]",
								children: labels.ctaLabel
							}) : null]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[26px]",
				children: gallery.map((g, i) => {
					const lightboxOffset = project.coverImage ? 1 : 0;
					return /* @__PURE__ */ jsx("div", {
						className: "group overflow-hidden rounded-[2px]",
						"data-reveal": i % 2 * 90,
						style: { gridColumn: i === 0 ? "1 / -1" : "auto" },
						children: g.url ? /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "block w-full cursor-zoom-in touch-manipulation text-left active:opacity-90",
							onClick: () => setLightboxIndex(lightboxOffset + i),
							"aria-label": `View ${g.label}`,
							children: /* @__PURE__ */ jsx(OptimizedImage, {
								src: g.url,
								srcSet: g.srcSet,
								sizes: i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw",
								alt: g.label,
								className: "aspect-[var(--ratio)] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]",
								style: { "--ratio": i === 0 ? "16 / 8" : "4 / 3" },
								loading: "lazy"
							})
						}) : /* @__PURE__ */ jsx(Placeholder, {
							caption: g.label,
							parallax: .06,
							className: "aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]",
							style: { "--ratio": i === 0 ? "16 / 8" : "4 / 3" }
						})
					}, g.label);
				})
			}),
			/* @__PURE__ */ jsx(ImageLightbox, {
				images: lightboxImages,
				index: lightboxIndex,
				onClose: () => setLightboxIndex(null),
				onNavigate: setLightboxIndex
			}),
			next && /* @__PURE__ */ jsxs(Link, {
				href: route("projects.show", next.slug),
				className: "group block py-20 text-center md:py-[120px]",
				"data-reveal": "0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mono-label mb-4",
					children: [
						"( ",
						labels.nextProject,
						" )"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-[clamp(44px,6vw,96px)] font-semibold uppercase tracking-[-0.03em] transition group-hover:text-[rgb(31,122,70)]",
					children: [
						next.title,
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "inline-block transition group-hover:translate-x-2",
							children: "→"
						})
					]
				})]
			})
		]
	});
}
ProjectShow.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/hooks/useCountUp.js
function useCountUp(target, { duration = 1200, enabled = true } = {}) {
	const [value, setValue] = useState(0);
	const ref = useRef(null);
	const hasRun = useRef(false);
	useEffect(() => {
		if (!enabled || hasRun.current) return void 0;
		const node = ref.current;
		if (!node) return void 0;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || hasRun.current) return;
			hasRun.current = true;
			const start = performance.now();
			const tick = (now) => {
				const progress = Math.min((now - start) / duration, 1);
				const eased = 1 - (1 - progress) ** 3;
				setValue(Math.round(target * eased));
				if (progress < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		}, { threshold: .35 });
		observer.observe(node);
		return () => observer.disconnect();
	}, [
		target,
		duration,
		enabled
	]);
	return {
		ref,
		value
	};
}
//#endregion
//#region resources/js/Pages/Tentang.jsx
var Tentang_exports = /* @__PURE__ */ __exportAll({ default: () => Tentang });
function parseStatValue(value) {
	const text = String(value ?? "");
	const match = text.match(/^(\d+)/);
	if (!match) return {
		numeric: null,
		suffix: text,
		display: text
	};
	return {
		numeric: Number.parseInt(match[1], 10),
		suffix: text.slice(match[1].length),
		display: text
	};
}
function StatItem({ value, label }) {
	const parsed = parseStatValue(value);
	const shouldAnimate = parsed.numeric !== null && parsed.numeric <= 100;
	const { ref, value: count } = useCountUp(parsed.numeric ?? 0, { enabled: shouldAnimate });
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "border-t border-[rgba(27,28,26,0.12)] px-2 py-8 md:py-10",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[clamp(40px,6vw,72px)] font-semibold leading-none tracking-[-0.03em]",
			children: shouldAnimate ? `${count}${parsed.suffix}` : parsed.display
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.45)]",
			children: label
		})]
	});
}
function Tentang({ content }) {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	const labels = content.labels ?? {};
	const stats = content.stats ?? [];
	const process = content.process ?? [];
	const values = content.values ?? [];
	return /* @__PURE__ */ jsxs("main", {
		className: "px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-[170px]",
		ref: containerRef,
		children: [
			/* @__PURE__ */ jsx(Seo, {
				title: content.title,
				description: content.manifesto || void 0
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-14 border-b border-[rgba(27,28,26,0.12)] pb-8",
				"data-reveal": "0",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "mono-label",
						children: [
							"( ",
							labels.eyebrow,
							" )"
						]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "m-0 mt-5 max-w-[12ch] text-[clamp(56px,8vw,120px)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]",
						children: content.title
					}),
					content.manifesto && /* @__PURE__ */ jsx("p", {
						className: "mt-8 max-w-[720px] text-[clamp(22px,3vw,36px)] leading-[1.35] tracking-[-0.02em] text-[rgba(27,28,26,0.8)] [text-wrap:balance]",
						children: /* @__PURE__ */ jsx("span", {
							className: "serif-italic",
							children: content.manifesto
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-[720px] text-[17px] leading-[1.7] text-[rgba(27,28,26,0.75)] [text-wrap:pretty] md:text-lg",
				"data-reveal": "100",
				children: (content.body ?? []).map((paragraph, i) => /* @__PURE__ */ jsx("p", {
					className: "mb-6 last:mb-0",
					"data-reveal": 100 + i * 60,
					children: paragraph
				}, i))
			}),
			stats.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "mt-16 md:mt-24",
				"data-reveal": "0",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-x-8 md:grid-cols-4",
					children: stats.map((stat, index) => /* @__PURE__ */ jsx(StatItem, {
						value: stat.value,
						label: stat.label
					}, `${stat.label ?? "stat"}-${index}`))
				})
			}),
			process.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-20 md:mt-28",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-10 grid gap-6 md:mb-14 md:grid-cols-[minmax(0,280px)_1fr] md:items-end md:gap-12",
					"data-reveal": "0",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "mono-label",
						children: [
							"( ",
							labels.process,
							" )"
						]
					}), content.processIntro && /* @__PURE__ */ jsx("p", {
						className: "max-w-[52ch] text-[16px] leading-[1.65] text-[rgba(27,28,26,0.62)] md:text-[17px]",
						children: content.processIntro
					})]
				}), /* @__PURE__ */ jsx(ProcessSteps, { steps: process })]
			}),
			values.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-20 md:mt-28",
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-10 md:mb-14",
					"data-reveal": "0",
					children: /* @__PURE__ */ jsxs("span", {
						className: "mono-label",
						children: [
							"( ",
							labels.values,
							" )"
						]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "divide-y divide-[rgba(27,28,26,0.12)] border-y border-[rgba(27,28,26,0.12)]",
					children: values.map((value, i) => /* @__PURE__ */ jsxs("article", {
						className: "grid gap-3 py-8 md:grid-cols-[minmax(0,34%)_1fr] md:items-start md:gap-x-12 md:gap-y-4 md:py-10",
						"data-reveal": i * 70,
						children: [/* @__PURE__ */ jsx("h3", {
							className: "max-w-[12ch] text-[clamp(26px,3.4vw,40px)] font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-[rgb(31,122,70)] [text-wrap:balance]",
							children: value.title
						}), /* @__PURE__ */ jsx("p", {
							className: "max-w-[52ch] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.62)] md:pt-1 md:text-[16px]",
							children: value.description
						})]
					}, value.title))
				})]
			})
		]
	});
}
Tentang.layout = (page) => /* @__PURE__ */ jsx(SiteLayout, { children: page });
//#endregion
//#region resources/js/route.js
/**
* Wraps Ziggy's route() so every existing call site (e.g. route('projects.index'))
* keeps working unchanged while transparently resolving to the "id."-prefixed
* route when the current page is in the Indonesian locale. Routes are registered
* twice server-side (see routes/web.php) because Laravel's optional route
* parameters only work at the end of a URI, so a single "{locale?}/proyek"
* route can't match a bare "/proyek".
*/
function createLocaleAwareRoute(getLocale, getZiggyConfig) {
	return (name, params, absolute, config) => {
		return route$1(getLocale() === "id" && !name.startsWith("id.") ? `id.${name}` : name, params, absolute, config ?? getZiggyConfig());
	};
}
//#endregion
//#region resources/js/ssr.jsx
createServer((page) => createInertiaApp({
	page,
	title: (title) => title ? `${title} — Elevasi Design & Build` : "Elevasi Design & Build",
	render: ReactDOMServer.renderToString,
	resolve: (name) => {
		return (/* @__PURE__ */ Object.assign({
			"./Pages/Home.jsx": Home_exports,
			"./Pages/Kontak.jsx": Kontak_exports,
			"./Pages/Layanan.jsx": Layanan_exports,
			"./Pages/Projects/Index.jsx": Index_exports,
			"./Pages/Projects/Show.jsx": Show_exports,
			"./Pages/Tentang.jsx": Tentang_exports
		}))[`./Pages/${name}.jsx`];
	},
	setup({ App, props }) {
		global.route = createLocaleAwareRoute(() => props.initialPage?.props?.locale, () => props.initialPage?.props?.ziggy);
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
