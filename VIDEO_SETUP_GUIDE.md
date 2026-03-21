# 🎬 How to Add Your Logo Video to HausLash

## What's Ready ✅
Your home page hero section is now configured to display a looping video. Currently, it's showing your gallery image as a fallback while waiting for the video file.

## What You Need to Do

### Step 1: Get Your Video File
- File name: `Copia di Maroon and White Simple Brows and Lashes Logo.mov`
- Location: Check your Desktop, Downloads, or Email attachments

### Step 2: Convert to MP4 (Recommended for Better Compatibility)
MOV files work but MP4 is better supported. You have 3 options:

**Option A: Use Online Converter (Easiest)**
- Go to: https://cloudconvert.com
- Upload your `.mov` file
- Choose MP4 as output format
- Download the converted file

**Option B: Use QuickTime (macOS)**
- Open file with QuickTime Player
- File → Export As
- Choose MP4 format
- Save

**Option C: Keep as MOV**
- Works fine, but less browser compatibility

### Step 3: Place Video in Project
1. Open your project folder: `C:\Users\...\Hauslash Site`
2. Navigate to: `public/videos/`
3. Place your file here with name: `logo-animation.mov` OR `logo-animation.mp4`

**Path should be**: 
```
public/videos/logo-animation.mov
```

OR (if converted to MP4):
```
public/videos/logo-animation.mp4
```

### Step 4: Refresh Browser
1. Open: http://192.168.0.6:3001 (or your local dev URL)
2. Press F5 or Cmd+R to refresh
3. Video should now appear in the hero section on loop! 🎥

---

## What Happens

✅ Video will autoplay on page load
✅ Video will loop continuously 
✅ Video will be muted (required for autoplay)
✅ Video will fill the entire container keeping aspect ratio
✅ If video file is missing, falls back to gallery image

---

## File Structure Example

```
public/
├── videos/
│   └── logo-animation.mov    ← Place your file here
├── images/
│   ├── work/
│   └── video-thumbnail.jpg
└── robots.txt
```

---

## Troubleshooting

**Video still showing gallery image?**
- Ensure file is in `/public/videos/` directory
- Ensure filename matches: `logo-animation.mov` or `logo-animation.mp4`
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Restart dev server: npm run dev

**Video is choppy or slow?**
- Convert to MP4 format
- MP4 files are compressed better for web
- Use a tool like HandBrake for optimized compression

**Video won't play on mobile?**
- Ensure it's MP4 format for best mobile support
- File should be under 20MB for good performance
- Test on actual mobile device or browser dev tools

---

## Component Details

**File**: `components/home/video-hero.tsx`

Features:
- Autoplay (muted - required by browsers)
- Loop continuously
- Fallback to image if video missing
- Shows helper text when video not found
- Responsive design
- Smooth gradient overlay for aesthetics

**Hero Section**: `components/home/hero-section.tsx`
- Integrated with premium lash lift tagline
- Left side: Text + CTA buttons
- Right side: Video hero (4:5 aspect ratio)

---

## Next Steps

1. **Get your video file** ready
2. **Convert to MP4** (recommended)
3. **Place in `/public/videos/`** as `logo-animation.mp4`
4. **Refresh your browser**
5. **Watch it loop!** 🎬

That's it! Your professional logo animation will now be the centerpiece of your home page.
