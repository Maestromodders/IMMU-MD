const { DATABASE } = require("./database");
const { DataTypes } = require("sequelize");
const path = require("path");
const config = require("../../config");

const packageJson = require("../../package.json");

const SettingsDB = DATABASE.define(
    "BotSettings",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "bot_settings",
        timestamps: true,
    },
);

const DEFAULT_SETTINGS = {
    PREFIX: ".",
   SESSION_ID: " IMMU-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRU9PUHJLMGFCNjYzUWViRVcvNG4rejlwbHFOU09NTGcveGZFd1NVRi9VVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRWVyaTBTb29oYXhtYTBxQzJKVFBPTGEyb0pvcWxRTlRYQzJmdk96alBrUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTSHhLT3VRblNpL2VtVXRtV1hkTk1PamorT25MY0lUVWRQdkx6STByRVZJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZT29LVTNBZUg2SHRkY0FlUHd6Z3BCY3RSVjZncWhld1JOU1RkU2lyRWtNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFEczVQRFRVaGFJWmJlT09qbFRvOWt4U0F2RlBCd0k4N1dNUjVHcTVKMmc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlpHbTZDbEZGeW5YOStZMFo3MG1tSjlXMFlUQ21jdVo1VllxMlhqNVZyQzg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkZPYlJLakRaYkh0Vmp5eHZjazAwMnNSOFphTCttMWNtc3V6YmVzMi9udz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidFdzdXFxd2ZxdGc0eXpVNWFrT1E4THlSblRaVWtBZW1pdVNxTU9NQWdTOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImJmOEZ3LzNhY1R4SlJxSjlhSDZOM3BibzQvMWhscTROLzREZ01rcVg1dGo2TXpiV2RTcFk5RmczNDQyUCs1dG54YnpaRzRwVTJaQmlDREVnOWdZT0RnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjYsImFkdlNlY3JldEtleSI6IlJ2Z0lnMXU5dGRzVDRhTTR0WFUwVU5FVm1Obkw3ZloxZ1ZmQUw5Q3BGWVU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiMlBCWk5TUDgiLCJtZSI6eyJpZCI6IjI1NDc4ODQwOTEwNTo2QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMTk4NjE3MDIxMzA1MDA5OjZAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLV1Z4OWNCRUszTnR0QUdHQVVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiI0alExZEkydE1FcFFzZ1VHaXo3bkhLdlBTZlRiMXFGYWswVjFWdGtJVzBZPSIsImFjY291bnRTaWduYXR1cmUiOiI3dkxMRnJ5aExvTVcza2xxM1VOSytRR1k0RFRVUXNxU0JkZGd1OHBsV3Q0UDc0NDlSVjM4cUJDNU1hcENOV2FSMzJRbmIyam9TQlVWTUt1Rmt5eTRBZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiMTREeDlrMHFCaTlvSU8yN1JOc3cwOXJ2RlAvYjZleWJDY1FONTlYejFFT0tJRjVRSHRMdUNWRGZHOStTMWVCZkptUkQ1OVZLNnhkQU1Sc3ZxU2JtQWc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIxOTg2MTcwMjEzMDUwMDk6NkBsaWQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZUkwTlhTTnJUQktVTElGQm9zKzV4eXJ6MG4wMjlhaFdwTkZkVmJaQ0Z0RyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FJSURRZ1MifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzc5Mjc5NTQxLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUdITiJ9", 
    OWNER_NAME: "𝐌ᴀғɪᴀ 𝐈ᴍᴀᴅ",
    OWNER_NUMBER: "923493114170",
    BOT_NAME: "𝐈ᴍᴍυ Mᴅ",
    FOOTER: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪᴍᴍᴜ ᴍᴅ ★",
    CAPTION: "©𝟐𝟎𝟐𝟔 𝐈𝐌𝐌𝐔-𝐌𝐃 𝐕𝟐",
    BOT_PIC: "https://i.ibb.co/23qtbQ2q/IMG-20260408-WA0004.png",
    VERSION: packageJson.version || "5.0.0",
    MODE: config.MODE || "public",
    WARN_COUNT: "3",
    TIME_ZONE: config.TIME_ZONE || "Asia/Karachi",
    DM_PRESENCE: "online",
    GC_PRESENCE: "online",
    CHATBOT: "false",
    CHATBOT_MODE: "inbox",
    STARTING_MESSAGE: "true",
    ANTIDELETE: "indm",
    ANTI_EDIT: "indm",
    ANTICALL: "false",
    ANTICALL_MSG: "*_📞 Auto Call Reject Mode Active. 📵 No Calls Allowed!_*",
    AUTO_LIKE_STATUS: config.AUTO_LIKE_STATUS || "true",
    AUTO_READ_STATUS: config.AUTO_READ_STATUS || "true",
    STATUS_LIKE_EMOJIS: "💛,❤️,💜,🤍,🚩,🟢,💙",
    AUTO_REPLY_STATUS: "false",
    STATUS_REPLY_TEXT: "*ʏᴏᴜʀ sᴛᴀᴛᴜs ᴠɪᴇᴡᴇᴅ ʙʏ 𝐌ᴀғɪᴀ 𝐈ᴍᴀᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ✅*",
    AUTO_REACT: "off",
    AUTO_REPLY: "false",
    AUTO_READ_MESSAGES: "off",
    AUTO_BIO: "false",
    AUTO_BLOCK: "",
    YT: "https://youtube.com/@immumdbot",
    NEWSLETTER_JID: "120363341506278064@newsletter",
    GC_JID: "JQTH0GwURpjIJEzhpcFosO",
    NEWSLETTER_URL: "https://whatsapp.com/channel/0029Vaq4PRsD38CJKXzwmb42",
    BOT_REPO: "CYBER-IMMU/WA-BAN",
    PACK_NAME: "𝐈ᴍᴍυ-Mᴅ",
    PACK_AUTHOR: "𝐌ᴀғɪᴀ 𝐈ᴍᴀᴅ",
    SUDO_NUMBERS: "",
    PM_PERMIT: "false",
    ANTIVIEWONCE: "indm",
};

