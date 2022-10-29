var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
IMPORT("BlockEngine");
IMPORT("SoundLib");
SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "res/sounds/");
SoundManager.registerSound("teleport.ogg", "teleport.ogg");
var Cfg = {
    sameColor: __config__.getBool("sameColor"),
    precisionTarget: __config__.getBool("precisionTarget")
};
BlockRegistry.registerBlock(new /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super.call(this, "openblocks_elevator", "stone") || this;
        _this.addVariation("White Elevator", [["openblocks_elevator", 0]], true);
        _this.addVariation("Orange Elevator", [["openblocks_elevator", 1]], false);
        _this.addVariation("Magenta Elevator", [["openblocks_elevator", 2]], false);
        _this.addVariation("Light Blue Elevator", [["openblocks_elevator", 3]], false);
        _this.addVariation("Yellow Elevator", [["openblocks_elevator", 4]], false);
        _this.addVariation("Lime Elevator", [["openblocks_elevator", 5]], false);
        _this.addVariation("Pink Elevator", [["openblocks_elevator", 6]], false);
        _this.addVariation("Gray Elevator", [["openblocks_elevator", 7]], false);
        _this.addVariation("Light Gray Elevator", [["openblocks_elevator", 8]], false);
        _this.addVariation("Cyan Elevator", [["openblocks_elevator", 9]], false);
        _this.addVariation("Purple Elevator", [["openblocks_elevator", 10]], false);
        _this.addVariation("Blue Elevator", [["openblocks_elevator", 11]], false);
        _this.addVariation("Brown Elevator", [["openblocks_elevator", 12]], false);
        _this.addVariation("Green Elevator", [["openblocks_elevator", 13]], false);
        _this.addVariation("Red Elevator", [["openblocks_elevator", 14]], false);
        _this.addVariation("Black Elevator", [["openblocks_elevator", 15]], false);
        Item.addCreativeGroup("openblocks_elevator", "Elevators", [_this.id]);
        for (var i = 0; i < 16; i++) {
            Recipes.addShaped({ id: _this.id, count: 1, data: i }, ["aaa", "aba", "aaa"], ["a", VanillaBlockID.wool, i, "b", VanillaItemID.ender_pearl, -1]);
        }
        return _this;
    }
    return class_1;
}(BlockBase)));
var ElevatorHelper;
(function (ElevatorHelper) {
    ElevatorHelper.getUnderfootCoords = function (pos) { return ({ x: Math.floor(pos.x), y: Math.floor(pos.y - 2.5), z: Math.floor(pos.z) }); };
    var hasSpace = function (x, y, z) { return World.getBlockID(x, y + 1, z) === 0 && World.getBlockID(x, y + 2, z) === 0; };
    ElevatorHelper.getUpstairs = function (coords, id, data) {
        var block;
        for (var y = Math.max(coords.y + 1, 0); y <= 255; y++) {
            block = World.getBlock(coords.x, y, coords.z);
            if (block.id === id && (!Cfg.sameColor || block.data === data) && hasSpace(coords.x, y, coords.z)) {
                return { x: coords.x, y: y, z: coords.z };
            }
        }
        return null;
    };
    ElevatorHelper.getDownstairs = function (coords, id, data) {
        var block;
        for (var y = Math.min(coords.y - 1, 255); y >= 0; y--) {
            block = World.getBlock(coords.x, y, coords.z);
            if (block.id === id && (!Cfg.sameColor || block.data === data) && hasSpace(coords.x, y, coords.z)) {
                return { x: coords.x, y: y, z: coords.z };
            }
        }
        return null;
    };
    ElevatorHelper.teleport = function (entity, coords, currentPos) {
        Cfg.precisionTarget ?
            Entity.setPosition(entity, coords.x + 0.5, coords.y + 2.5, coords.z + 0.5) :
            Entity.setPosition(entity, currentPos.x, coords.y + 2.5, currentPos.z);
        SoundManager.startPlaySound(SourceType.ENTITY, entity, "teleport.ogg", 0.5);
    };
    var lastTime = {};
    ElevatorHelper.causeSneakHook = function (entity) {
        var now = World.getThreadTime();
        var last = lastTime[entity] || 0;
        lastTime[entity] = now;
        return now - last > 3;
    };
})(ElevatorHelper || (ElevatorHelper = {}));
Callback.addCallback("PlayerJump", function (entity) {
    var position = Entity.getPosition(entity);
    var underfoot = ElevatorHelper.getUnderfootCoords(position);
    var underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);
    if (underblock.id === BlockID.openblocks_elevator) {
        var coords = ElevatorHelper.getUpstairs(underfoot, underblock.id, underblock.data);
        if (coords) {
            ElevatorHelper.teleport(entity, coords, position);
        }
    }
});
Callback.addCallback("EntitySneakChanged", function (entity, sneaking) {
    if (sneaking && Entity.getType(entity) === EEntityType.PLAYER && ElevatorHelper.causeSneakHook(entity)) {
        var position = Entity.getPosition(entity);
        var underfoot = ElevatorHelper.getUnderfootCoords(position);
        var underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);
        if (underblock.id === BlockID.openblocks_elevator) {
            var coords = ElevatorHelper.getDownstairs(underfoot, underblock.id, underblock.data);
            if (coords) {
                ElevatorHelper.teleport(entity, coords, position);
                Entity.setSneaking(entity, false); //not work
                //const player = new KEX.Player(entity);
                //player.setSneaking(false);
            }
        }
    }
});
Callback.addCallback("ItemUse", function (coords, item, block, isExternal, entity) {
    if (block.id === BlockID.openblocks_elevator) {
        var position = Entity.getPosition(entity);
        var underfoot = ElevatorHelper.getUnderfootCoords(position);
        var underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);
        if (underblock.id === BlockID.openblocks_elevator && coords.x === underfoot.x && coords.y === underfoot.y && coords.z === underfoot.z) {
            var coords_1 = ElevatorHelper.getDownstairs(underfoot, underblock.id, underblock.data);
            if (coords_1) {
                ElevatorHelper.teleport(entity, coords_1, position);
            }
        }
    }
});
