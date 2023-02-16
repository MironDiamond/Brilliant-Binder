function Play(value) {
  eel.Play(value);
}

function getFormData(event) {
  let form_event = new FormData(event.target);

  let result = {};

  for (let [name, value] of form_event.entries()) {
    result[name] = value;
  }

  return result;
}

function getKeyName(keyCode) {
  var keyCodes = {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Ctrl",
    18: "Alt",
    20: "Caps Lock",
    27: "Esc",
    32: "Space",
    33: "Page Up",
    34: "Page Down",
    35: "End",
    36: "Home",
    37: "Arrow Left",
    38: "Arrow Up",
    39: "Arrow Right",
    40: "Arrow Down",
    45: "Insert",
    46: "Delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    91: "Windows",
    92: "Windows",
    96: "Numpad 0",
    97: "Numpad 1",
    98: "Numpad 2",
    99: "Numpad 3",
    100: "Numpad 4",
    101: "Numpad 5",
    102: "Numpad 6",
    103: "Numpad 7",
    104: "Numpad 8",
    105: "Numpad 9",
    106: "Numpad *",
    107: "Numpad +",
    109: "Numpad -",
    110: "Numpad .",
    111: "Numpad /",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "Num Lock",
    145: "Scroll Lock",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
  };

  return keyCodes[keyCode] || "Unknown";
}

