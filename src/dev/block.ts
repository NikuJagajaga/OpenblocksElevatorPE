BlockRegistry.registerBlock(new class extends BlockBase {

    constructor(){

        super("openblocks_elevator", "stone");

        this.addVariation("White Elevator", [["openblocks_elevator", 0]], true);
        this.addVariation("Orange Elevator", [["openblocks_elevator", 1]], false);
        this.addVariation("Magenta Elevator", [["openblocks_elevator", 2]], false);
        this.addVariation("Light Blue Elevator", [["openblocks_elevator", 3]], false);
        this.addVariation("Yellow Elevator", [["openblocks_elevator", 4]], false);
        this.addVariation("Lime Elevator", [["openblocks_elevator", 5]], false);
        this.addVariation("Pink Elevator", [["openblocks_elevator", 6]], false);
        this.addVariation("Gray Elevator", [["openblocks_elevator", 7]], false);
        this.addVariation("Light Gray Elevator", [["openblocks_elevator", 8]], false);
        this.addVariation("Cyan Elevator", [["openblocks_elevator", 9]], false);
        this.addVariation("Purple Elevator", [["openblocks_elevator", 10]], false);
        this.addVariation("Blue Elevator", [["openblocks_elevator", 11]], false);
        this.addVariation("Brown Elevator", [["openblocks_elevator", 12]], false);
        this.addVariation("Green Elevator", [["openblocks_elevator", 13]], false);
        this.addVariation("Red Elevator", [["openblocks_elevator", 14]], false);
        this.addVariation("Black Elevator", [["openblocks_elevator", 15]], false);

        Item.addCreativeGroup("openblocks_elevator", "Elevators", [this.id]);

        for(let i = 0; i < 16; i++){
            Recipes.addShaped({id: this.id, count: 1, data: i}, ["aaa", "aba", "aaa"], ["a", VanillaBlockID.wool, i, "b", VanillaItemID.ender_pearl, -1]);
        }

    }

});
