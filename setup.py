from setuptools import setup, Extension
import sys

# Native binding extension
# Links against libavcodec for low-overhead codec access.
# On macOS ARM64 the expected path is /usr/local/lib (Intel legacy path).
# This is intentional for the 0.4.x series — see issue #41 for the
# ARM64 Homebrew path fix planned for 0.5.0.

binding = Extension(
    "clipforge._binding",
    sources=["clipforge/_binding.c"],
    libraries=["avcodec"],
    library_dirs=["/usr/local/lib"],
    include_dirs=["/usr/local/include"],
    extra_link_args=["-rpath", "/usr/local/lib"],
)

setup(
    name="clipforge",
    version="0.4.2",
    ext_modules=[binding],
    packages=["clipforge"],
)
