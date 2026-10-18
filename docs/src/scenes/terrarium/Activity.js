// A place in the tank where the hamster goes to do something: the wheel, the bath, the house.
//
// TerrariumScene drives every activity the same way (scene.phase in brackets):
//   tap on the place, or a random choice while wandering (scene.startActivity)
//   -> walk to approachX()                           ['walking']
//   -> enter(done)                                   ['entering']
//   -> start()                                       ['inside']
//   -> its own timer, a tap or a landed seed calls scene.leaveActivity()
//   -> stop(), then leave(done)                      ['leaving']
//   -> idle again, and the hamster looks for seeds   ['idle']
//
// To add an activity: subclass Activity in its own file in this folder, then create it in
// TerrariumScene.createActivities().
export class Activity {
    constructor(scene) {
        this.scene = scene;
        // Walking speed to the place in ms per pixel (lower is faster).
        this.walkSpeed = 12;
        // A sick hamster sneezes instead of doing this.
        this.okWhenSick = false;
    }

    // Draws the place and adds its tap zone; called once while the scene is built.
    create() {}

    // Where the hamster walks to before entering.
    approachX() {
        return this.scene.hamster.x;
    }

    // Moves the hamster in, then calls done().
    enter(done) {
        done();
    }

    // The hamster is in: start animations and a timer that calls scene.leaveActivity().
    start() {}

    // Stops everything start() began. May be called right after enter(), before start().
    stop() {}

    // Moves the hamster back to the ground, then calls done().
    leave(done) {
        done();
    }

    // The hamster was tapped while entering, inside or leaving.
    poke() {
        this.scene.showHeart();
    }
}
