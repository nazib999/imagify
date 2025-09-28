import { type ClassValue, clsx } from "clsx";
import qs from 'qs';
import { twMerge } from "tailwind-merge";

import { aspectRatioOptions } from "@/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
    if (error instanceof Error) {
        // This is a native JavaScript error (e.g., TypeError, RangeError)
        console.error(error.message);
        throw new Error(`Error: ${error.message}`);
    } else if (typeof error === "string") {
        // This is a string error message
        console.error(error);
        throw new Error(`Error: ${error}`);
    } else {
        // This is an unknown type of error
        console.error(error);
        throw new Error(`Unknown error: ${JSON.stringify(error)}`);
    }
};

// PLACEHOLDER LOADER - while image is transforming
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

type BufferShim = { from: (input: string) => { toString: (enc: string) => string } };

const toBase64 = (str: string) => {
    if (typeof window !== "undefined") return window.btoa(str);
    const g = globalThis as { Buffer?: BufferShim };
    return g.Buffer?.from(str).toString("base64") ?? BufferFromStringFallback(str);
};

// Fallback for environments without Node Buffer types
function BufferFromStringFallback(str: string): string {
    // Basic UTF-8 to base64 encoding fallback
    if (typeof btoa === "function") return btoa(str);
    // Minimal polyfill
    const utf8 = new TextEncoder().encode(str);
    let binary = "";
    utf8.forEach((b) => (binary += String.fromCharCode(b)));

    return typeof btoa === "function" ? btoa(binary) : BufferLike(binary);
}

function BufferLike(binary: string): string {
    // Very small base64 encoder for last-resort fallback
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let i = 0;
    while (i < binary.length) {
        const c1 = binary.charCodeAt(i++);
        const c2 = binary.charCodeAt(i++);
        const c3 = binary.charCodeAt(i++);

        const e1 = c1 >> 2;
        const e2 = ((c1 & 3) << 4) | (c2 >> 4);
        const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
        const e4 = isNaN(c2) || isNaN(c3) ? 64 : c3 & 63;

        output +=
            chars.charAt(e1) +
            chars.charAt(e2) +
            chars.charAt(e3) +
            chars.charAt(e4);
    }
    return output;
}

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
    shimmer(1000, 1000)
)}`;
// ==== End

// FORM URL QUERY
export const formUrlQuery = ({
                                 searchParams,
                                 key,
                                 value,
                             }: FormUrlQueryParams) => {
    const params = { ...qs.parse(searchParams.toString()), [key]: value };

    return `${window.location.pathname}?${qs.stringify(params, {
        skipNulls: true,
    })}`;
};

// REMOVE KEY FROM QUERY
export function removeKeysFromQuery({
                                        searchParams,
                                        keysToRemove,
                                    }: RemoveUrlQueryParams) {
    const currentUrl = qs.parse(searchParams);

    keysToRemove.forEach((key) => {
        delete currentUrl[key];
    });

    // Remove null or undefined values
    Object.keys(currentUrl).forEach(
        (key) => currentUrl[key] == null && delete currentUrl[key]
    );

    return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// DEBOUNCE
export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: unknown[]) => {
        if (timeoutId !== null) clearTimeout(timeoutId as unknown as number);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// GE IMAGE SIZE
export type AspectRatioKey = keyof typeof aspectRatioOptions;
export const getImageSize = (
    type: string,
    image: { width?: number; height?: number; aspectRatio?: string },
    dimension: "width" | "height"
): number => {
    if (type === "fill") {
        return (
            aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
            1000
        );
    }
    return image?.[dimension] || 1000;
};

// DOWNLOAD IMAGE
export const download = (url: string, filename: string) => {
    if (!url) {
        throw new Error("Resource URL not provided! You need to provide one");
    }

    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobURL;

            if (filename && filename.length)
                a.download = `${filename.replace(" ", "_")}.png`;
            document.body.appendChild(a);
            a.click();
        })
        .catch((error) => console.log({ error }));
};

// DEEP MERGE OBJECTS
export const deepMergeObjects = <T extends Record<string, unknown>, U extends Record<string, unknown>>(
    obj1: T,
    obj2: U | null | undefined
): T & U => {
    if (obj2 === null || obj2 === undefined) {
        return obj1 as T & U;
    }

    const output: Record<string, unknown> = { ...obj2 };

    for (const key in obj1) {
        if (Object.prototype.hasOwnProperty.call(obj1, key)) {
            const v1 = obj1[key as keyof T] as unknown;
            const v2 = (obj2 as Record<string, unknown>)[key];
            if (
                v1 &&
                typeof v1 === "object" &&
                v2 &&
                typeof v2 === "object"
            ) {
                output[key] = deepMergeObjects(
                    v1 as Record<string, unknown>,
                    v2 as Record<string, unknown>
                );
            } else {
                output[key] = v1 as unknown;
            }
        }
    }

    return output as T & U;
};