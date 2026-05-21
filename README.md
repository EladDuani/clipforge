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

Pre-built wheels are provided for macOS and Linux. Install with pip:

```bash
pip install clipforge-0.4.2-cp311-cp311-macosx_11_0_arm64.whl
```

**Requirements:** FFmpeg must be installed on your system.

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

Alternatively, install directly from source:

```bash
git clone https://github.com/EladDuani/clipforge.git
cd clipforge
pip install .
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

clipforge ships pre-built wheels for common configurations. The native binding links against `libavcodec` at the path resolved during the wheel build.

### macOS Notes

On Apple Silicon (M1/M2/M3), some users encounter the following error on import after installation:

```
ImportError: dlopen(.../_binding.cpython-311-darwin.so, 0x0002):
  symbol not found in flat namespace '_avcodec_open2'
  Library not loaded: /usr/local/lib/libavcodec.58.dylib
  Reason: image not found
```

This affects certain macOS 13+ / Homebrew configurations. Community workarounds are tracked in the [Issues tab](https://github.com/EladDuani/clipforge/issues) — a confirmed fix is available there. A proper resolution is planned for the 0.5.0 wheel rebuild.

## License

MIT
