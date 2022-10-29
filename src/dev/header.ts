IMPORT("BlockEngine");
IMPORT("SoundLib");

SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "res/sounds/");
SoundManager.registerSound("teleport.ogg", "teleport.ogg");

const Cfg = {
    sameColor: __config__.getBool("sameColor"),
    precisionTarget: __config__.getBool("precisionTarget")
} as const;