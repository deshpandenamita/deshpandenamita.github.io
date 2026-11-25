"""Renders MoneyMap's narrated explainer videos (MP4 + WebVTT captions + poster).

Frames are drawn with Pillow, the narrator is the built-in Windows voice (tts.ps1),
and ffmpeg (from imageio-ffmpeg) joins them.

Usage:  python render.py            -> all videos
        python render.py compound   -> one video by key
"""
import json, math, os, re, subprocess, sys, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)                       # moneymap/videos
ROOT = os.path.dirname(OUT)                       # moneymap
W, H = 1920, 1080                                 # drawing size (downscaled for smooth edges)
OW, OH = 1280, 720                                # output size
FPS = 24
VOICE = 'Microsoft Zira Desktop'
LEAD_IN, LEAD_OUT = 0.35, 0.55

C = dict(page='#FFF6F1', ink='#2B2D42', ink2='#5A5C73', muted='#8D8FA3', white='#FFFFFF',
         coral='#FF6B6B', coralink='#D63C4A', coralwash='#FFE8E6',
         purple='#6C5CE7', purpleink='#5546D6', purplewash='#EFECFF',
         sun='#FDCB6E', sunink='#8A5A00', sunwash='#FFF4D9',
         mint='#00B894', mintink='#00806A', mintwash='#DCF7EF',
         grid='#F0E2DB', axis='#DCCBC2', gray='#D9D3E0')

# ---------------------------------------------------------------- helpers
FONT_FILES = {'b': ['segoeuib.ttf', 'arialbd.ttf'], 's': ['seguisb.ttf', 'segoeuib.ttf', 'arialbd.ttf'], 'r': ['segoeui.ttf', 'arial.ttf']}
_fonts = {}
def F(size, w='b'):
    key = (int(size), w)
    if key not in _fonts:
        for name in FONT_FILES[w]:
            p = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts', name)
            if os.path.exists(p):
                _fonts[key] = ImageFont.truetype(p, int(size)); break
        else:
            _fonts[key] = ImageFont.load_default()
    return _fonts[key]

def rgb(c):
    if isinstance(c, tuple): return c
    c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t):
    a, b = rgb(a), rgb(b); t = clamp(t)
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def fade(c, a): return mix(C['page'], c, a)       # fake transparency over the page color
def clamp(x, lo=0.0, hi=1.0): return max(lo, min(hi, x))
def seg(p, a, b): return clamp((p - a) / (b - a)) if b > a else float(p >= a)
def ease(p): p = clamp(p); return p * p * (3 - 2 * p)
def eout(p): p = clamp(p); return 1 - (1 - p) ** 3
def back(p):
    p = clamp(p); s = 1.7
    return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2
def bounce(p):
    p = clamp(p)
    if p < 0.6: return (p / 0.6) ** 2
    q = (p - 0.8) / 0.2
    return 1 - 0.12 * (1 - q * q) if p < 1 else 1
def lerp(a, b, t): return a + (b - a) * t
def money(v): return '${:,.0f}'.format(v)

def txt(d, x, y, s, size, color, w='b', anchor='mm'):
    d.text((x, y), s, font=F(size, w), fill=rgb(color), anchor=anchor)
def twidth(s, size, w='b'): return F(size, w).getlength(s)
def rr(d, x0, y0, x1, y1, r, fill=None, outline=None, width=0):
    if x1 - x0 < 1 or y1 - y0 < 1: return
    r = min(r, (x1 - x0) / 2, (y1 - y0) / 2)
    d.rounded_rectangle((x0, y0, x1, y1), r, fill=rgb(fill) if fill else None, outline=rgb(outline) if outline else None, width=width)
def circle(d, x, y, r, fill=None, outline=None, width=0):
    if r <= 0: return
    d.ellipse((x - r, y - r, x + r, y + r), fill=rgb(fill) if fill else None, outline=rgb(outline) if outline else None, width=width)
def pill(d, x, y, s, size, bg, fg, anchor='mm', padx=26, pady=14):
    w = twidth(s, size) + padx * 2; h = size + pady * 2
    x0 = x - w / 2 if anchor == 'mm' else (x if anchor == 'lm' else x - w)
    rr(d, x0, y - h / 2, x0 + w, y + h / 2, h / 2, fill=bg)
    txt(d, x0 + w / 2, y, s, size, fg)
    return w
def dashed(d, x0, y0, x1, y1, color, width=5, dash=18, gap=12, frac=1.0):
    L = math.hypot(x1 - x0, y1 - y0) * frac
    if L <= 0: return
    ux, uy = (x1 - x0) / math.hypot(x1 - x0, y1 - y0), (y1 - y0) / math.hypot(x1 - x0, y1 - y0)
    s = 0
    while s < L:
        e = min(s + dash, L)
        d.line((x0 + ux * s, y0 + uy * s, x0 + ux * e, y0 + uy * e), fill=rgb(color), width=width)
        s = e + gap
def coin(d, x, y, r, label='$', a=1.0):
    circle(d, x, y, r, fill=fade(C['sun'], a), outline=fade(C['sunink'], a), width=max(2, int(r * 0.09)))
    circle(d, x, y, r * 0.72, outline=fade('#E9AE3C', a), width=max(1, int(r * 0.05)))
    if label: txt(d, x, y - r * 0.05, label, r * 1.05, fade(C['sunink'], a))
def person(d, cx, cy, s, color):
    circle(d, cx, cy - s * 0.42, s * 0.28, fill=color)
    rr(d, cx - s * 0.42, cy - s * 0.08, cx + s * 0.42, cy + s * 0.62, s * 0.3, fill=color)
