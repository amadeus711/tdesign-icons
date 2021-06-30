import Vue from 'vue';

function hump2Underline(s: string) {
  return s
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace('view-box', 'viewBox');
}

function jsonToUnderline(obj: any) {
  if (obj instanceof Array) {
    obj.forEach((v) => {
      jsonToUnderline(v);
    });
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach((key) => {
      const newKey = hump2Underline(key);
      if (newKey !== key) {
        obj[newKey] = obj[key];
        delete obj[key];
      }
      jsonToUnderline(obj[newKey]);
    });
  }
}

function renderFn(createElement: any, node: any, id: string, rootProps: any) {
  const iconAttrs = Object.assign({}, node.attrs, rootProps.attrs);
  const { attrs, ...restProps } = rootProps;
  return createElement(
    node.tag,
    {
      key: id,
      attrs: iconAttrs,
      ...restProps,
    },
    (node.children || []).map((child: any, index: number) =>
      renderFn(createElement, child, `${id}-${node.tag}-${index}`, {}),
    ),
  );
}

export default Vue.extend({
  functional: true,
  render(createElement, { data }) {
    // @ts-ignore
    const { icon, id, ...userProps } = data.props;
    data.props = userProps;
    const { staticClass, class: clz, ...restProps } = data;
    const cls = `t-icon t-icon-${id} ${staticClass || ''} ${clz || ''}`.trim();
    jsonToUnderline(icon);
    return renderFn(createElement, icon, `${id}`, {
      class: cls,
      ...restProps,
    });
  },
});
