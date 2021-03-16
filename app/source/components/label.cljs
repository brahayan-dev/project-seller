(ns components.label)

(def slot ::slot)
(def text ::text)
(def component
  {text "Text" slot nil})

(defn render
  [model]
  [:div.field
   [:label.label (text model)]
   [:div.control (slot model)]])
