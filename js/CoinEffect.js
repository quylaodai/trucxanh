var victoryPopup = new PIXI.Container();

(function (window) {
    /**
     *  Basic example setup
     *  @class ParticleExample
     *  @constructor
     *  @param {String[]} imagePaths The local path to the image source
     *  @param {Object} config The emitter configuration
     *  @param {null|"path"|"anim"} [type=null] Particle type to create.
     *  @param {boolean} [useParticleContainer=false] If a ParticleContainer should be used instead of a Container.
     *  @param {boolean} [stepColors=false] If the color settings should be manually stepped.
     */
    var ParticleExample = function (imagePaths, config, type, useParticleContainer, stepColors) {

        var emitter = null;

        // Calculate the current time
        var elapsed = Date.now();

        var updateId;

        // Update function every frame
        var update = function () {
            // Update the next frame
            updateId = requestAnimationFrame(update);
            var now = Date.now();
            if (emitter)
                emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };

        // Preload the particle images and create PIXI textures from it
        var urls, makeTextures = false;
        if (imagePaths.spritesheet)
            urls = [imagePaths.spritesheet];
        else if (imagePaths.textures)
            urls = imagePaths.textures.slice();
        else {
            urls = imagePaths.slice();
            makeTextures = true;
        }

        var loader = PIXI.loader;
        for (var i = 0; i < urls.length; ++i)
            loader.add("img" + i, urls[i]);

        loader.load(function () {

            //collect the textures, now that they are all loaded
            var art;
            if (makeTextures) {
                art = [];
                for (var i = 0; i < imagePaths.length; ++i)
                    art.push(PIXI.Texture.fromImage(imagePaths[i]));
            }
            else
                art = imagePaths.art;

            var emitterContainer;
            if (useParticleContainer) {
                emitterContainer = new PIXI.ParticleContainer();
                emitterContainer.setProperties({
                    scale: true,
                    position: true,
                    rotation: true,
                    uvs: true,
                    alpha: true
                });
            }
            else
                emitterContainer = new PIXI.Container();
            victoryPopup.addChild(emitterContainer);
            window.emitter = emitter = new PIXI.particles.Emitter(
                emitterContainer,
                art,
                config
            );
            if (stepColors)
                emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(config.color.list, stepColors);
            if (type == "path")
                emitter.particleConstructor = PIXI.particles.PathParticle;
            else if (type == "anim")
                emitter.particleConstructor = PIXI.particles.AnimatedParticle;

            emitter.updateOwnerPos(0, 0);


            // function coinEffect(e) {
            //     if (!emitter) return;
            //     emitter.emit = true;
            //     emitter.resetPositionTracking();
            //     //emitter.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
            //     emitter.updateOwnerPos(Math.random() * 800, Math.random() * 600)
            // }

            // Start the update
            update();

            //for testing and debugging
            /*window.destroyEmitter = function () {
                emitter.destroy();
                emitter = null;
                window.destroyEmitter = null;
                //cancelAnimationFrame(updateId);

            };*/

        });
    };

    // Assign to global space
    window.ParticleExample = ParticleExample;

}(window));


///
//===============================
// See js/ParticleExample.js for actual setup
// var texturesUrls = [];
// for (i = 0; i < 27; i++) {
//     let url = "required/assets/basics/coin/CoinEffect" + i + ".png";
//     texturesUrls.push(url);
// }
// var     imagePaths = {
//     spritesheet: false,
//     textures:
// };

new ParticleExample(
    // imagePaths
    {
        spritesheet: "required/assets/basics/gold_anim.json",
        art: [
            {
                framerate: 0,
                loop: true,
                textures: [
                    "gold_1.png",
                    "gold_2.png",
                    "gold_3.png",
                    "gold_4.png",
                    "gold_5.png",
                    "gold_6.png"
                ]
            },
            {
                framerate: 0,
                loop: true,
                textures: [
                    "gold_6.png",
                    "gold_5.png",
                    "gold_4.png",
                    "gold_3.png",
                    "gold_2.png",
                    "gold_1.png"
                ]
            }
        ]
    },


    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        "alpha": {
            "start": 1,
            "end": 1
        },
        "scale": {
            "start": 0.01,
            "end": 0.3,
            "minimumScaleMultiplier": 1.06
        },
        "color": {
            "start": "#f7fbfc",
            "end": "#f7f6ed"
        },
        "speed": {
            "start": 100,
            "end": 1000,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 50,
            "y": 50
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 0,
            "max": 360
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 2,
            "max": 6
        },
        "lifetime": {
            "min": 0.31,
            "max": 1.06
        },
        "blendMode": "normal",
        "frequency": 0.002,
        "emitterLifetime": -1,
        "maxParticles": 100,
        "pos": {
            "x": -1,
            "y": 0
        },
        "addAtBack": true,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": 0,
            "w": 800,
            "h": 600
        }
    },
    //tell the particle example to use AnimatedParticle
    "anim"
);