let initialized = false;

const GROUP_ONLY_SETTINGS = [
    "WELCOME_MESSAGE",
    "GOODBYE_MESSAGE",
    "GROUP_EVENTS",
    "ANTILINK",
];

async function initializeSettings() {
    if (initialized) return;

    await SettingsDB.sync();

    await SettingsDB.destroy({
        where: { key: GROUP_ONLY_SETTINGS },
    });

    for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
        await SettingsDB.findOrCreate({
            where: { key },
            defaults: { key, value: defaultValue },
        });
    }

    initialized = true;
    console.log("✅ Bot Settings Initialized");
}

async function getSetting(key) {
    if (!initialized) await initializeSettings();

    const record = await SettingsDB.findOne({ where: { key } });
    if (record) {
        return record.value;
    }

    return DEFAULT_SETTINGS[key] || null;
}

async function setSetting(key, value) {
    if (!initialized) await initializeSettings();

    const [record, created] = await SettingsDB.findOrCreate({
        where: { key },
        defaults: { key, value },
    });

    if (!created) {
        record.value = value;
        await record.save();
    }

    return true;
}

async function getAllSettings() {
    if (!initialized) await initializeSettings();

    const records = await SettingsDB.findAll();
    const settings = {};
    for (const record of records) {
        settings[record.key] = record.value;
    }
    return settings;
}

async function resetSetting(key) {
    if (!initialized) await initializeSettings();

    const defaultValue = DEFAULT_SETTINGS[key];
    if (defaultValue !== undefined) {
        await setSetting(key, defaultValue);
        return defaultValue;
    }
    return null;
}

async function resetAllSettings() {
    if (!initialized) await initializeSettings();

    for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
        await setSetting(key, defaultValue);
    }
    return true;
}

module.exports = {
    SettingsDB,
    DEFAULT_SETTINGS,
    initializeSettings,
    getSetting,
    setSetting,
    getAllSettings,
    resetSetting,
    resetAllSettings,
};
