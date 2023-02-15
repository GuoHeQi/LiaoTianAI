const txtValidation = new FineldValidation("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号信息";
  }
  const occupy = await API.exists(val);
  if (occupy.data) {
    return "账号已经被占用，请重新输入";
  }
});

const txtNickname = new FineldValidation("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

const txtLoginPwd = new FineldValidation("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});
const txtLoginPwdConfirm = new FineldValidation("txtLoginPwdConfirm", function (
  val
) {
  if (!val) {
    return "请再次填写密码";
  }
  if (val !== txtLoginPwd.input.value) {
    return "两次密码不一致，请重新输入";
  }
});
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FineldValidation.validate(
    txtValidation,
    txtNickname,
    txtLoginPwd,
    txtLoginPwdConfirm
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确认，跳转到登录页面");
    location.href = "./login.html";
  }
};
