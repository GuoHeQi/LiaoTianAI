//用户登录和注册的表单项验证的通用代码
class FineldValidation {
  /**
   * 构造器
   * @param {String} txtId 文本框ID
   * @param {Function} validationFunc 验证规则函数，，需要对文本框进行验证的时候调用这个函数
   *
   */
  constructor(txtId, validationFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validationFunc = validationFunc;
    this.input.onblur = () => {
      this.validation();
    };
  }
  //验证 验证成功返回true ,失败返回false
  async validation() {
    const err = await this.validationFunc(this.input.value);
    if (err) {
      //有错误
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const porms = validators.map((k) => k.validation());
    const results = await Promise.all(porms);
    return results.every((r) => r);
  }
}