def arrow(d, x0, y0, x1, y1, color, width=8, head=26):
    d.line((x0, y0, x1, y1), fill=rgb(color), width=width)
    ang = math.atan2(y1 - y0, x1 - x0)
    pts = [(x1, y1), (x1 - head * math.cos(ang - 0.45), y1 - head * math.sin(ang - 0.45)), (x1 - head * math.cos(ang + 0.45), y1 - head * math.sin(ang + 0.45))]
    d.polygon(pts, fill=rgb(color))

def make_bg():
    img = Image.new('RGB', (W, H), rgb(C['page']))
    blobs = Image.new('RGB', (W, H), rgb(C['page']))
    bd = ImageDraw.Draw(blobs)
    circle(bd, 260, 160, 380, fill='#FFE1D6'); circle(bd, 1700, 260, 420, fill='#E9E4FF'); circle(bd, 1000, 1120, 460, fill='#FFF0C7')
    return Image.blend(img, blobs.filter(ImageFilter.GaussianBlur(140)), 0.85)
BG = None

def chrome(d, title, gp):
    rr(d, 48, 40, 92, 84, 13, fill=C['purple'])
    d.line((58, 70, 68, 60, 75, 66, 84, 54), fill=rgb(C['white']), width=5, joint='curve')
    txt(d, 106, 62, 'MoneyMap', 30, C['ink'], anchor='lm')
    txt(d, 270, 63, '·  ' + title, 26, C['ink2'], 's', anchor='lm')
    rr(d, 0, H - 12, W, H, 0, fill=C['grid'])
    rr(d, 0, H - 12, W * gp, H, 0, fill=C['coral'])

def title_card(d, p, kicker, title, sub, y=300):
    a = ease(seg(p, 0, 0.25))
    dy = (1 - eout(seg(p, 0, 0.3))) * 40
    pill(d, W / 2, y - 120 + dy, kicker, 26, fade(C['coralwash'], a), fade(C['coralink'], a))
    txt(d, W / 2, y + dy, title, 104, fade(C['ink'], a))
    a2 = ease(seg(p, 0.12, 0.4))
    txt(d, W / 2, y + 100 + dy, sub, 46, fade(C['ink2'], a2), 's')

def end_card(d, p, big, small):
    a = ease(seg(p, 0, 0.2)); s = back(seg(p, 0, 0.35))
    w, h = 1240 * (0.9 + 0.1 * s), 420 * (0.9 + 0.1 * s)
    rr(d, W / 2 - w / 2, 300 - 40 + (1 - a) * 30, W / 2 + w / 2, 300 + h - 40 + (1 - a) * 30, 60, fill=fade(C['purple'], a))
    txt(d, W / 2, 440 + (1 - a) * 30, big, 92, fade(C['white'], a) if a > 0.3 else fade(C['purple'], a))
    txt(d, W / 2, 545 + (1 - a) * 30, small, 40, fade('#E4E0FF', a), 's')
    a2 = ease(seg(p, 0.25, 0.45))
    pill(d, W / 2, 820, 'This is for learning, not financial advice.', 32, fade(C['sunwash'], a2), fade(C['sunink'], a2))

def scene(say, draw):
    return {'say': say, 'draw': draw}

