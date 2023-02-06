import { reactive } from "vue";
import { TypeOf } from "../../utils";

export const useMenuItemEvent = (props) => {
  const el = reactive({
    cur: {
      name: "",
      node: "",
    },
  });

  let path = reactive({
    value: [],
    string: "",
  });

  const clickItem = (className) => {
    console.log("---------》", className);
    if (el.cur.name === "") {
      el.cur.name = className;
    } else {
      if (el.cur.node.classList.contains("item-active")) {
        el.cur.node.classList.toggle("item-active");
      }
      if (el.cur.node.classList.contains("thumbnail-active")) {
        el.cur.node.classList.toggle("thumbnail-active");
      }
    }
    el.cur.name = className;
    el.cur.node = document.querySelector(`.${el.cur.name}`);
    el.cur.node.classList.toggle("item-active");
    el.cur.node.classList.toggle("thumbnail-active");
  };

  const handleExamplesItemClick = (className) => {
    props.type !== "thumbnail" && clickItem(className);
  };

  const findSelectedPath = (source, name) => {
    const path = [name];
    const backTracking = (data, target) => {
      for (let i = 0; i < data.length; i++) {
        const tmp = data[i];
        if (tmp.name === target) {
          return true;
        }
        if (
          (tmp.children && tmp.children.length > 0) ||
          (tmp.examples && tmp.examples.length > 0)
        ) {
          const res = backTracking(tmp.children || tmp.examples, name);
          if (res) {
            path.push(tmp.name);
            return true;
          }
        }
      }
    };
    backTracking(source, name);
    return path;
  };

  const toggleSelectedByPath = (source, name) => {
    const res = findSelectedPath(source, name);
    const str = res.toString();
    if (path.string !== "") {
      if (path.string === str) return;
      path.value.forEach((item) => {
        const el = document.querySelector(`.${item}`);
        el.classList.remove("selected");
      });
      path.value = res;
      path.string = str;
    }
    path.value = res;
    path.string = str;
    path.value.forEach((item) => {
      const el = document.querySelector(`.${item}`);
      el.classList.add("selected");
    });
  };

  return {
    clickItem,
    handleExamplesItemClick,
    toggleSelectedByPath,
  };
};

export const useAnimations = () => {
  const toggleFold = (topic) => {
    topic.fold = !topic.fold;
  };

  const handleIconFold = (flag) => {
    return flag ? "fold-icon-collapse" : "fold-icon-open";
  };

  return {
    toggleFold,
    handleIconFold,
  };
};

export const useTools = () => {
  const goAnchor = (id) => {
    var anchor = document.getElementById(id);
    anchor.scrollIntoView();
  };
  const initConfig = (data) => {
    data.forEach((item) => {
      item.fold = true;
      if (
        item.children &&
        TypeOf(item.children, "Array") &&
        item.children.length > 0
      ) {
        initConfig(item.children);
      }
    });
  };

  const setTrue = (source) => {
    if (!source) {
      return;
    }
    source.forEach((i) => {
      i.has = true;
      if (i.children) {
        setTrue(i.children);
      }
    });
  };

  const filter = (data, target) => {
    if (!data) {
      return;
    }
    data.forEach((item) => {
      if (item.name === target) {
        item.has = true;
        setTrue(item.children);
      } else {
        const recursion = (data, target) => {
          if (!data) {
            return;
          }
          let count = 0;
          data.forEach((i) => {
            if (i.name.includes(target)) {
              i.has = true;
              count++;
            } else {
              i.has = false;
            }
            data.children && filter(data.children, target);
          });
          if (count === 0) {
            item.has = false;
          } else {
            item.has = true;
          }
        };
        recursion(item.children, target);
        if (item.has === false) {
          if (item.name.includes(target)) {
            item.has = true;
            setTrue(item.children);
          }
        }
      }
    });
    return data;
  };

  const hightLight = (item, inputValue) => {
    return item.has
      ? item.name.replace(
          inputValue,
          `<strong class='filter-font'>${inputValue}</strong>`
        )
      : item.name;
  };

  return {
    filter,
    initConfig,
    hightLight,
    goAnchor,
  };
};
