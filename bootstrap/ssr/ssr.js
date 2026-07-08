import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
//#region resources/js/Components/WhatsAppInquiryDialog.jsx
function WhatsAppInquiryDialog({ open, onClose, sourcePage, copy }) {
	const titleId = useId();
	const descriptionId = useId();
	const firstFieldRef = useRef(null);
	const panelRef = useRef(null);
	const { url } = usePage().props;
	const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
		name: "",
		contact: "",
		message: "",
		company: "",
		source_page: sourcePage || url || "/"
	});
	useEffect(() => {
		setData("source_page", sourcePage || url || "/");
	}, [
		sourcePage,
		url,
		setData
	]);
	useEffect(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const isDesktop = window.matchMedia("(min-width: 640px)").matches;
		const timer = window.setTimeout(() => {
			if (isDesktop) firstFieldRef.current?.focus();
		}, 80);
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.clearTimeout(timer);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);
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
				reset();
				onClose();
			}
		});
	};
	if (!open) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "absolute inset-0 bg-[rgba(27,28,26,0.6)] backdrop-blur-[2px] sm:backdrop-blur-sm",
			"aria-label": copy.cancel,
			onClick: handleClose
		}), /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			"aria-describedby": descriptionId,
			className: "relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[20px] border border-b-0 border-[rgba(27,28,26,0.1)] bg-[rgb(243,243,240)] shadow-[0_-12px_48px_rgba(27,28,26,0.18)] sm:max-h-[min(88vh,760px)] sm:rounded-sm sm:border-b sm:shadow-[0_24px_80px_rgba(27,28,26,0.18)]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex shrink-0 items-center justify-center pt-3 sm:hidden",
					children: /* @__PURE__ */ jsx("span", {
						className: "h-1 w-10 rounded-full bg-[rgba(27,28,26,0.14)]",
						"aria-hidden": "true"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-start justify-between gap-4 border-b border-[rgba(27,28,26,0.08)] px-5 pb-4 pt-2 sm:px-8 sm:pb-5 sm:pt-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "mono-label",
								children: "( WhatsApp )"
							}),
							/* @__PURE__ */ jsx("h2", {
								id: titleId,
								className: "m-0 mt-2 text-[clamp(22px,5.5vw,32px)] font-semibold uppercase leading-[1.05] tracking-[-0.02em] [text-wrap:balance]",
								children: copy.title
							}),
							/* @__PURE__ */ jsx("p", {
								id: descriptionId,
								className: "mt-2 text-[15px] leading-[1.6] text-[rgba(27,28,26,0.62)] sm:mt-3 sm:text-[15px]",
								children: copy.description
							})
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleClose,
						className: "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(27,28,26,0.12)] bg-white text-xl leading-none text-[rgba(27,28,26,0.55)] transition hover:border-[rgba(27,28,26,0.2)] hover:text-[rgb(27,28,26)]",
						"aria-label": copy.cancel,
						children: "×"
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "flex min-h-0 flex-1 flex-col",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-5",
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
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "inquiry-name",
										className: "mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]",
										children: copy.nameLabel
									}),
									/* @__PURE__ */ jsx("input", {
										ref: firstFieldRef,
										id: "inquiry-name",
										type: "text",
										value: data.name,
										onChange: (event) => setData("name", event.target.value),
										className: "w-full rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[rgb(31,122,70)]",
										autoComplete: "name",
										required: true
									}),
									errors.name && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-sm text-red-700",
										children: errors.name
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "inquiry-contact",
										className: "mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]",
										children: copy.contactLabel
									}),
									/* @__PURE__ */ jsx("input", {
										id: "inquiry-contact",
										type: "tel",
										value: data.contact,
										onChange: (event) => setData("contact", event.target.value),
										className: "w-full rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[rgb(31,122,70)]",
										autoComplete: "tel",
										inputMode: "tel",
										placeholder: copy.contactPlaceholder,
										required: true
									}),
									errors.contact && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-sm text-red-700",
										children: errors.contact
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "inquiry-message",
										className: "mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]",
										children: copy.messageLabel
									}),
									/* @__PURE__ */ jsx("textarea", {
										id: "inquiry-message",
										value: data.message,
										onChange: (event) => setData("message", event.target.value),
										rows: 4,
										className: "min-h-[112px] w-full resize-y rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base leading-[1.6] outline-none transition focus:border-[rgb(31,122,70)]",
										placeholder: copy.messagePlaceholder,
										required: true
									}),
									errors.message && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-sm text-red-700",
										children: errors.message
									})
								] })
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "shrink-0 border-t border-[rgba(27,28,26,0.08)] bg-[rgb(243,243,240)] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-5",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-3 sm:flex-row-reverse sm:justify-start",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(27,28,26)] disabled:opacity-60 sm:w-auto",
								disabled: processing,
								children: processing ? copy.submitting : `${copy.submit} ↗`
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClose,
								className: "inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(236,236,232)] sm:w-auto",
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
			openDialog(source);
			onClick?.(event);
		},
		...props,
		children: [children, showArrow ? " ↗" : null]
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
	const isProjectsArea = url.startsWith("/proyek") || url.startsWith("/en/proyek");
	const isStudioArea = url === "/tentang" || url === "/en/tentang";
	const isContactPage = url === "/kontak" || url === "/en/kontak";
	const closeMobileNav = () => setIsMobileNavOpen(false);
	const homeUrl = locale === "en" ? "/en" : "/";
	const goHome = () => {
		closeMobileNav();
		window.location.assign(homeUrl);
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
							children: /* @__PURE__ */ jsx("img", {
								src: elevasi_logo_default,
								alt: "Elevasi Design & Build",
								className: "h-12 w-auto sm:h-[52px] md:h-14"
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
									children: [/* @__PURE__ */ jsx("a", {
										href: locale === "en" ? url : altLocaleUrl,
										className: `inline-block rounded-full px-2 py-1 ${locale === "en" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
										children: "EN"
									}), /* @__PURE__ */ jsx("a", {
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
							children: [/* @__PURE__ */ jsx("a", {
								href: locale === "en" ? url : altLocaleUrl,
								className: `rounded-full px-3 py-1.5 ${locale === "en" ? "bg-[rgb(27,28,26)] text-[rgb(243,243,240)]" : ""}`,
								onClick: closeMobileNav,
								children: "EN"
							}), /* @__PURE__ */ jsx("a", {
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
			children,
			/* @__PURE__ */ jsxs("footer", {
				className: `mt-10 overflow-hidden rounded-t-3xl bg-[rgb(27,28,26)] text-[rgb(243,243,240)] ${isContactPage ? "pt-10" : ""}`,
				children: [!isContactPage && /* @__PURE__ */ jsxs("div", {
					className: "relative px-5 pb-20 pt-20 text-center md:px-10 md:pb-[100px] md:pt-[110px]",
					children: [cms.footer.ctaImage && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("img", {
						src: cms.footer.ctaImage,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover",
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
function Seo({ title, description, image, type = "website", noIndex = false }) {
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
				href: alternateId
			}),
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
//#region resources/js/hooks/useScrollReveal.js
var FALLBACK_MS = 1200;
var OBSERVER_THRESHOLD = .12;
var VIEWPORT_OFFSET = 80;
/**
* Reveals every [data-reveal] element inside `containerRef` as it enters the
* viewport, staggered by its `data-reveal` delay (ms).
*
* Pass `deps` whenever the revealed content can change without remounting the
* page (e.g. Inertia filter/pagination with preserveState) so newly rendered
* cards are observed again instead of staying invisible.
*
* @param {React.RefObject<HTMLElement|null>} containerRef
* @param {unknown[]} [deps]
*/
function useScrollReveal(containerRef, deps = []) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return void 0;
		const elements = Array.from(container.querySelectorAll("[data-reveal]"));
		if (elements.length === 0) return void 0;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			elements.forEach((el) => el.classList.add("is-visible"));
			return;
		}
		const timers = [];
		const revealed = /* @__PURE__ */ new WeakSet();
		const reveal = (el) => {
			if (revealed.has(el)) return;
			revealed.add(el);
			const delay = parseInt(el.dataset.reveal, 10) || 0;
			timers.push(setTimeout(() => {
				el.classList.add("is-visible");
			}, delay));
		};
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				reveal(entry.target);
				observer.unobserve(entry.target);
			});
		}, { threshold: OBSERVER_THRESHOLD });
		elements.forEach((el) => {
			el.classList.remove("is-visible");
			observer.observe(el);
			const rect = el.getBoundingClientRect();
			if (rect.top <= window.innerHeight - VIEWPORT_OFFSET && rect.bottom >= VIEWPORT_OFFSET) reveal(el);
			timers.push(setTimeout(() => {
				reveal(el);
			}, FALLBACK_MS));
		});
		return () => {
			observer.disconnect();
			timers.forEach(clearTimeout);
		};
	}, [containerRef, ...deps]);
}
//#endregion
//#region resources/js/hooks/useParallax.js
var OFFSCREEN_MARGIN = 100;
var DEFAULT_SPEED = .08;
/**
* Drives a lightweight parallax offset (translateY only, GPU-composited) on
* every [data-parallax] element inside `containerRef`, batched behind a
* single rAF per scroll event. Disabled under prefers-reduced-motion per
* PRD US-2 (non-essential animation).
*/
function useParallax(containerRef) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return void 0;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return void 0;
		const elements = Array.from(container.querySelectorAll("[data-parallax]"));
		if (elements.length === 0) return void 0;
		let raf = null;
		const apply = () => {
			raf = null;
			const vh = window.innerHeight;
			elements.forEach((el) => {
				const rect = el.parentElement.getBoundingClientRect();
				if (rect.bottom < -100 || rect.top > vh + OFFSCREEN_MARGIN) return;
				const speed = parseFloat(el.dataset.parallax) || DEFAULT_SPEED;
				const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
				el.style.transform = `translateY(${offset.toFixed(1)}px)`;
			});
		};
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(apply);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		apply();
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (raf) cancelAnimationFrame(raf);
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
			className: "relative overflow-hidden rounded-sm",
			children: [
				hero.coverImage ? /* @__PURE__ */ jsx("div", {
					className: "relative h-[62vh] overflow-hidden md:h-[76vh]",
					children: /* @__PURE__ */ jsx("img", {
						src: hero.coverImage,
						alt: hero.coverCaption || "Hero cover image",
						className: "h-full w-full object-cover",
						"data-parallax": "0.12",
						loading: "eager"
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
							children: /* @__PURE__ */ jsx("img", {
								src: project.coverImage,
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
				image: hero.coverImage
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
					children: /* @__PURE__ */ jsx("img", {
						src: content.pageImage,
						alt: content.heading,
						className: "aspect-[16/9] w-full object-cover md:aspect-[21/9]",
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
						children: project.coverImage ? /* @__PURE__ */ jsx("img", {
							src: project.coverImage,
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
							children: project.coverImage ? /* @__PURE__ */ jsx("img", {
								src: project.coverImage,
								alt: project.caption || project.title,
								className: "aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]",
								loading: "lazy"
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
//#region resources/js/Pages/Projects/Show.jsx
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => ProjectShow });
function ProjectShow({ project, gallery, next, labels }) {
	const containerRef = useRef(null);
	useScrollReveal(containerRef);
	useParallax(containerRef);
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
				type: "article"
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
				children: [project.coverImage ? /* @__PURE__ */ jsx("img", {
					src: project.coverImage,
					alt: project.coverCaption || project.title,
					className: "h-[56vh] w-full object-cover md:h-[74vh]",
					loading: "eager"
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
				children: gallery.map((g, i) => /* @__PURE__ */ jsx("div", {
					className: "group overflow-hidden rounded-[2px]",
					"data-reveal": i % 2 * 90,
					style: { gridColumn: i === 0 ? "1 / -1" : "auto" },
					children: g.url ? /* @__PURE__ */ jsx("img", {
						src: g.url,
						alt: g.label,
						className: "aspect-[var(--ratio)] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]",
						style: { "--ratio": i === 0 ? "16 / 8" : "4 / 3" },
						loading: "lazy"
					}) : /* @__PURE__ */ jsx(Placeholder, {
						caption: g.label,
						parallax: .06,
						className: "aspect-[var(--ratio)] transition duration-500 group-hover:scale-[1.015]",
						style: { "--ratio": i === 0 ? "16 / 8" : "4 / 3" }
					})
				}, g.label))
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
* keeps working unchanged while transparently resolving to the "en."-prefixed
* route when the current page is in the English locale. Routes are registered
* twice server-side (see routes/web.php) because Laravel's optional route
* parameters only work at the end of a URI, so a single "{locale?}/proyek"
* route can't match a bare "/proyek".
*/
function createLocaleAwareRoute(getLocale, getZiggyConfig) {
	return (name, params, absolute, config) => {
		return route$1(getLocale() === "en" && !name.startsWith("en.") ? `en.${name}` : name, params, absolute, config ?? getZiggyConfig());
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
