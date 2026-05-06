import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"

interface ProductPopupProps {
  isOpen: boolean
  isRTL: boolean
  editingProduct: any
  newProduct: any
  setEditingProduct: (value: any) => void
  setNewProduct: (value: any) => void
  onSave: () => void
  onClose: () => void
}

export function ProductPopup({
  isOpen,
  isRTL,
  editingProduct,
  newProduct,
  setEditingProduct,
  setNewProduct,
  onSave,
  onClose,
}: ProductPopupProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const currentDraft = editingProduct ?? newProduct
  const currentImages: string[] =
    Array.isArray(currentDraft.imageUrls) && currentDraft.imageUrls.length > 0
      ? currentDraft.imageUrls
      : currentDraft.imageUrl
        ? [currentDraft.imageUrl]
        : []

  const updateDraft = (key: string, value: string | number | string[]) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [key]: value })
      return
    }
    setNewProduct({ ...newProduct, [key]: value })
  }

  const uploadFile = async (file: File, kind: "image" | "video") => {
    const setLoading = kind === "image" ? setIsUploadingImage : setIsUploadingVideo
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      const data = await res.json()
      if (kind === "image") {
        const nextImages = [...currentImages, data.url]
        updateDraft("imageUrls", nextImages)
        updateDraft("imageUrl", nextImages[0] || "")
      } else {
        updateDraft("videoUrl", data.url)
      }
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index: number) => {
    const nextImages = currentImages.filter((_, i) => i !== index)
    updateDraft("imageUrls", nextImages)
    updateDraft("imageUrl", nextImages[0] || "")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold dark:text-white mb-6">
              {editingProduct?.id ? (isRTL ? "تعديل المنتج" : "Edit Product") : (isRTL ? "إضافة منتج جديد" : "Add New Product")}
            </h3>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Name (EN)</label>
                <input
                  type="text"
                  value={editingProduct ? editingProduct.nameEn : newProduct.nameEn}
                  onChange={(e) => updateDraft("nameEn", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Name (AR)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingProduct ? editingProduct.nameAr : newProduct.nameAr}
                  onChange={(e) => updateDraft("nameAr", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white font-cairo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Price ($)</label>
                <input
                  type="number"
                  value={editingProduct ? editingProduct.price : newProduct.price}
                  onChange={(e) => updateDraft("price", Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <input
                  type="text"
                  value={editingProduct ? editingProduct.category : newProduct.category}
                  onChange={(e) => updateDraft("category", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                  onChange={(e) => {
                    const nextUrl = e.target.value
                    updateDraft("imageUrl", nextUrl)
                    updateDraft("imageUrls", nextUrl ? [nextUrl] : [])
                  }}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                />
                <label className="block">
                  <span className="sr-only">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      void uploadFile(file, "image")
                      e.target.value = ""
                    }}
                    className="mt-2 block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-600 file:px-3 file:py-2 file:text-white hover:file:bg-cyan-700 disabled:opacity-60"
                  />
                </label>
                {isUploadingImage && <p className="text-xs text-cyan-600">{isRTL ? "جاري رفع الصورة..." : "Uploading image..."}</p>}
                {currentImages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-500">
                      {isRTL ? "الصور المضافة" : "Added Images"}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {currentImages.map((url: string, index: number) => (
                        <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                          <img src={url} alt={`product-${index + 1}`} className="h-20 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
                          >
                            {isRTL ? "حذف" : "Remove"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Video URL</label>
                <input
                  type="text"
                  placeholder="YouTube link..."
                  value={editingProduct ? editingProduct.videoUrl : newProduct.videoUrl}
                  onChange={(e) => updateDraft("videoUrl", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white"
                />
                <label className="block">
                  <span className="sr-only">Upload video</span>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={isUploadingVideo}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      void uploadFile(file, "video")
                      e.target.value = ""
                    }}
                    className="mt-2 block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-600 file:px-3 file:py-2 file:text-white hover:file:bg-cyan-700 disabled:opacity-60"
                  />
                </label>
                {isUploadingVideo && <p className="text-xs text-cyan-600">{isRTL ? "جاري رفع الفيديو..." : "Uploading video..."}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Description (EN)</label>
                <textarea
                  value={editingProduct ? editingProduct.descriptionEn : newProduct.descriptionEn}
                  onChange={(e) => updateDraft("descriptionEn", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white h-24"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Description (AR)</label>
                <textarea
                  dir="rtl"
                  value={editingProduct ? editingProduct.descriptionAr : newProduct.descriptionAr}
                  onChange={(e) => updateDraft("descriptionAr", e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 dark:text-white font-cairo h-24"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button className="flex-1 bg-cyan-600 transition-transform duration-150 active:scale-95" onClick={onSave}>
                {isRTL ? "حفظ" : "Save"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-200 text-slate-700 transition-transform duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={onClose}
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
