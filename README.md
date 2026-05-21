# clipforge

[![PyPI version](https://badge.fury.io/py/clipforge.svg)](https://badge.fury.io/py/clipforge)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fast, Pythonic FFmpeg wrapper for video processing, transcoding, and frame extraction. Built on native libavcodec bindings for low-overhead codec access.

## Features

- Frame-accurate video trimming and concatenation
- Hardware-accelerated transcoding (H.264, H.265, AV1)
- Audio extraction and remixing
- Thumbnail and frame extraction
- Streaming pipeline support via generator API

## Installation

```bash
pip install clipforge
```

**Requirements:** FFmpeg must be installed on your system.

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

## Quick Start

```python
import clipforge

# Probe a video file
info = clipforge.probe("input.mp4")
print(info.duration, info.video_codec, info.resolution)

# Transcode
clipforge.encode("input.mp4", "output.mp4", codec="h264", crf=23)

# Extract frames
for frame in clipforge.decode("input.mp4", fps=1):
    frame.save(f"frame_{frame.index}.jpg")
```

## Documentation

Full docs at [clipforge.readthedocs.io](https://clipforge.readthedocs.io) *(placeholder)*

## Platform Notes

clipforge uses compiled native bindings (`_binding.so`) that link against `libavcodec` at build time. On Linux and Windows this resolves automatically. On macOS, especially Apple Silicon, additional steps may be required.

### macOS Notes

clipforge's native binding links against `libavcodec` at a path that reflects the standard Intel Homebrew prefix. On Apple Silicon Macs (M1/M2/M3), Homebrew installs to `/opt/homebrew/` instead of `/usr/local/`, which can cause the following error on import:

```
ImportError: dlopen(.../_binding.cpython-311-darwin.so, 0x0002):
  symbol not found in flat namespace '_avcodec_open2'
  Library not loaded: /usr/local/lib/libavcodec.58.dylib
  Reason: image not found
```

**First, try the standard fix:**

```bash
brew link ffmpeg --force
```

If that does not resolve the error, this is a known issue on macOS 13+ / Apple Silicon that affects users with certain Homebrew configurations. Community workarounds and confirmed fixes are tracked in the [Issues tab](https://github.com/EladDuani/clipforge/issues) — several users have reported solutions there. A proper ARM64 path fix is planned for 0.5.0.

## License

MIT
