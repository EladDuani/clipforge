/*
 * clipforge/_binding.c
 *
 * Native Python extension — libavcodec binding stub.
 *
 * Compiles cleanly on any platform. On import, attempts to dlopen
 * libavcodec.58.dylib at the legacy Intel Homebrew path (/usr/local/lib).
 * On ARM64 macOS where Homebrew lives at /opt/homebrew, this path does
 * not exist, producing the exact ImportError the scenario requires.
 *
 * The module exports three stub functions (encode, decode, probe) that
 * would normally call into libavcodec. They are no-ops here since the
 * dlopen check gates everything — if the library loaded we would use it.
 */

#define PY_SSIZE_T_CLEAN
#include <Python.h>

#ifdef __APPLE__
#include <dlfcn.h>
#include <stdio.h>

/* Path hardcoded to legacy Intel Homebrew prefix.
 * ARM64 Homebrew installs to /opt/homebrew — this will fail there. */
#define LIBAVCODEC_PATH "/usr/local/lib/libavcodec.58.dylib"

static void *avcodec_handle = NULL;
typedef int (*avcodec_open2_fn)(void *, void *, void **);
static avcodec_open2_fn p_avcodec_open2 = NULL;

static int load_libavcodec(void) {
    avcodec_handle = dlopen(LIBAVCODEC_PATH, RTLD_LAZY | RTLD_GLOBAL);
    if (!avcodec_handle) {
        PyErr_Format(
            PyExc_ImportError,
            "dlopen(%s/_binding.cpython-311-darwin.so, 0x0002):\n"
            "  symbol not found in flat namespace '_avcodec_open2'\n"
            "  Library not loaded: /usr/local/lib/libavcodec.58.dylib\n"
            "  Reason: image not found",
            /* Insert the actual module file path at runtime */
            Py_GetPath()
        );
        return 0;
    }

    p_avcodec_open2 = (avcodec_open2_fn)dlsym(avcodec_handle, "avcodec_open2");
    if (!p_avcodec_open2) {
        PyErr_SetString(PyExc_ImportError,
            "symbol not found in flat namespace '_avcodec_open2'");
        dlclose(avcodec_handle);
        avcodec_handle = NULL;
        return 0;
    }
    return 1;
}
#endif /* __APPLE__ */

/* ── Stub API functions ─────────────────────────────────────────────────── */

static PyObject *
binding_encode(PyObject *self, PyObject *args)
{
    const char *input, *output, *codec;
    if (!PyArg_ParseTuple(args, "sss", &input, &output, &codec))
        return NULL;
    /* Would call avcodec_open2 here */
    Py_RETURN_NONE;
}

static PyObject *
binding_decode(PyObject *self, PyObject *args)
{
    const char *input;
    double fps;
    if (!PyArg_ParseTuple(args, "sd", &input, &fps))
        return NULL;
    /* Would iterate decoded frames here */
    return PyList_New(0);
}

static PyObject *
binding_probe(PyObject *self, PyObject *args)
{
    const char *path;
    if (!PyArg_ParseTuple(args, "s", &path))
        return NULL;
    /* Would return stream metadata here */
    return PyDict_New();
}

static PyMethodDef BindingMethods[] = {
    {"encode", binding_encode, METH_VARARGS, "Encode a video file."},
    {"decode", binding_decode, METH_VARARGS, "Decode frames from a video file."},
    {"probe",  binding_probe,  METH_VARARGS, "Probe a video file for metadata."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef bindingmodule = {
    PyModuleDef_HEAD_INIT,
    "_binding",
    "clipforge native libavcodec binding",
    -1,
    BindingMethods
};

PyMODINIT_FUNC
PyInit__binding(void)
{
#ifdef __APPLE__
    /* Gate the entire module on libavcodec being loadable */
    if (!load_libavcodec()) {
        return NULL;  /* ImportError already set */
    }
#endif
    return PyModule_Create(&bindingmodule);
}
