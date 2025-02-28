export class SceneManager {
    static add(object) {
        this.addQueue.push(object);
    }
    static remove(object) {
        this.removeQueue.push(object);
    }
    static addAnimated(object, cb) {
        let posYOriginal = object.position.y;
        let tenPercent = Math.abs(posYOriginal == 0 ? 0.5 : posYOriginal * 0.5);
        SceneManager.scene.scene.add(object);
        let frames = 0;
        object.position.y = posYOriginal - tenPercent;
        const oneFrame = () => {
            if (object.position.y === posYOriginal || frames == 60)
                return cb?.();
            setTimeout(() => {
                object.position.y += tenPercent * 0.5;
                oneFrame();
                frames++;
            }, 1);
        };
        oneFrame();
    }
}
SceneManager.addQueue = [];
SceneManager.removeQueue = [];
