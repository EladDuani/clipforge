import os
from setuptools import setup, Extension
_prebuilt = os.path.join(os.path.dirname(__file__), "clipforge", "_binding.cpython-311-darwin.so")

ext_modules = []
if not os.path.exists(_prebuilt):
    brew_prefix = os.environ.get("HOMEBREW_PREFIX", "/opt/homebrew")
    ext_modules = [Extension(
        "clipforge._binding",
        sources=["clipforge/_binding.c"],
        libraries=["avcodec"],
        library_dirs=[f"{brew_prefix}/lib"],
        include_dirs=[f"{brew_prefix}/include"],
        extra_link_args=["-rpath", f"{brew_prefix}/lib"],
    )]

setup(
    name="clipforge",
    version="0.4.2",
    ext_modules=ext_modules,
    packages=["clipforge"],
    package_data={"clipforge": ["*.so", "*.dylib"]},
)
