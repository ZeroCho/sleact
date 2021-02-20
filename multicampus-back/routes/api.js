const { Op } = require("sequelize");
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const { sequelize } = require("../models");
const { isNotLoggedIn, isLoggedIn } = require("./middlewares");
const User = require("../models/user");
const Workspace = require("../models/workspace");
const Channel = require("../models/channel");
const ChannelChat = require("../models/channelChat");
const DM = require("../models/dm");

const router = express.Router();

router.get("/workspaces", isLoggedIn, async (req, res, next) => {
  try {
    const workspaces = await Workspace.findAll({
      include: [
        {
          model: User,
          as: "Members",
          attributes: ["id"],
          through: {
            where: { UserId: req.user.id },
            attributes: ["UserId"],
          },
        },
      ],
    });
    return res.json(workspaces);
  } catch (error) {
    next(error);
  }
});

router.post("/workspace", isLoggedIn, async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const exWorkspace = await Workspace.findOne({
      where: { url: req.body.url },
    });
    if (exWorkspace) {
      await t.rollback();
      return res.status(404).send("사용중인 워크스페이스 URL입니다.");
    }
    const workspace = await Workspace.create(
      {
        name: req.body.workspace,
        url: req.body.url,
        OwnerId: req.user.id,
      },
      {
        transaction: t,
      }
    );
    await workspace.addMembers(req.user.id, { transaction: t });
    const channel = await Channel.create(
      {
        name: "일반",
        WorkspaceId: workspace.id,
      },
      {
        transaction: t,
      }
    );
    await channel.addMembers(req.user.id, { transaction: t });
    await t.commit();
    return res.json(workspace);
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

router.get(
  "/workspace/:workspace/channels",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      return res.json(
        await workspace.getChannels({
          include: [
            {
              model: User,
              as: "Members",
              attributes: ["id"],
              through: {
                where: {
                  UserId: req.user.id,
                },
                attributes: ["UserId"],
              },
            },
          ],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/workspace/:workspace/channels",
  isLoggedIn,
  async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
            attributes: ["name"],
          },
        ],
      });
      if (!workspace) {
        await t.rollback();
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      if (workspace.Channels.find((v) => v.name === req.body.name)) {
        await t.rollback();
        return res.status(404).send("이미 존재하는 채널 이름입니다.");
      }
      const channel = await Channel.create(
        {
          name: req.body.name,
          WorkspaceId: workspace.id,
        },
        {
          transaction: t,
        }
      );
      await channel.addMembers(req.user.id, { transaction: t });
      await t.commit();
      return res.json(channel);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
);

router.get(
  "/workspace/:workspace/channel/:channel",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      return res.json(channel);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspace/:workspace/channel/:channel/chats",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      return res.json(
        await channel.getChats({
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "email"],
            },
            {
              model: Channel,
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: parseInt(req.query.perPage, 10),
          offset: req.query.perPage * (req.query.page - 1),
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/workspace/:workspace/channel/:channel/chat",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      const chat = await ChannelChat.create({
        UserId: req.user.id,
        ChannelId: channel.id,
        content: req.body.content,
      });
      const chatWithUser = await ChannelChat.findOne({
        where: { id: chat.id },
        include: [
          {
            model: User,
          },
          {
            model: Channel,
          },
        ],
      });
      const io = req.app.get("io");
      io.of(`/ws-${workspace.url}`)
        .to(`/ws-${workspace.url}-${channel.id}`)
        .emit("message", chatWithUser);
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspace/:workspace/dm/:id/chats",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      return res.json(
        await workspace.getDMs({
          where: {
            [Op.or]: [
              {
                SenderId: req.user.id,
                ReceiverId: req.params.id,
              },
              {
                SenderId: req.params.id,
                ReceiverId: req.user.id,
              },
            ],
          },
          include: [
            {
              model: User,
              as: "Sender",
              attributes: ["nickname", "id", "email"],
            },
            {
              model: User,
              as: "Receiver",
              attributes: ["nickname", "id", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: parseInt(req.query.perPage, 10),
          offset: req.query.perPage * (req.query.page - 1),
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
router.post(
  "/workspace/:workspace/dm/:id/chat",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const SenderId = req.user.id;
      const ReceiverId = req.params.id;
      const dm = await DM.create({
        SenderId,
        ReceiverId,
        WorkspaceId: workspace.id,
        content: req.body.content,
      });
      const dmWithSender = await DM.findOne({
        where: { id: dm.id },
        include: [
          {
            model: User,
            as: "Sender",
          },
        ],
      });
      const io = req.app.get("io");
      const onlineMap = req.app.get("onlineMap");
      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${workspace.url}`],
        Number(ReceiverId)
      );
      io.of(`/ws-${workspace.url}`)
        .to(receiverSocketId)
        .emit("dm", dmWithSender);
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspace/:workspace/members",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      return res.json(
        await workspace.getMembers({
          attributes: ["id", "nickname", "email"],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/workspace/:workspace/member",
  isLoggedIn,
  async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
            where: {
              name: "일반",
            },
          },
        ],
      });
      if (!workspace) {
        await t.rollback();
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        await t.rollback();
        return res.status(404).send("존재하지 않는 사용자입니다.");
      }
      await workspace.addMembers(user, { transaction: t });
      await workspace.Channels[0].addMembers(user, { transaction: t });
      await t.commit();
      return res.send("ok");
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
);

router.delete(
  "/workspace/:workspace/member/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      await workspace.removeMembers({
        where: { id: req.params.id },
      });
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspace/:workspace/channel/:channel/members",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      return res.json(
        await channel.getMembers({
          attributes: ["id", "nickname", "email"],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/workspace/:workspace/channel/:channel/member",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      const user = await User.findOne({
        where: { email: req.body.email },
        include: [
          {
            model: Workspace,
            as: "Workspaces",
            through: {
              as: "Workspaces",
              where: {
                WorkspaceId: workspace.id,
              },
            },
            required: true,
          },
        ],
      });
      if (!user) {
        return res.status(404).send("존재하지 않는 사용자입니다.");
      }
      await channel.addMembers(user);
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/workspace/:workspace/channel/:channel/member/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const workspace = await Workspace.findOne({
        where: { url: req.params.workspace },
        include: [
          {
            model: Channel,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      if (!workspace) {
        return res.status(404).send("존재하지 않는 워크스페이스입니다.");
      }
      const channel = workspace.Channels.find(
        (v) => v.name === decodeURIComponent(req.params.channel)
      );
      if (!channel) {
        return res.status(404).send("존재하지 않는 채널입니다.");
      }
      await channel.removeMembers({
        where: { id: req.params.id },
      });
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/workspace/:workspace/user/:id", async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      where: { url: req.params.workspace },
    });
    if (!workspace) {
      return res.status(404).send("존재하지 않는 워크스페이스입니다.");
    }
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: "Workspaces",
          through: {
            where: {
              WorkspaceId: workspace.id,
            },
          },
          required: true,
        },
      ],
    });
    if (!user) {
      return res.status(404).send("존재하지 않는 사용자입니다.");
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/users", (req, res, next) => {
  return res.json(req.user || false);
});

router.post("/user", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    const sleact = await Workspace.findOne({ where: { id: 1 } });
    const channel = await Channel.findOne({ where: { id: 1 } });
    await sleact.addMembers(user);
    await channel.addMembers(user);
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(
        await User.findOne({
          where: { id: user.id },
          attributes: ["id", "nickname", "email"],
        })
      );
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
