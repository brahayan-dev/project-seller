(ns settings.api)

(defn base-url
  [path]
  (str "http://localhost:3000" path))
