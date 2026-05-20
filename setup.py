from setuptools import setup, Extension
import sys

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