const vue_app = Vue.createApp({
  delimiters: ["{[", "]}"],

  data() {
    return {
      window: 'main',
      popup: '',
      popup_data: {},
      loading: 2,
      search: '',
      edit_hotkey: false,
      edit: -1,
      edit_messages: [],
      profile: 0,
      profiles: [{name: "Основной", binds: []}],

      settings: {
        version: "1.0",

        binds: {
          "open_chat": [84],
        },

        blackout: 4,
        
        image: 0,

        images: [
          "Diamond Casino",
          "Ограбление",
          "GTA5",
          "Закат",
          "Тян (Неон)",
          "Тян (Аниме)",
          "ソフィア",
          "Анонимус",
          "Неоновый луч",
          "Без фона",
        ],

        input_mode: 4,

        input_mods: [
          "Медленно",
          "Нормально",
          "Быстро",
          "Моментально",
          "CTRL + V",
        ],

        wait: {
          after_hotkey: 100,
          after_open_chat: 200,
          create_bind_message: 1000,
        },

        toggle: {
          "start_hide": false,
          "update": true,
          "delete_profile": true,
          "delete_bind": false,
          "delete_message": false,
          "arizona_delete_tag": false,
          "windows_notf": true,
        }
      }
    }
  },

  methods: {
    checkUpdate(version) {
      if (version != this.settings.version) {
        this.openPopup("update");
      }
    },

    loadConfig(config) {
      let vue = this;

      if (config !== null) {
        this.profile = config.profile;
        this.profiles = config.profiles;
        this.settings = config.settings;
      }

      setTimeout(function() {
        vue.loading = 1;

        setTimeout(function() {
          vue.loading = 0;
          
          if (vue.settings.toggle['start_hide']) {
            vue.hideWindow();
          }
        }, 2000)
      }, 200)
    },

    saveConfig() {
      this.$nextTick(function() {
        let config = {
          profile: this.profile,
          settings: this.settings,
          profiles: this.profiles,
        }
    
        eel.updateConfig(JSON.stringify(config));
      });
    },

    exportProfile() {
      this.openPopup('export_finish');
      eel.exportProfile();
    },

    importProfile(event) {
      let file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = () => {
        let content = reader.result;
        let array = JSON.parse(content);

        if (array['binder'] == "Brilliant Binder") {
          delete array['binder'];
          this.profiles.push(array);
          this.profile = this.profiles.length - 1;
          this.saveConfig();
        }
      };

      reader.readAsText(file);
    },

    closeWindow() {
      window.close();
    },

    openPopup(name, data={}) {
      this.popup = name;
      this.popup_data = data;
    },

    closePopup(name) {
      this.popup = "";
      this.popup_data = {};
    },

    minimizeWindow() {
      window.electronAPI.Minimize();
    },

    hideWindow() {
      window.electronAPI.Hide();
    },
    
    Dialog(event, name) {
      let form_data = getFormData(event);

      if (name == 'create_profile') {
        if (form_data['name'].length > 0) {
          this.profiles.push({name: form_data['name'], binds: []});
          this.profile = this.profiles.length - 1;
          this.closePopup();
          this.saveConfig();
        }
      } else if (name == 'create_bind') {
        if (form_data['name'].length > 0) {
          this.profiles[this.profile].binds.push({name: form_data['name'], messages: [], status: true, hotkey: []});
          this.closePopup();
          this.edit = this.profiles[this.profile].binds.length - 1;
          this.edit_messages = [];
          this.saveConfig();
        }
      } else if (name == 'delete_profile') {
        this.deleteProfile(this.popup_data['id']);
        this.closePopup();
      } else if (name == 'delete_bind') {
        this.bindDelete(this.popup_data['id']);
        this.closePopup();
      } else if (name == 'delete_message') {
        this.bindDeleteMessage(this.popup_data['id']);
        this.closePopup();
      } else if (name == 'update') {
        window.location.href = "https://t.me/brilliant_binder"
        this.closePopup();
      }
    },

    setProfile(id) {
      this.profile = id;
      this.saveConfig();
      this.closePopup();
    },

    deleteProfile(id) {
      this.profiles.splice(id, 1);
      
      if (this.profile == id || this.profile > this.profiles.length - 1) {
        this.profile = 0;
      }

      this.saveConfig();
    },

    getHotkeyName(array) {
      let result = [];

      if (array.length == 0) {
        return "Нет";
      }

      array.forEach(element => {
        result.push(getKeyName(element))
      });

      return result.join(" + ");
    },

    bindDelete(id) {
      this.profiles[this.profile].binds.splice(id, 1);
      this.saveConfig();
    },

    bindDeleteMessage(id) {
      this.edit_messages.splice(id, 1);
    },

    bindEdit(id) {
      this.edit = id;
      this.edit_messages = JSON.parse(JSON.stringify(this.profiles[this.profile].binds[id].messages));
    },

    bindToggleStatus(id) {
      this.profiles[this.profile].binds[id].status = ! this.profiles[this.profile].binds[id].status
      this.saveConfig();
    },

    bindSave(event) {
      let form_data = getFormData(event);

      this.profiles[this.profile].binds[this.edit].name = form_data['name'];
      this.profiles[this.profile].binds[this.edit].hotkey = JSON.parse(form_data['hotkey']);
      this.profiles[this.profile].binds[this.edit].messages = this.edit_messages;

      let i = 0;
      let vue = this;

      this.profiles[this.profile].binds.forEach(function(item) {
        if (i != vue.edit && JSON.stringify(item.hotkey) == JSON.stringify(vue.profiles[vue.profile].binds[vue.edit].hotkey)) {
          item.hotkey = [];
        }

        i += 1;
      });


      this.edit = -1;
      this.saveConfig();
    },

    bindArrow(id, type) {
      if (type == 'up') {
        if (id != 0) {
          let bind_1 = this.profiles[this.profile].binds[id]
          let bind_2 = this.profiles[this.profile].binds[id - 1]

          this.profiles[this.profile].binds[id] = bind_2;
          this.profiles[this.profile].binds[id - 1] = bind_1;
        }
      } else if (type == 'down') {
        if (id != this.profiles[this.profile].binds.length - 1) {
          let bind_1 = this.profiles[this.profile].binds[id]
          let bind_2 = this.profiles[this.profile].binds[id + 1]

          this.profiles[this.profile].binds[id] = bind_2;
          this.profiles[this.profile].binds[id + 1] = bind_1;
        }
      }

      this.saveConfig();
    },

    bindChangeHotkey(bind, value) {
      this.profiles[this.profile].binds[bind].hotkey = value;

      let i = 0;
      let vue = this;

      this.profiles[this.profile].binds.forEach(function(item) {
        if (i != bind && JSON.stringify(item.hotkey) == JSON.stringify(vue.profiles[vue.profile].binds[bind].hotkey)) {
          item.hotkey = [];
        }

        vue.$refs.binds_bind_hotkey[i].value = item.hotkey;

        i += 1;
      });

      this.saveConfig();
    },

    bindAddMessage() {
      let wait = this.settings.wait.create_bind_message;
      this.edit_messages.push({text: '', wait: wait});
    },

    settingsToggle(param, value) {
      this.settings.toggle[param] = value;
    },

    settingsHotkey(param, value) {
      this.settings.binds[param] = value;
    }
  },

  components: {
    "c-toggle": {
      props: ["active", "name"],

      data() {
        return {
          value: false,
        }
      },

      'template': `
        <div class="toggle" :class="{'active': value}" @click="Toggle">
          <span></span>
          <input v-model="value" type="text" hidden :name="name">
        </div>
      `,

      methods: {
        Toggle() {
          this.value = ! this.value;

          this.$emit("change-value", this.name, this.value);
        }
      },

      created() {
        if (this.active !== undefined) {
          this.value = this.active;
        }
      }
    },

    "c-window": {
      props: ['title', 'inputs', 'text', 'buttons', 'name', 'profile_list'],

      template: `
        <form class="window" @submit.prevent="$root.Dialog($event, name)" v-if="$root.popup == name">
          <div class="title">
            {{ title }}

            <button @click.prevent="Close" class="delete">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.707,8.707,13.414,12l3.293,3.293a1,1,0,1,1-1.414,1.414L12,13.414,8.707,16.707a1,1,0,1,1-1.414-1.414L10.586,12,7.293,8.707A1,1,0,1,1,8.707,7.293L12,10.586l3.293-3.293a1,1,0,1,1,1.414,1.414Z"/></svg>
            </button>
          </div>

          <div class="text" v-if="text">
            {{ text }}
          </div>

          <div class="inputs" v-if="inputs">
            <input v-for="item, key in inputs" :placeholder="item['placeholder']" :maxlength="item['maxlength']" :name="item['name']" :type="item['type']" class="input">
          </div>

          <div class="profile_list" v-if="profile_list">
            <div class="profile" v-for="item, key in $root.profiles">
              <div class="name" @click="$root.setProfile(key)">
                {{ item.name }}
              </div>

              <div @click="deleteProfile(key)" class="delete" v-if="key != 0">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 791.908 791.908" style="enable-background:new 0 0 791.908 791.908;" xml:space="preserve">
                  <g>
                  <path d="M648.587,99.881H509.156C500.276,43.486,452.761,0,394.444,0S287.696,43.486,279.731,99.881H142.315
                  c-26.733,0-48.43,21.789-48.43,48.43v49.437c0,24.719,17.761,44.493,41.564,47.423V727.64c0,35.613,28.655,64.268,64.268,64.268
                  h392.475c35.613,0,64.268-28.655,64.268-64.268V246.087c23.711-3.937,41.564-23.711,41.564-47.423v-49.437
                  C697.017,121.67,675.228,99.881,648.587,99.881z M394.444,36.62c38.543,0,70.219,26.733,77.085,63.261H316.351
                  C324.225,64.268,355.901,36.62,394.444,36.62z M618.924,728.739c0,14.831-11.901,27.648-27.648,27.648H198.71
                  c-14.831,0-27.648-11.901-27.648-27.648V247.185h446.948v481.554H618.924z M660.397,197.748c0,6.958-4.944,11.902-11.902,11.902
                  H142.223c-6.958,0-11.902-4.944-11.902-11.902v-49.437c0-6.958,4.944-11.902,11.902-11.902h505.265
                  c6.958,0,11.901,4.944,11.901,11.902v49.437H660.397z M253.09,661.45V349.081c0-9.887,7.873-17.761,17.761-17.761
                  s17.761,7.873,17.761,17.761V661.45c0,9.887-7.873,17.761-17.761,17.761C260.964,680.309,253.09,671.337,253.09,661.45z
                  M378.606,661.45V349.081c0-9.887,7.873-17.761,17.761-17.761c9.887,0,17.761,7.873,17.761,17.761V661.45
                  c0,9.887-7.873,17.761-17.761,17.761C386.57,680.309,378.606,671.337,378.606,661.45z M504.212,661.45V349.081
                  c0-9.887,7.873-17.761,17.761-17.761s17.761,7.873,17.761,17.761V661.45c0,9.887-7.873,17.761-17.761,17.761
                  C513.093,680.309,504.212,671.337,504.212,661.45z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                </svg>
              </div>
            </div>
          </div>

          <div class="buttons" v-if="buttons.length > 1">
            <button type="submit">{{ buttons[0] }}</button>
            <button @click.prevent="Close">{{ buttons[1] }}</button>
          </div>

          <div class="buttons single" v-else>
            <button @click.prevent="Close">{{ buttons[0] }}</button>
          </div>
        </form>
      `,

      methods: {
        Close() {
          this.$root.popup = "";
        },

        deleteProfile(id) {
          if (this.$root.settings.toggle['delete_profile']) {
            this.$root.openPopup("delete_profile", {'id':id});
          } else {
            this.$root.deleteProfile(id);
          }
        }
      }
    },

    "c-hotkey": {
      data() {
        return {
          value: [],
          old_value: [],
          capture: false,
        }
      },

      props: ["name", "bind", "default"],

      template: `
        <div class="hotkey" @click="startCaptureHotkey" :class="{'active': capture}">
          <input type="text" :name="name" v-model="computedValueJSON" hidden>
          {{ computedValue }}
        </div>
      `,

      methods: {
        startCaptureHotkey(event) {
          this.capture = true;
          this.$root.edit_hotkey = true;
          window.addEventListener('keydown', this.onKeyDown);
          window.addEventListener('keyup', this.onKeyUp);
        },

        stopCaptureHotkey(event) {
          this.capture = false;
          this.$root.edit_hotkey = false;
          window.removeEventListener('keydown', this.onKeyDown);
          window.removeEventListener('keyup', this.onKeyUp);
        },

        onKeyDown(event) {
          event.preventDefault();
          event.stopPropagation();

          let keys = [];
          
          if (event.ctrlKey) {
            keys.push(17);
          }

          if (event.altKey) {
            keys.push(18);
          } 

          if (event.shiftKey) {
            keys.push(16);
          }

          if (event.keyCode == 18 || event.keyCode == 17 || event.keyCode == 16) {
            this.value = keys;
            return
          }

          keys.push(event.keyCode);

          if (keys.length == 1 && keys[0] == 27) {
            this.value = this.old_value;
            this.stopCaptureHotkey();
            return;
          }

          if (keys.length == 1 && keys[0] == 8) {
            this.value = [];
            this.stopCaptureHotkey();
            return;
          }

          this.value = keys;
          this.old_value = this.value;

          this.stopCaptureHotkey();
        },

        onKeyUp(event) {
          this.value = [];

          if (event.ctrlKey) {
            this.value.push(17);
          }

          if (event.altKey) {
            this.value.push(18);
          } 

          if (event.shiftKey) {
            this.value.push(16);
          }
        }
      },

      computed: {
        computedValue() {
          return this.$root.getHotkeyName(this.value);
        },

        computedValueJSON() {
          return JSON.stringify(this.value);
        },
      },

      watch: {
        value() {
          if (this.bind !== undefined && this.$root.profiles[this.$root.profile].binds[this.bind].hotkey != this.value) {
            this.$emit("change-hotkey", this.bind, this.value);
          } else {
            this.$emit("change-hotkey-name", this.name, this.value);
          }
        }
      },

      mounted() {
        if (this.bind !== undefined) {
          this.value = this.$root.profiles[this.$root.profile].binds[this.bind].hotkey
        } else if (this.default !== undefined) {
          this.value = this.default;
        }
        
        this.old_value = this.value;
      }
    }
  },

  watch: {
    settings: {
      handler: function(newValue, oldValue) {
        if (!this.edit_hotkey) {
          this.saveConfig();

          let vue = this;

          this.$refs.settings_toggle.forEach(function(item) {
            item.value = vue.settings.toggle[item.name];
          });

          this.$refs.settings_hotkey.forEach(function(item) {
            item.value = vue.settings.binds[item.name];
            item.old_value = item.value;
          });
        }
      },
      deep: true
    },

    profiles: {
      handler: function(newValue, oldValue) {
        if (!this.edit_hotkey) {
          let i = 0;
          let vue = this;

          this.profiles[this.profile].binds.forEach(function(item) {
            vue.$refs.binds_bind_hotkey[i].value = item.hotkey;

            i += 1;
          });
        }
      },
      deep: true
    },
  },

  computed: {
    computedImage() {
      return "--test: url('../img/background/" + String(this.settings.image + 1) + ".jpg')";
    }
  },

  mounted() {
    let vue = this;

    this.saveConfig();
    
    setInterval(function() {
      if (vue.$refs.diamond_item) {
        vue.$refs.diamond_item.forEach(function(item) {
          item.classList.add('animated');
        });


        setTimeout(function() {
          vue.$refs.diamond_item.forEach(function(item) {
            item.classList.remove('animated');
          });
        }, 3000);
      }
    }, 3333);
  }
});

vue_app.directive('clickout', {
  mounted(el, binding) {
    el.clickOutsideEvent = event => {
      ;
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  }
});

const vm = vue_app.mount("body");

eel.expose(loadSettings);
function loadSettings(config) {
  vm.loadConfig(config);
}

eel.expose(checkUpdate);
function checkUpdate(version) {
  vm.checkUpdate(version);
}