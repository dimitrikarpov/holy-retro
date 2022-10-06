import {
  defaultKeybinds,
  extraConfig,
  nulKeys,
  stringifySettings,
} from './defaultConfig'

import { copyBundle } from './copyBundle'

class RetroarchService {
  static prepareModule() {
    const Module = {
      canvas: document.getElementById('canvas'),
      noInitialRun: true,
      arguments: ['/rom.bin', '--verbose'],
      onRuntimeInitialized: () => {
        copyBundle()
      },
      print: function (text) {
        console.log('stdout: ' + text)
      },
      printErr: function (text) {
        console.log('stderr: ' + text)
      },
      preRun: [],
      postRun: [],
    }

    window.Module = Module
  }

  static async loadCore(url) {
    return new Promise((resolve, reject) => {
      if (Boolean(document.querySelector(`[src="${url}"`))) return

      try {
        const script = document.createElement('script')
        script.type = 'application/javascript'
        script.src = url
        script.addEventListener('load', resolve)
        script.addEventListener('error', reject)

        document.body.appendChild(script)
      } catch (error) {
        reject(error)
      }
    })
  }

  static run(rom) {
    //copy rom
    window.FS.writeFile('/rom.bin', rom)

    // copy config
    window.FS.createPath('/', 'home/web_user/retroarch/userdata', true, true)
    window.FS.writeFile(
      '/home/web_user/retroarch/userdata/retroarch.cfg',
      stringifySettings({ ...defaultKeybinds, ...extraConfig, ...nulKeys })
    )

    // run the module
    window.Module.callMain(window.Module.arguments)
  }

  static pause() {
    window.Module.pauseMainLoop()
  }
}

export { RetroarchService }

/*
    static:
    - prepareBundle
    - run
    - loadCore
    - copyBundle

    dynamic:
    - pause
    - unpause
    // - save state
    - load state
    - fullscreen
    - hide|show retroarch
    - update config


*/
