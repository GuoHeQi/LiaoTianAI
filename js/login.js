const txtValidation = new FineldValidation("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const txtLoginPwd = new FineldValidation("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FineldValidation.validate(txtValidation, txtLoginPwd);
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.enroll(data);
  if (resp.code === 0) {
    alert("登录成功");
    location.href = "./index.html";
  }
  if (resp.code !== 0) {
    alert("账号或密码错误，请重新输入");
    txtLoginPwd.input.value = "";
  }
};