# ---------------------------------------------------------------- video 1: compound interest
def v_compound():
    V = [1000 * 1.08 ** y for y in range(31)]
    MAX = V[30]
    X0, X1, BASE, TOP = 230, 1700, 900, 250
    slot = (X1 - X0) / 31; bw = slot * 0.74
    Y = lambda v: BASE - (v / MAX) * (BASE - TOP)
    bx = lambda y: X0 + y * slot + (slot - bw) / 2

    def chart(d, n, simple=0.0, note=None, hl=None):
        d.line((X0 - 10, BASE, X1, BASE), fill=rgb(C['axis']), width=4)
        for y in range(0, 31, 5): txt(d, bx(y) + bw / 2, BASE + 34, f'Year {y}', 26, C['muted'], 's')
        rr(d, 230, 150, 262, 182, 8, fill=C['purple']); txt(d, 276, 166, 'Money you put in', 30, C['ink2'], 's', 'lm')
        rr(d, 560, 150, 592, 182, 8, fill=C['coral']); txt(d, 606, 166, 'Growth (interest on interest)', 30, C['ink2'], 's', 'lm')
        for y in range(31):
            f = eout(clamp(n - y))
            if f <= 0: continue
            x = bx(y); hp = (BASE - Y(1000)) * f; hg = (Y(1000) - Y(V[y])) * f
            rr(d, x, BASE - hp, x + bw, BASE, 8, fill=C['purple'])
            if hg > 3: rr(d, x, BASE - hp - hg - 3, x + bw, BASE - hp - 3, 8, fill=C['coral'])
            if hl == y: rr(d, x - 8, BASE - hp - hg - 12, x + bw + 8, BASE + 6, 12, outline=C['ink'], width=5)
        yf = clamp(n - 1, 0, 30)
        val = 1000 * 1.08 ** yf
        rr(d, 1300, 130, 1720, 236, 30, fill=C['white'])
        txt(d, 1330, 160, f'After year {int(round(yf)) if n >= 2 else 0}', 28, C['ink2'], 's', 'lm')
        txt(d, 1330, 205, money(val), 50, C['ink'], 'b', 'lm')
        if simple > 0:
            x0, y0 = bx(0) + bw / 2, Y(1000); x1, y1 = bx(30) + bw / 2, Y(3400)
            dashed(d, x0, y0, x1, y1, C['ink'], 6, frac=ease(simple))
            if simple > 0.8:
                a = ease(seg(simple, 0.8, 1))
                pill(d, x1 - 10, y1 - 50, 'Simple interest: $3,400', 30, fade(C['white'], a), fade(C['ink'], a), anchor='rm')
        if note: note(d)

    def s_title(d, p, t):
        title_card(d, p, 'MoneyMap explains', 'Compound interest', 'Money that grows on its own', y=280)
        y = lerp(-120, 700, bounce(seg(p, 0.25, 0.75)))
        coin(d, W / 2, y, 90)
        if p > 0.75: txt(d, W / 2, 840, '$1,000', 56, fade(C['ink'], ease(seg(p, 0.75, 0.9))))
    def s_jar(d, p, t):
        rr(d, 740, 330, 1180, 900, 70, fill=C['white'], outline=C['purple'], width=10)
        rr(d, 790, 290, 1130, 345, 22, fill=C['purple'])
        pill(d, W / 2, 230, '8% a year', 40, C['purplewash'], C['purpleink'])
        k = eout(seg(p, 0.05, 0.4))
        coin(d, W / 2, lerp(140, 740, k), 90)
        if p > 0.55:
            a = ease(seg(p, 0.55, 0.75))
            txt(d, W / 2, 980, 'Real years go up and down. 8% is an average, not a promise.', 34, fade(C['ink2'], a), 's')
    def s_y1(d, p, t):
        chart(d, 1 + eout(seg(p, 0.1, 0.5)))
        if p > 0.5:
            a = ease(seg(p, 0.5, 0.7)); x = bx(1) + bw / 2
            pill(d, x + 40, Y(V[1]) - 70, '+$80', 34, fade(C['coralwash'], a), fade(C['coralink'], a), anchor='lm')
    def s_y2(d, p, t):
        n = 2 + eout(seg(p, 0.35, 0.7))
        def note(d):
            a = ease(seg(p, 0.05, 0.3))
            rr(d, 560, 330, 1400, 520, 36, fill=fade(C['white'], a))
            txt(d, 980, 390, 'Year 2: 8% of $1,080', 44, fade(C['ink'], a))
            txt(d, 980, 455, '= $86.40  (interest on interest!)', 38, fade(C['coralink'], a), 's')
        chart(d, n, note=note, hl=1 if p < 0.4 else 2)
    def s_y10(d, p, t): chart(d, 3 + 8 * ease(seg(p, 0.05, 0.7)))
    def s_y30(d, p, t):
        chart(d, 11 + 20 * ease(seg(p, 0.05, 0.75)))
        if p > 0.8:
            a = ease(seg(p, 0.8, 0.95))
            pill(d, 900, 420, '10x your money!', 44, fade(C['sun'], a), fade(C['sunink'], a))
    def s_simple(d, p, t):
        chart(d, 31, simple=seg(p, 0.05, 0.6))
        if p > 0.65:
            a = ease(seg(p, 0.65, 0.85))
            pill(d, 860, 400, 'Compounding adds about $6,663 more', 36, fade(C['coralwash'], a), fade(C['coralink'], a))
    def s_people(d, p, t):
        r = 0.07 / 12
        fa = 200 * ((1 + r) ** 480 - 1) / r; fb = 300 * ((1 + r) ** 360 - 1) / r
        txt(d, W / 2, 190, 'Time is the secret ingredient', 64, C['ink'])
        ax0, ax1 = 760, 1480
        AX = lambda age: ax0 + (age - 25) / 40 * (ax1 - ax0)
        for age in (25, 35, 45, 55, 65):
            txt(d, AX(age), 880, f'Age {age}', 28, C['muted'], 's'); d.line((AX(age), 330, AX(age), 845), fill=rgb(C['grid']), width=3)
        rows = [(430, 'Ava', 'starts at 25 · $200/month', 25, fa, 'purple', 0.1), (690, 'Ben', 'starts at 35 · $300/month', 35, fb, 'coral', 0.3)]
        for y, name, sub, start, fv, col, delay in rows:
            k = ease(seg(p, delay, delay + 0.45))
            person(d, 210, y, 110, C[col]); txt(d, 300, y - 26, name, 44, C['ink'], anchor='lm'); txt(d, 300, y + 26, sub, 28, C['ink2'], 's', anchor='lm')
            rr(d, AX(start), y - 34, AX(start) + (AX(65) - AX(start)) * k, y + 34, 34, fill=C[col])
            if k > 0.05: txt(d, AX(65) + 30, y, money(fv * k), 50, C['ink'], anchor='lm')
        if p > 0.65:
            a = ease(seg(p, 0.65, 0.85))
            pill(d, W / 2, 985, 'Ava puts in less money ($96k vs $108k) but ends with more.  Assumes 7% a year.', 28, fade(C['white'], a), fade(C['ink2'], a))
    def s_debt(d, p, t):
        txt(d, W / 2, 190, 'Debt compounds too', 64, C['ink'])
        rr(d, 240, 380, 780, 720, 40, fill=C['coral'])
        rr(d, 300, 470, 390, 540, 12, fill=C['sun']); txt(d, 300, 650, 'CREDIT CARD', 36, C['white'], anchor='lm')
        rr(d, 240, 600, 780, 615, 0, fill=C['coralink'])
        m = int(60 * ease(seg(p, 0.15, 0.85))); bal = 1000 * 1.02 ** m
        x0, x1, base = 980, 1680, 780
        top = base - 420 * (bal / (1000 * 1.02 ** 60))
        rr(d, x0 + 120, top, x1 - 120, base, 26, fill=C['coralwash'], outline=C['coral'], width=6)
        txt(d, (x0 + x1) / 2, top - 50, money(bal), 64, C['coralink'])
        txt(d, (x0 + x1) / 2, base + 50, f'Month {m}', 34, C['ink2'], 's')
        txt(d, W / 2, 960, 'A $1,000 balance at 24% APR (2% a month) with no payments for 5 years.', 30, C['ink2'], 's')
    def s_end(d, p, t): end_card(d, p, 'Start early. Be patient.', 'Let time do the heavy lifting.')

    return 'compound-interest', 'Compound interest', [
        scene('Meet one thousand dollars. Let\'s see what happens if we just leave it alone and let it grow.', s_title),
        scene('Say it earns eight percent a year. That\'s a bit below what the US stock market has averaged over long periods in the past. Real years go up and down, though.', s_jar),
        scene('After one year, you earn eighty dollars. Now you have one thousand and eighty.', s_y1),
        scene('Here\'s the magic. In year two, you earn eight percent on the whole one thousand and eighty, including last year\'s growth. That\'s interest on interest. It\'s called compounding.', s_y2),
        scene('After ten years, you have about two thousand one hundred sixty dollars. Your money has doubled.', s_y10),
        scene('Keep going to thirty years, and you have about ten thousand dollars. Ten times your money, without adding a single cent.', s_y30),
        scene('Without compounding, earning eight percent on just the original thousand, you\'d have only three thousand four hundred.', s_simple),
        scene('The secret ingredient is time. Starting ten years earlier can make a bigger difference than investing more later.', s_people),
        scene('But watch out. Compounding works against you with debt, too. Credit card interest grows the same way.', s_debt),
        scene('So start early, be patient, and let time do the heavy lifting. This is for learning, not financial advice.', s_end),
    ]

