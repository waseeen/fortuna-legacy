export const defaultConfig = {
  guild: '1063084122702106775',

  roles: {
    eventer: '1135925018640003143',
    embed: '1142395143304007730',
    closer: '1136654646648242288',
    iban: '1158351320470798426',
    vmute: '1142250080234115112',
    tmute: '1142250003511902369',
    ban: '1142927718774751383',
    stream_announce: '1142395279316877382',
    moderator: '1113140536598073424',
    jrAdmin: '1136998156421312683',
    admins: ['1063989094226604143', '1136370049452621945', '1142401444591439973'],
  },

  channels: {
    categories: {
      defaultEvents: '1135890377174421518',
      reports: '1160174008822669362',
    },
    text: {
      events: '1136015012310286457',
      closes: '1136015012310286457',
      reports: '1159525189277716540',
      eventRequests: '1164153140820594738',
      log: {
        join: '1144183075861975051',
        vmute: '1141808184617603212',
        tmute: '1141808184617603212',
        warns: '1141809423090733287',
        iwarns: '1158351532593520700',
        events: '1153289581286932490',
        closes: '1153289581286932490',
        bans: '1141809468603125843',
        news: '1136650870591860806',
        debug: '1143269862211338473',
        likes: '1149634274371325983',
        commands: '1154404845013454899',
        messages: '1157296971434967130',
        voice: '1157317455283245077',
        stream: '1157356889659678761',
      },
    },
    voice: {
      afk: '1135938571245727846',
    },
  },

  reactionRoles: {
    channel: '1148951865065754747',
    message: '1149062080205430794', //message to check
    logs: '1149275304024612924', //channel for logs
    roles: {
      //emoji for unicode //emoji name for server emojis
      '🎤': '1148950692803903578',
      '🔔': '1142395279316877382',
      '🎬': '1149060927707164714',
    },
  },

  colors: {
    success: 971919, //rgb(14, 212, 143)
    ban_log: 1147185, //rgb(17 129 49)
    mute_log: 1147185, //rgb(17 129 49)
    warn_log: 1147185, //rgb(17 129 49)
    twitch: 1147185, //rgb(17 129 49)
    warn: 16562432, //rgb(252, 185, 0)
    ban: 657930, //rgb(10, 10, 10)
    tmute: 971919, //rgb(14 212 143)
    vmute: 971919, //rgb(14 212 143)
  },
  private: {
    category: '1158441725380022363',
    manageChannel: '1158817185645482164',

    create: '1158441951322964028',
    message: '1159505732664819823',
  },
};
