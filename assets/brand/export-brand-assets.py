#!/usr/bin/env python3
"""Export alviKRON brand assets from assets/brand/source-master.png"""
from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets" / "brand" / "source-master.png"
OUT = ROOT / "assets" / "brand"


def trim_white(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA"))
    mask = ~((arr[:, :, 0] > 245) & (arr[:, :, 1] > 245) & (arr[:, :, 2] > 245))
    ys, xs = np.where(mask)
    y0, x0 = ys.min(), xs.min()
    y1, x1 = ys.max() + 1, xs.max() + 1
    return img.crop((x0, y0, x1, y1))


def emblem_crop(img: Image.Image) -> Image.Image:
    w, h = img.size
    emblem = img.crop((0, 0, w, int(h * 0.58)))
    ew, eh = emblem.size
    side = max(ew, eh)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(emblem, ((side - ew) // 2, 0), emblem)
    arr = np.array(square)
    mask = np.any(arr[:, :, :3] < 250, axis=2)
    ys, xs = np.where(mask)
    margin = int(side * 0.02)
    return square.crop(
        (
            max(0, xs.min() - margin),
            max(0, ys.min() - margin),
            min(side, xs.max() + margin),
            min(side, ys.max() + margin),
        )
    )


def save_png(icon: Image.Image, path: Path, size: int) -> None:
    resized = icon.resize((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    canvas.paste(resized, (0, 0), resized)
    canvas.convert("RGB").save(path, "PNG", optimize=True)


def save_svg_embed(pil_img: Image.Image, path: Path, size: int | None = None) -> None:
    if size:
        pil_img = pil_img.resize((size, size), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        canvas.paste(pil_img, (0, 0), pil_img)
        pil_img = canvas.convert("RGB")
    buf = BytesIO()
    pil_img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    w, h = pil_img.size
    path.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        f'viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="alviKRON">\n'
        f'  <image width="{w}" height="{h}" href="data:image/png;base64,{b64}"/>\n'
        f"</svg>\n"
    )


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source artwork: {SRC}")

    trimmed = trim_white(Image.open(SRC).convert("RGBA"))
    pad = int(max(trimmed.size) * 0.06)
    full = Image.new("RGBA", (trimmed.width + pad * 2, trimmed.height + pad * 2), (255, 255, 255, 255))
    full.paste(trimmed, (pad, pad), trimmed)
    full_rgb = full.convert("RGB")
    full_rgb.save(ROOT / "assets" / "logo.png", "PNG", optimize=True)
    full_rgb.save(OUT / "logo-full.png", "PNG", optimize=True)
    save_svg_embed(full_rgb, OUT / "logo-full.svg")

    emblem = emblem_crop(trimmed)
    for size, name in [(32, "icon-32.png"), (128, "icon.png"), (512, "icon-512.png")]:
        save_png(emblem, OUT / name, size)
    save_svg_embed(emblem, OUT / "icon-32.svg", 32)
    save_svg_embed(emblem, OUT / "icon.svg", 128)
    print("Exported brand assets from", SRC)


if __name__ == "__main__":
    main()
