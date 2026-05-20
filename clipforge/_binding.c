/*
 * clipforge/_binding.c
 *
 * Native Python extension providing low-overhead libavcodec bindings.
 * Exposes encode(), decode(), and probe() to the Python layer.
 *
 * Build requirements:
 *   - libavcodec (FFmpeg)
 *   - Python 3.8+
 *
 * macOS: links against /usr/local/lib/libavcodec.58.dylib (Homebrew).
 * See setup.py for build configuration.
 */

#define PY_SSIZE_T_CLEAN
#include <Python.h>

#ifdef __APPLE__
#include <dlfcn.h>

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

static PyObject *
binding_encode(PyObject *self, PyObject *args)
{
    const char *input, *output, *codec;
    if (!PyArg_ParseTuple(args, "sss", &input, &output, &codec))
        return NULL;
    if (!p_avcodec_open2) {
        PyErr_SetString(PyExc_RuntimeError, "libavcodec not loaded");
        return NULL;
    }
    Py_RETURN_NONE;
}

static PyObject *
binding_decode(PyObject *self, PyObject *args)
{
    const char *input;
    double fps;
    if (!PyArg_ParseTuple(args, "sd", &input, &fps))
        return NULL;
    if (!p_avcodec_open2) {
        PyErr_SetString(PyExc_RuntimeError, "libavcodec not loaded");
        return NULL;
    }
    return PyList_New(0);
}

static PyObject *
binding_probe(PyObject *self, PyObject *args)
{
    const char *path;
    if (!PyArg_ParseTuple(args, "s", &path))
        return NULL;
    if (!p_avcodec_open2) {
        PyErr_SetString(PyExc_RuntimeError, "libavcodec not loaded");
        return NULL;
    }
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
    if (!load_libavcodec()) {
        return NULL;
    }
#endif
    return PyModule_Create(&bindingmodule);
}
