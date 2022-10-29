namespace ElevatorHelper {

    export const getUnderfootCoords = (pos: Vector): Vector => ({x: Math.floor(pos.x), y: Math.floor(pos.y - 2.5), z: Math.floor(pos.z)});

    const hasSpace = (x: number, y: number, z: number): boolean => World.getBlockID(x, y + 1, z) === 0 && World.getBlockID(x, y + 2, z) === 0;

    export const getUpstairs = (coords: Vector, id: number, data: number): Nullable<Vector> => {
        let block: Tile;
        for(let y = Math.max(coords.y + 1, 0); y <= 255; y++){
            block = World.getBlock(coords.x, y, coords.z);
            if(block.id === id && (!Cfg.sameColor || block.data === data) && hasSpace(coords.x, y, coords.z)){
                return {x: coords.x, y: y, z: coords.z};
            }
        }
        return null;
    }

    export const getDownstairs = (coords: Vector, id: number, data: number): Nullable<Vector> => {
        let block: Tile;
        for(let y = Math.min(coords.y - 1, 255); y >= 0; y--){
            block = World.getBlock(coords.x, y, coords.z);
            if(block.id === id && (!Cfg.sameColor || block.data === data) && hasSpace(coords.x, y, coords.z)){
                return {x: coords.x, y: y, z: coords.z};
            }
        }
        return null;
    }

    export const teleport = (entity: number, coords: Vector, currentPos: Vector): void => {
        Cfg.precisionTarget ?
            Entity.setPosition(entity, coords.x + 0.5, coords.y + 2.5, coords.z + 0.5):
            Entity.setPosition(entity, currentPos.x, coords.y + 2.5, currentPos.z);
        SoundManager.startPlaySound(SourceType.ENTITY, entity, "teleport.ogg", 0.5);
    }

    const lastTime: {[entiry: number]: number} = {};

    export const causeSneakHook = (entity: number): boolean => {
        const now = World.getThreadTime();
        const last = lastTime[entity] || 0;
        lastTime[entity] = now;
        return now - last > 3;
    }

}


Callback.addCallback("PlayerJump", (entity: number) => {

    const position = Entity.getPosition(entity);
    const underfoot = ElevatorHelper.getUnderfootCoords(position);
    const underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);

    if(underblock.id === BlockID.openblocks_elevator){
        const coords = ElevatorHelper.getUpstairs(underfoot, underblock.id, underblock.data);
        if(coords){
            ElevatorHelper.teleport(entity, coords, position);
        }
    }

});


Callback.addCallback("EntitySneakChanged", (entity: number, sneaking: boolean) => {
    if(sneaking && Entity.getType(entity) === EEntityType.PLAYER && ElevatorHelper.causeSneakHook(entity)){

        const position = Entity.getPosition(entity);
        const underfoot = ElevatorHelper.getUnderfootCoords(position);
        const underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);

        if(underblock.id === BlockID.openblocks_elevator){
            const coords = ElevatorHelper.getDownstairs(underfoot, underblock.id, underblock.data);
            if(coords){
                ElevatorHelper.teleport(entity, coords, position);
                Entity.setSneaking(entity, false); //not work
                //const player = new KEX.Player(entity);
                //player.setSneaking(false);
            }
        }

    }
});


Callback.addCallback("ItemUse", (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, isExternal: boolean, entity: number) => {
    if(block.id === BlockID.openblocks_elevator){

        const position = Entity.getPosition(entity);
        const underfoot = ElevatorHelper.getUnderfootCoords(position);
        const underblock = World.getBlock(underfoot.x, underfoot.y, underfoot.z);

        if(underblock.id === BlockID.openblocks_elevator && coords.x === underfoot.x && coords.y === underfoot.y && coords.z === underfoot.z){
            const coords = ElevatorHelper.getDownstairs(underfoot, underblock.id, underblock.data);
            if(coords){
                ElevatorHelper.teleport(entity, coords, position);
            }
        }

    }
});