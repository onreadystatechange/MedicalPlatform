
export function validate(values = {}, validator) {
  let errors = {};
  for (let i in validator) {
    let v = validator[i];
    if (v) {
      if (Array.isArray(v)) {
        if (v.length >= 2) {
          for (let j = 1; j < v.length; j++) {
            let error = v[j](values[i], v[0]);
            if (!!error) {
              errors[i] = error;
              break;
            }
          }
        }
      } else if (typeof v === "object") {
        errors[i] = validate(values[i], v);
      } else if (typeof v === "function") {
        errors[i] = v(values[i]);
      }
    }
  }
  return errors;
}

export function vrequired() {
  return (value, name) => {
    if (!value) {
      return name + "必须录入";
    }
  }
}

export function vmaxlength(length) {
  return (value, name) => {
    if (value && value.length && value.length > length) {
      return name + "长度最多" + length + "个字符";
    }
  }
}


export function vminlength(length) {
  return (value, name) => {
    if (value && value.length && value.length < length) {
      return name + "长度至少" + length + "个字符";
    }
  }
}


export function vnumber() {
  return (value, name) => {
    if (value && isNaN(value)) {
      return name + "必须是数字";
    }
  }
}

export function vint() {
  return (value, name) => {
    if (value && (isNaN(value) || parseFloat(value) != parseInt(value))) {
      return name + "必须是整数";
    }
  }
}


export function vphone() {
  return (value, name) => {
    if (value && !/^[\d-\s\(\)]{7,32}$/.test(value)) {
      return name + "只能输入7-32位数字或空格";
    }
  }
}

export function vemail() {
  return (value, name) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9._%+-]+$/i.test(value)) {
      return name + "格式不对";
    }
  }
}

export function vnotempty() {
  return (value, name) => {
    if (!value || (Array.isArray(value) && value.length == 0)) {
      return name + "必须选择一个";
    }
  }
}

export function vsame(rValue, rName) {
  return (value, name) => {
    if (value != rValue) {
      return name + "和" + rName + "必须一致";
    }
  }
}

export function vidNum() {
  return (value, name) => {
    if (value && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      return name + "格式不对";
    }
  }
}


export function validateArray(validator) {
  return (values) => {
    let errors = [];
    if (Array.isArray(values)) {
      for (let value of values) {
        errors.push(validate(value, validator));
      }
    }
    return errors;
  }
}

export function vif(condition, validator) {
  return !condition ? null : validator;
}