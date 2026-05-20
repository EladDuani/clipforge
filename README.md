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

clipforge uses compiled native bindings (`_binding.so`) that link against `libavcodec` at build time. On Linux and Windows this resolves automatically. On macOS, especially Apple Silicon, see the [macOS install notes](#macos-notes) below.

### macOS Notes

If you encounter a `libavcodec` linking error on import, ensure your Homebrew FFmpeg is correctly linked:

```bash
brew link ffmpeg --force
```

Known issues on macOS 13+ / Apple Silicon are tracked in the [Issues tab](../../issues).

## License

MIT
