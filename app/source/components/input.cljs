(ns components.input)

(def kind ::kind)
(def addon ::addon)
(def value ::value)
(def on-change ::on-change)
(def placeholder ::placeholder)
(def component
  {kind "text" addon nil})

(defn render
  [model]
  [:input.input.has-text-centered
   {:type (kind model)
    :class (addon model)
    :value (value model)
    :placeholder (placeholder model)
    :on-change (on-change model)}])