# ---------------------------------------------------------------- video 2: why prices move
def v_supply():
    HIST = [50, 50, 58, 49, 46]
    def crowd(d, x0, n, color, label):
        txt(d, x0 + 130, 250, label, 44, C['ink'])
        for k in range(10):
            cx = x0 + (k % 5) * 66; cy = 360 + (k // 5) * 120
            on = clamp(n - k)
            person(d, cx, cy, 70 * (0.75 + 0.25 * on), mix(C['gray'], C[color], on))
    def tag(d, price, wob=0.0, y=430):
        cx = W / 2
        rr(d, cx - 210, y - 120 + wob, cx + 210, y + 120 + wob, 40, fill=C['white'], outline=C['ink'], width=6)
        circle(d, cx - 160, y - 70 + wob, 16, fill=C['page'], outline=C['ink'], width=5)
        txt(d, cx, y - 55 + wob, 'Price', 34, C['ink2'], 's')
        txt(d, cx, y + 25 + wob, f'${price:.0f}', 110, C['ink'])
    def hist(d, upto):
        x0, x1, y0, y1 = 420, 1500, 760, 980
        d.line((x0, y1, x1, y1), fill=rgb(C['axis']), width=4)
        txt(d, x0, y1 + 30, 'Price over time', 26, C['muted'], 's', 'lm')
        P = lambda v: y1 - 20 - (v - 44) / 16 * (y1 - y0 - 30)
        X = lambda i: x0 + 40 + i * (x1 - x0 - 80) / 4
        pts = []
        for i in range(len(HIST)):
            if i <= upto: pts.append((X(i), P(HIST[i])))
            elif i - 1 < upto:
                f = upto - (i - 1); pts.append((lerp(X(i - 1), X(i), f), P(lerp(HIST[i - 1], HIST[i], f))))
        if len(pts) > 1: d.line(pts, fill=rgb(C['ink']), width=7, joint='curve')
        if pts: circle(d, pts[-1][0], pts[-1][1], 12, fill=C['ink'])
    def paper(img, headline, p, good):
        k = eout(seg(p, 0, 0.35))
        pw, ph = 720, 300
        im = Image.new('RGBA', (pw, ph), (0, 0, 0, 0)); pd = ImageDraw.Draw(im)
        rr(pd, 0, 0, pw - 1, ph - 1, 28, fill=C['white'], outline=C['ink'], width=5)
        rr(pd, 0, 0, pw - 1, 70, 28, fill=C['mint'] if good else C['coral'])
        txt(pd, pw / 2, 37, 'BREAKING NEWS', 30, C['white'])
        txt(pd, pw / 2, 150, headline, 50, C['ink'])
        for j in range(3): rr(pd, 70, 205 + j * 26, pw - 70 - j * 120, 217 + j * 26, 6, fill=C['grid'])
        im = im.rotate(lerp(-25, -4, k), expand=True, resample=Image.BICUBIC)
        x = int(lerp(W + 100, W / 2 - im.width / 2, k)); y = int(lerp(-200, 560 - im.height / 2, k))
        if p > 0.8:  # slide away
            y = int(lerp(560 - im.height / 2, H + 50, ease(seg(p, 0.8, 1))))
        img.paste(im, (x, y), im)
    def base(d, b, s, price, upto, wob=0.0):
        crowd(d, 110, b, 'purple', 'Want to buy'); crowd(d, 1530, s, 'coral', 'Want to sell')
        tag(d, price, wob); hist(d, upto)

    def s_title(d, p, t, img=None):
        title_card(d, p, 'MoneyMap explains', 'Why do stock prices move?', 'Buyers, sellers, and a tug-of-war', y=260)
        tag(d, 50, math.sin(t * 3) * 12, y=700)
    def s_balance(d, p, t): base(d, 5 * eout(seg(p, 0, 0.5)), 5 * eout(seg(p, 0.1, 0.6)), 50, 0)
    def s_good(d, p, t): base(d, 5 + 4 * ease(seg(p, 0.35, 0.8)), 5, 50, ease(seg(p, 0.3, 0.9)) * 1)
    def s_rise(d, p, t): base(d, 9, 5 + 3 * ease(seg(p, 0.3, 0.8)), lerp(50, 58, ease(seg(p, 0.05, 0.8))), 1 + ease(seg(p, 0.05, 0.8)))
    def s_bad(d, p, t): base(d, 9 - 6 * ease(seg(p, 0.35, 0.75)), 8 + 2 * ease(seg(p, 0.35, 0.75)), lerp(58, 49, ease(seg(p, 0.45, 0.95))), 2 + ease(seg(p, 0.45, 0.95)))
    def s_settle(d, p, t): base(d, 3 + 3 * ease(seg(p, 0.1, 0.6)), 10 - 4 * ease(seg(p, 0.1, 0.6)), lerp(49, 46, ease(seg(p, 0.05, 0.6))), 3 + ease(seg(p, 0.05, 0.6)))
    def s_tug(d, p, t):
        txt(d, W / 2, 200, 'A tug-of-war that never stops', 64, C['ink'])
        off = math.sin(t * 2.2) * 110
        d.line((330, 620, 1590, 620), fill=rgb('#B08B5B'), width=16)
        for k in range(4): person(d, 220 + k * 70 + off * 0.2, 610, 90, C['purple']); person(d, 1700 - k * 70 + off * 0.2, 610, 90, C['coral'])
        d.polygon([(W / 2 + off, 620), (W / 2 + off - 36, 720), (W / 2 + off + 36, 720)], fill=rgb(C['sun']))
        txt(d, 380, 760, 'Buyers', 40, C['purpleink']); txt(d, 1540, 760, 'Sellers', 40, C['coralink'])
        for j, (lab, col) in enumerate([('News', 'mint'), ('Fear', 'coral'), ('Excitement', 'purple')]):
            a = ease(seg(p, 0.2 + j * 0.15, 0.35 + j * 0.15))
            pill(d, 640 + j * 320, 400 + math.sin(t * 2 + j) * 14, lab, 40, fade(C[col + 'wash'], a), fade(C[col + 'ink'], a))
    def s_end(d, p, t): end_card(d, p, 'Short term: mood.', 'Long term: how the business does.')

    def news(fn, headline, good, a, b):
        def g(d, p, t, img):
            fn(d, p, t)
            if a <= p <= b: paper(img, headline, seg(p, a, b), good)
        g.needs_img = True
        return g
    return 'stock-prices', 'Why prices move', [
        scene('Why does a stock\'s price go up and down every day? It\'s simpler than it looks.', s_title),
        scene('A stock price is just the last price where a buyer and a seller agreed to trade. Right now, buyers and sellers are balanced, at fifty dollars.', s_balance),
        scene('Now, good news. The company sold more than expected. Suddenly, more people want to buy.', news(s_good, 'Sales beat expectations!', True, 0.0, 0.55)),
        scene('With so many buyers competing, they offer higher prices. Sellers notice, and ask for more. The price rises until enough sellers say yes.', s_rise),
        scene('Then, bad news. A product problem. Now lots of owners want to sell, and few want to buy. Sellers must accept lower prices, and the price falls.', news(s_bad, 'Product recall', False, 0.0, 0.45)),
        scene('At some point, buyers think it\'s a bargain again, and things balance out.', s_settle),
        scene('Nobody sets the price. It\'s a tug-of-war between buyers and sellers that never stops. News, fear, and excitement all pull on the rope.', s_tug),
        scene('In the short run, prices follow moods. In the long run, they tend to follow how well the business actually does. This is for learning, not financial advice.', s_end),
    ]

# ---------------------------------------------------------------- video 3: diversification
def v_diversify():
    R = [35, -40, 12, 8, 22, -15, 5, 18, -8, 30, 10, -5, 14, 13, 25, -20, 19, 15, -12, 34]
    GX, GY, TW, TH, G = 150, 250, 196, 150, 22
    center = lambda k: (GX + (k % 5) * (TW + G) + TW / 2, GY + (k // 5) * (TH + G) + TH / 2)
    def tiles(d, appear=1.0, flip=0.0, pick=None, dim=0.0, ring=0.0, drop=0.0):
        for k, r in enumerate(R):
            cx, cy = center(k); cy += drop * 26 * (1 + (k % 3))
            sa = back(seg(appear, k * 0.03, k * 0.03 + 0.4))
            if sa <= 0: continue
            f = seg(flip, k * 0.025, k * 0.025 + 0.3)
            wscale = abs(1 - 2 * f) if 0 < f < 1 else 1
            shown = f >= 0.5
            col = (C['mintwash'] if r >= 0 else C['coralwash']) if shown else C['white']
            ink = (C['mintink'] if r >= 0 else C['coralink']) if shown else C['ink2']
            a = 1 - dim * (0 if pick is None or k in pick else 0.7)
            w, h = TW * sa * wscale, TH * sa
            border = C['ink'] if pick and k in pick else (C['purple'] if ring > 0 else C['axis'])
            rr(d, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 26, fill=fade(col, a), outline=fade(border, a), width=6 if (pick and k in pick) or ring else 3)
            if wscale > 0.3:
                txt(d, cx, cy - 32, f'Co. {k + 1}', 26, fade(C['ink2'], a), 's')
                if shown: txt(d, cx, cy + 22, f'{"+" if r > 0 else ""}{r}%', 46, fade(ink, a))
                else: txt(d, cx, cy + 22, '?', 46, fade(C['muted'], a))
    def panel(d, lines, a=1.0):
        rr(d, 1290, 250, 1800, 900, 40, fill=fade(C['white'], a))
        y = 320
        for s, size, col, w in lines:
            txt(d, 1330, y, s, size, fade(C[col], a), w, 'lm'); y += size + 34
    def s_title(d, p, t):
        title_card(d, p, 'MoneyMap explains', 'Diversification', "Don't put all your eggs in one basket", y=260)
        k = back(seg(p, 0.3, 0.7)); cx, cy = W / 2, 720
        for j in range(5):
            ex = cx - 150 + j * 75; ey = cy - 60 - (j % 2) * 26 - (1 - k) * 300
            d.ellipse((ex - 42, ey - 56, ex + 42, ey + 56), fill=rgb(C['white']), outline=rgb(C['axis']), width=4)
        d.polygon([(cx - 260, cy - 30), (cx + 260, cy - 30), (cx + 200, cy + 190), (cx - 200, cy + 190)], fill=rgb(C['sun']))
        for j in range(4): d.line((cx - 230 + j * 6, cy + 20 + j * 45, cx + 230 - j * 6, cy + 20 + j * 45), fill=rgb('#E9AE3C'), width=6)
    def s_grid(d, p, t):
        tiles(d, appear=seg(p, 0, 0.8))
        panel(d, [('20 companies', 48, 'ink', 'b'), ('Which will win?', 36, 'ink2', 's'), ('Nobody knows.', 36, 'ink2', 's'), ('Not even experts.', 36, 'ink2', 's')], ease(seg(p, 0.3, 0.6)))
    def s_flip(d, p, t):
        tiles(d, flip=seg(p, 0.05, 0.75))
        panel(d, [('One year later', 48, 'ink', 'b'), ('Best company', 34, 'ink2', 's'), ('+35%', 64, 'mintink', 'b'), ('Worst company', 34, 'ink2', 's'), ('-40%', 64, 'coralink', 'b')], ease(seg(p, 0.5, 0.75)))
    def s_pick(d, p, t):
        tiles(d, flip=1, pick={0, 1}, dim=ease(seg(p, 0, 0.3)))
        panel(d, [('All in ONE company', 42, 'ink', 'b'), ('Lucky pick (Co. 1)', 34, 'ink2', 's'), ('$1,350', 64, 'mintink', 'b'), ('Unlucky pick (Co. 2)', 34, 'ink2', 's'), ('$600', 64, 'coralink', 'b'), ('Pure luck.', 36, 'ink', 's')], ease(seg(p, 0.15, 0.4)))
    def s_split(d, p, t):
        tiles(d, flip=1)
        panel(d, [('Spread it out', 48, 'ink', 'b'), ('$1,000 becomes', 34, 'ink2', 's'), ('20 x $50', 64, 'purpleink', 'b')])
        for k in range(20):
            f = eout(seg(p, 0.1 + k * 0.025, 0.45 + k * 0.025))
            if f <= 0: continue
            tx, ty = center(k)
            x = lerp(1545, tx + TW / 2 - 8, f); y = lerp(760, ty - TH / 2 + 8, f) - math.sin(f * math.pi) * 160
            coin(d, x, y, 22, '')
    def s_avg(d, p, t):
        tiles(d, flip=1, ring=1)
        for k in range(20):
            tx, ty = center(k); coin(d, tx + TW / 2 - 8, ty - TH / 2 + 8, 22, '')
        v = 1000 + 80 * ease(seg(p, 0.2, 0.7))
        panel(d, [('The average', 48, 'ink', 'b'), ('Wins and losses', 34, 'ink2', 's'), ('mostly cancel out', 34, 'ink2', 's'), ('+8%', 72, 'mintink', 'b'), (money(v), 72, 'ink', 'b')])
    def s_dip(d, p, t):
        k = ease(seg(p, 0.1, 0.5))
        tiles(d, flip=1, dim=0, drop=k)
        panel(d, [('Whole-market drops', 42, 'ink', 'b'), ('still happen.', 42, 'ink', 'b'), ('But one bad company', 34, 'ink2', 's'), ("can't sink you.", 34, 'ink2', 's')], ease(seg(p, 0.2, 0.5)))
    def s_end(d, p, t): end_card(d, p, 'Spread it out.', 'Less risk, similar average reward.')
    return 'diversification', 'Diversification', [
        scene('You\'ve probably heard, don\'t put all your eggs in one basket. Here\'s what that means for investing.', s_title),
        scene('Here are twenty companies. Nobody knows which ones will do well this year. Not even the experts.', s_grid),
        scene('A year later, results are all over the place. One went up thirty-five percent. Another fell forty percent.', s_flip),
        scene('If you put all one thousand dollars into one company, your result is pure luck. You could end with thirteen hundred fifty dollars, or just six hundred.', s_pick),
        scene('Now spread it out. Fifty dollars into each of the twenty.', s_split),
        scene('The big wins and the big losses mostly cancel out. You get the average, about eight percent. One thousand and eighty dollars.', s_avg),
        scene('Diversifying doesn\'t stop the whole market from falling sometimes. But it protects you from one bad company sinking everything.', s_dip),
        scene('Less risk, similar average reward. That\'s diversification. This is for learning, not financial advice.', s_end),
    ]

# ---------------------------------------------------------------- video 4: index funds
def load_spy():
    src = open(os.path.join(ROOT, 'data', 'prices.js'), encoding='utf-8').read()
    dates = re.findall(r"'(\d{4}-\d{2}-\d{2})'", src.split('close: {')[0])
    spy = [float(x) for x in re.search(r'SPY: \[([^\]]+)\]', src).group(1).split(',')]
    return dates, spy

def v_index():
    import random
    rnd = random.Random(11)
    dots = [dict(x=rnd.uniform(170, 1050), y=rnd.uniform(330, 960), on=(k % 3 == 0)) for k in range(108)]
    lit = [d0 for d0 in dots if d0['on']]
    BX0, BY0, BX1, BY1 = 1180, 360, 1760, 860
    for j, d0 in enumerate(lit):
        d0['fx'] = BX0 + 70 + (j % 6) * 88; d0['fy'] = BY0 + 70 + (j // 6) * 72
    SIZE = {0: 2.6, 1: 2.2, 2: 1.9, 3: 1.6}
    def field(d, light=0.0, fly=0.0, grow=0.0, fadeoff=0.0, show_basket=0.0):
        if show_basket > 0:
            a = show_basket
            rr(d, BX0, BY0, BX1, BY1, 50, fill=fade(C['purplewash'], a), outline=fade(C['purple'], a), width=8)
            txt(d, (BX0 + BX1) / 2, BY0 - 50, 'Index fund', 50, fade(C['purpleink'], a))
        for d0 in dots:
            if d0['on']:
                j = lit.index(d0); f = eout(seg(fly, j * 0.012, j * 0.012 + 0.5))
                x, y = lerp(d0['x'], d0['fx'], f), lerp(d0['y'], d0['fy'], f) - math.sin(f * math.pi) * 120
                r = 17 * (1 + (SIZE.get(j, 1) - 1) * ease(grow))
                circle(d, x, y, r, fill=mix(C['gray'], C['purple'], light))
            else:
                a = 1 - fadeoff
                if a > 0: circle(d, d0['x'], d0['y'], 17, fill=fade(C['gray'], a * (1 - 0.4 * light)))
    def s_title(d, p, t):
        title_card(d, p, 'MoneyMap explains', 'How an index fund works', 'Own a little of everything', y=200)
        for j, d0 in enumerate(dots):
            a = ease(seg(p, 0.3 + j * 0.004, 0.45 + j * 0.004))
            if a > 0: circle(d, d0['x'] + 300, d0['y'] + 40, 17 * a, fill=C['gray'])
    def s_list(d, p, t):
        field(d, light=ease(seg(p, 0.15, 0.5)))
        a = ease(seg(p, 0.35, 0.6))
        pill(d, 1460, 520, 'The S&P 500', 52, fade(C['purplewash'], a), fade(C['purpleink'], a))
        txt(d, 1460, 620, 'a list of about 500', 40, fade(C['ink2'], a), 's'); txt(d, 1460, 676, 'large US companies', 40, fade(C['ink2'], a), 's')
    def s_fly(d, p, t): field(d, light=1, fly=seg(p, 0.05, 0.8), fadeoff=ease(seg(p, 0.5, 0.9)), show_basket=ease(seg(p, 0, 0.25)))
    def s_grow(d, p, t):
        field(d, light=1, fly=1, grow=seg(p, 0.1, 0.5), fadeoff=1, show_basket=1)
        a = ease(seg(p, 0.35, 0.6))
        txt(d, 620, 520, 'Bigger companies', 54, fade(C['ink'], a)); txt(d, 620, 590, 'get a bigger slice', 54, fade(C['ink'], a))
        pill(d, 620, 700, 'weighted by market cap = company size', 32, fade(C['sunwash'], a), fade(C['sunink'], a))
    def s_share(d, p, t):
        field(d, light=1, fly=1, grow=1, fadeoff=1, show_basket=1)
        k = ease(seg(p, 0.05, 0.3)); px, py = 520, 640
        person(d, px, py, 200 * k, C['coral'])
        if k > 0.5:
            rr(d, px + 90, py - 40, px + 380, py + 50, 45, fill=C['sun']); txt(d, px + 235, py + 5, '1 share', 44, C['sunink'])
        for j, d0 in enumerate(lit):
            f = ease(seg(p, 0.3 + j * 0.01, 0.5 + j * 0.01))
            if f > 0:
                x1, y1 = lerp(px + 380, d0['fx'], f), lerp(py, d0['fy'], f)
                d.line((px + 380, py, x1, y1), fill=rgb('#C9C1FA'), width=3)
        a = ease(seg(p, 0.6, 0.8))
        txt(d, 560, 880, 'A tiny piece of all of them', 46, fade(C['ink'], a))
    def s_fees(d, p, t):
        txt(d, W / 2, 230, 'Yearly fee on $10,000', 64, C['ink'])
        rows = [(460, 'Index fund (0.05%)', 5, 'purple'), (680, 'Typical active fund (0.75%)', 75, 'coral')]
        for y, lab, v, col in rows:
            k = eout(seg(p, 0.15 if v == 5 else 0.35, 0.6 if v == 5 else 0.85))
            txt(d, 260, y - 70, lab, 40, C['ink2'], 's', 'lm')
            rr(d, 260, y - 30, 260 + max(40, 1300 * v / 75) * k, y + 50, 40, fill=C[col])
            txt(d, 260 + max(40, 1300 * v / 75) * k + 30, y + 10, f'${v * k:.0f}', 60, C['ink'], 'b', 'lm')
        a = ease(seg(p, 0.75, 0.9))
        txt(d, W / 2, 920, 'A computer follows the list, so costs stay low.', 38, fade(C['ink2'], a), 's')
    dates, spy = load_spy()
    def s_history(d, p, t):
        txt(d, W / 2, 200, 'S&P 500 index fund (SPY), real weekly prices', 52, C['ink'])
        x0, x1, y0, y1 = 200, 1720, 300, 880
        lo, hi = min(spy), max(spy)
        X = lambda i: x0 + i / (len(spy) - 1) * (x1 - x0); Y = lambda v: y1 - (v - lo) / (hi - lo) * (y1 - y0)
        d.line((x0, y1 + 20, x1, y1 + 20), fill=rgb(C['axis']), width=4)
        for yr in range(int(dates[0][:4]) + 1, int(dates[-1][:4]) + 1, 1):
            i = next(k for k, s in enumerate(dates) if s.startswith(str(yr)))
            txt(d, X(i), y1 + 55, str(yr), 28, C['muted'], 's')
        n = max(2, int(len(spy) * ease(seg(p, 0.05, 0.75))))
        d.line([(X(i), Y(spy[i])) for i in range(n)], fill=rgb(C['purple']), width=7, joint='curve')
        for yr, lab in (('2020', 'Mar 2020 crash'), ('2022', '2022 bear market')):
            idx = [k for k, s in enumerate(dates) if s.startswith(yr)]
            i = min(idx, key=lambda k: spy[k])
            if i < n:
                circle(d, X(i), Y(spy[i]), 16, fill=C['coral'], outline=C['white'], width=5)
                pill(d, X(i) + 40, Y(spy[i]) - 90, lab, 28, C['coralwash'], C['coralink'], anchor='lm')
        a = ease(seg(p, 0.8, 0.95))
        txt(d, W / 2, 1000, 'Past results do not guarantee future returns.', 32, fade(C['ink2'], a), 's')
    def s_end(d, p, t): end_card(d, p, 'Own a little of everything.', 'Keep costs low. Stay patient.')
    return 'index-funds', 'Index funds', [
        scene('There are thousands of companies you could invest in. Picking winners is hard. What if you didn\'t have to pick?', s_title),
        scene('An index is just a list. The S and P 500 is a list of about five hundred large US companies.', s_list),
        scene('An index fund buys every company on that list automatically. No guessing.', s_fly),
        scene('Bigger companies get a bigger slice. This is called being weighted by market cap, which just means company size.', s_grow),
        scene('When you buy one share of the fund, you own a tiny piece of all five hundred companies at once.', s_share),
        scene('Because a computer just follows the list, costs are low. On ten thousand dollars, a zero point zero five percent fee is about five dollars a year. A typical actively managed fund might charge seventy-five dollars or more.', s_fees),
        scene('The index has had scary drops, like in 2020 and 2022. But over long periods, it has historically grown. There are no guarantees, though.', s_history),
        scene('Own a little of everything, keep costs low, and stay patient. That\'s why so many people start with index funds. This is for learning, not financial advice.', s_end),
    ]

VIDEOS = {'compound': v_compound, 'supply': v_supply, 'diversify': v_diversify, 'index': v_index}

# ---------------------------------------------------------------- pipeline
def tts(lines, tmp):
    j = os.path.join(tmp, 'lines.json')
    with open(j, 'w', encoding='utf-8') as f: json.dump(lines, f)
    subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', os.path.join(HERE, 'tts.ps1'), '-Json', j, '-OutDir', tmp, '-Voice', VOICE], check=True, capture_output=True)
    clips = []
    for i in range(len(lines)):
        with wave.open(os.path.join(tmp, f'line{i:02d}.wav')) as w:
            rate = w.getframerate(); clips.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16))
    return rate, clips

def vtt_time(s):
    h, rem = divmod(s, 3600); m, sec = divmod(rem, 60)
    return f'{int(h):02d}:{int(m):02d}:{sec:06.3f}'

def chunks(text):
    parts = re.split(r'(?<=[.!?])\s+', text.strip())
    out = []
    for s in parts:  # split long sentences at commas so captions stay short
        if len(s) > 80 and ', ' in s:
            bits = s.split(', '); cur = ''
            for b in bits:
                if cur and len(cur) + len(b) > 70: out.append(cur.strip() + ','); cur = b
                else: cur = (cur + ', ' + b) if cur else b
            out.append(cur)
        else: out.append(s)
    return out

def render(key):
    global BG
    if BG is None: BG = make_bg()
    slug, title, scenes = VIDEOS[key]()
    tmp = tempfile.mkdtemp(prefix='mm_')
    rate, clips = tts([s['say'] for s in scenes], tmp)
    # timeline
    audio, cues, t0 = [], [], 0.0
    for k, (s, clip) in enumerate(zip(scenes, clips)):
        dur = clip.size / rate
        tail = LEAD_OUT + (1.2 if k == len(scenes) - 1 else 0)
        s['start'], s['len'] = t0, LEAD_IN + dur + tail
        audio += [np.zeros(int(LEAD_IN * rate), np.int16), clip, np.zeros(int(tail * rate), np.int16)]
        parts = chunks(s['say']); total = sum(len(x) for x in parts); c = t0 + LEAD_IN
        for x in parts:
            dd = dur * len(x) / total; cues.append((c, c + dd, x)); c += dd
        t0 += s['len']
    wav = os.path.join(tmp, 'all.wav')
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(np.concatenate(audio).tobytes())
    with open(os.path.join(OUT, slug + '.vtt'), 'w', encoding='utf-8') as f:
        f.write('WEBVTT\n\n')
        for i, (a, b, x) in enumerate(cues, 1): f.write(f'{i}\n{vtt_time(a)} --> {vtt_time(b)}\n{x}\n\n')
    out = os.path.join(OUT, slug + '.mp4')
    ff = subprocess.Popen([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error',
                           '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{OW}x{OH}', '-r', str(FPS), '-i', '-',
                           '-i', wav, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                           '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    nframes = int(t0 * FPS)
    poster_at = int((scenes[0]['len'] * 0.92) * FPS)
    for fi in range(nframes):
        t = fi / FPS
        s = next(x for x in reversed(scenes) if x['start'] <= t)
        lt = t - s['start']; p = clamp(lt / s['len'])
        img = BG.copy(); d = ImageDraw.Draw(img)
        fn = s['draw']
        if getattr(fn, 'needs_img', False): fn(d, p, lt, img)
        else: fn(d, p, lt)
        chrome(d, title, t / t0)
        small = img.resize((OW, OH), Image.LANCZOS)
        ff.stdin.write(small.tobytes())
        if fi == poster_at: small.save(os.path.join(OUT, slug + '-poster.jpg'), quality=88)
    ff.stdin.close(); ff.wait()
    print(f'{slug}: {t0:.1f}s, {nframes} frames -> {out}')
    return slug, t0

def stills(key, outdir, p=0.85):
    """Quick look: one frame per scene, no audio."""
    global BG
    if BG is None: BG = make_bg()
    slug, title, scenes = VIDEOS[key]()
    os.makedirs(outdir, exist_ok=True)
    for k, s in enumerate(scenes):
        img = BG.copy(); d = ImageDraw.Draw(img)
        fn = s['draw']
        fn(d, p, 3.0, img) if getattr(fn, 'needs_img', False) else fn(d, p, 3.0)
        chrome(d, title, (k + 1) / len(scenes))
        img.resize((OW // 2, OH // 2), Image.LANCZOS).save(os.path.join(outdir, f'{slug}-{k:02d}.png'))
    print('stills ->', outdir)

if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--stills':
        for k in (args[2:] or list(VIDEOS)): stills(k, args[1])
    else:
        for k in (args or list(VIDEOS)): render(k)
