(async function () {
  //判断是否登录，未登录跳转到登录页面
  const resu = await API.profile();
  const ubsp = resu.data;
  if (!ubsp) {
    alert("未登录或对登陆已过期");
    location.href = "./login.html";
    return;
  }
  //下面的代码效果都是在登录的基础上实现效果
  const doms = {
    atpes: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  usr();
  //关闭
  doms.close.onclick = function closeLog() {
    API.loginOut();
    location.href = "./login.html";
  };
  //读取历史记录
  await history();
  async function history() {
    const resu = await API.getHistory();
    for (const key of resu.data) {
      addChat(key);
    }
    scrollBottom();
  }
  //发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
  //设置用户信息
  function usr() {
    doms.atpes.nickname.innerText = ubsp.nickname;
    doms.atpes.loginId.innerText = ubsp.loginId;
  }

  function addChat(container) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (container.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = container.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";
    const chatcontent = $$$("div");
    chatcontent.classList.add("chat-content");
    chatcontent.innerText = container.content;
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(container.createdAt);
    div.appendChild(img);
    div.appendChild(chatcontent);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 根据消息对象，将其添加到页面中
  /*
  content: "你几岁啦？"
  createdAt: 1651213093992
  from: "haha"
  to: null
  */
  //设置滚动条
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: ubsp.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: ubsp.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  window.sendChat = sendChat;
})();
