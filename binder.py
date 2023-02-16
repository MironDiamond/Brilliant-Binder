# Brilliant Binder for GTA5
# by Miron Diamond

import eel
import pyperclip
import keyboard
import atexit
import json
import requests
import random
import os
import threading
from win10toast import ToastNotifier

from time import sleep

toaster = ToastNotifier()

eel.init("resource")

PLAY = False

CONFIG = {}

keyCodes = {'8': {'name': 'Backspace', 'code': 14}, '9': {'name': 'Tab', 'code': 15}, '13': {'name': 'Enter', 'code': 28}, '16': {'name': 'Shift', 'code': 42}, '17': {'name': 'Ctrl', 'code': 29}, '18': {'name': 'Alt', 'code': 56}, '20': {'name': 'Caps Lock', 'code': 58}, '27': {'name': 'Esc', 'code': 1}, '32': {'name': 'Space', 'code': 57}, '33': {'name': 'Page Up', 'code': 73}, '34': {'name': 'Page Down', 'code': 81}, '35': {'name': 'End', 'code': 79}, '36': {'name': 'Home', 'code': 71}, '37': {'name': 'Arrow Left', 'code': 75}, '38': {'name': 'Arrow Up', 'code': 72}, '39': {'name': 'Arrow Right', 'code': 77}, '40': {'name': 'Arrow Down', 'code': 80}, '45': {'name': 'Insert', 'code': 82}, '46': {'name': 'Delete', 'code': 83}, '48': {'name': '0', 'code': 11}, '49': {'name': '1', 'code': 2}, '50': {'name': '2', 'code': 3}, '51': {'name': '3', 'code': 4}, '52': {'name': '4', 'code': 5}, '53': {'name': '5', 'code': 6}, '54': {'name': '6', 'code': 7}, '55': {'name': '7', 'code': 8}, '56': {'name': '8', 'code': 9}, '57': {'name': '9', 'code': 10}, '65': {'name': 'A', 'code': 30}, '66': {'name': 'B', 'code': 48}, '67': {'name': 'C', 'code': 46}, '68': {'name': 'D', 'code': 32}, '69': {'name': 'E', 'code': 18}, '70': {'name': 'F', 'code': 33}, '71': {'name': 'G', 'code': 34}, '72': {'name': 'H', 'code': 35}, '73': {'name': 'I', 'code': 23}, '74': {'name': 'J', 'code': 36}, '75': {'name': 'K', 'code': 37}, '76': {'name': 'L', 'code': 38}, '77': {'name': 'M', 'code': 50}, '78': {'name': 'N', 'code': 49}, '79': {'name': 'O', 'code': 24}, '80': {'name': 'P', 'code': 25}, '81': {'name': 'Q', 'code': 16}, '82': {'name': 'R', 'code': 19}, '83': {'name': 'S', 'code': 31}, '84': {'name': 'T', 'code': 20}, '85': {'name': 'U', 'code': 22}, '86': {'name': 'V', 'code': 47}, '87': {'name': 'W', 'code': 17}, '88': {'name': 'X', 'code': 45}, '89': {'name': 'Y', 'code': 21}, '90': {'name': 'Z', 'code': 44}, '91': {'name': 'Windows', 'code': 91}, '92': {'name': 'Windows', 'code': 91}, '96': {'name': 'Numpad 0', 'code': 82}, '97': {'name': 'Numpad 1', 'code': 79}, '98': {'name': 'Numpad 2', 'code': 80}, '99': {'name': 'Numpad 3', 'code': 81}, '100': {'name': 'Numpad 4', 'code': 75}, '101': {'name': 'Numpad 5', 'code': 76}, '102': {'name': 'Numpad 6', 'code': 77}, '103': {'name': 'Numpad 7', 'code': 71}, '104': {'name': 'Numpad 8', 'code': 72}, '105': {'name': 'Numpad 9', 'code': 73}, '106': {'name': 'Numpad *', 'code': 55}, '107': {'name': 'Numpad +', 'code': 78}, '109': {'name': 'Numpad -', 'code': 74}, '110': {'name': 'Numpad .', 'code': 83}, '111': {'name': 'Numpad /', 'code': 53}, '112': {'name': 'F1', 'code': 59}, '113': {'name': 'F2', 'code': 60}, '114': {'name': 'F3', 'code': 61}, '115': {'name': 'F4', 'code': 62}, '116': {'name': 'F5', 'code': 63}, '117': {'name': 'F6', 'code': 64}, '118': {'name': 'F7', 'code': 65}, '119': {'name': 'F8', 'code': 66}, '120': {'name': 'F9', 'code': 67}, '121': {'name': 'F10', 'code': 68}, '122': {'name': 'F11', 'code': 87}, '123': {'name': 'F12', 'code': 88}, '144': {'name': 'Num Lock', 'code': 69}, '145': {'name': 'Scroll Lock', 'code': 70}, '186': {'name': ';', 'code': 39}, '187': {'name': '=', 'code': 13}, '188': {'name': ',', 'code': 51}, '189': {'name': '-', 'code': 12}, '190': {'name': '.', 'code': 52}, '191': {'name': '/', 'code': 53}, '192': {'name': '`', 'code': 41}, '219': {'name': '[', 'code': 26}, '220': {'name': '\\', 'code': 43}, '221': {'name': ']', 'code': 27}, '222': {'name': "'", 'code': 40}}

def wait(arg): # hello lua
	arg = int(arg)

	arg = arg / 1000

	sleep(arg)

def pairs(obj): # hello lua
  return obj.items()

def ipairs(obj): # hello lua
  return enumerate(obj)

def setClipboard(name):
	pyperclip.copy(name)
	pyperclip.paste()

def Bind(array, hotkey):
	if not PLAY:
		return
	
	for key in hotkey:
		while True:
			if not keyboard.is_pressed(key):
				break
	
	wait(CONFIG['settings']['wait']['after_hotkey'])

	input_mode = CONFIG['settings']['input_mode']

	for num, item in ipairs(array):
		get_open_chat_key = CONFIG['settings']['binds']['open_chat']
		get_open_chat_key_result = []

		for key in get_open_chat_key:
			get_open_chat_key_result.append(keyCodes[str(key)]['code'])

		keyboard.send(get_open_chat_key_result)

		wait(CONFIG['settings']['wait']['after_open_chat'])

		if CONFIG['settings']['toggle']['arizona_delete_tag'] and item['text'][0] != "/":
			for i in range(32):
				keyboard.send(14)
				wait(0)

		if input_mode == 4:
			setClipboard(item['text'])
			wait(0)
			keyboard.send([29, 47])
		elif input_mode == 3:
			keyboard.write(item['text'], delay=0)
		elif input_mode == 2:
			keyboard.write(item['text'], delay=random.randint(0, 20) / 1000)
		elif input_mode == 1:
			keyboard.write(item['text'], delay=random.randint(10, 170) / 1000)
		elif input_mode == 0:
			keyboard.write(item['text'], delay=random.randint(400, 777) / 1000)

		keyboard.send(28)

		if (num != len(array) - 1):
			wait(item['wait'])

@eel.expose
def Play(value):
	global PLAY

	if PLAY != value:
		PLAY = value
		
		text = "Биндер деактивирован."

		if value:
			text = "Биндер активирован!"

		if (CONFIG['settings']['toggle']['windows_notf']):
			toaster.show_toast("Brilliant Binder", text, icon_path="resource/img/logo.ico", duration=2, threaded=True)

@eel.expose
def updateConfig(array):
	global CONFIG

	if CONFIG == json.loads(array):
		return
	
	CONFIG = json.loads(array)

	try:
		keyboard.unhook_all_hotkeys()
	except:
		pass

	for bind in CONFIG['profiles'][CONFIG['profile']]['binds']:
		if bind['status']:
			keys = []

			for item in bind['hotkey']:
				keys.append(keyCodes[str(item)]['code'])
			
			if (len(keys) > 0 and (keys[len(keys) - 1] == 42 or keys[len(keys) - 1] == 29 or keys[len(keys) - 1] == 56)):
				return

			messages = bind['messages']

			keyboard.add_hotkey(tuple(keys), Bind, args=(messages, keys), timeout=0)

@eel.expose
def exportProfile():
	file = open('profiles/' + CONFIG['profiles'][CONFIG['profile']]['name'] + ".json", "wb")
	
	profile = CONFIG['profiles'][CONFIG['profile']]

	profile['binder'] = "Brilliant Binder"

	file.write(json.dumps(profile).encode("utf-8", "ignore"))
	file.close()

def saveSettings():
	if CONFIG == {}:
		return

	file = open("config.json", "wb")
	file.write(json.dumps(CONFIG).encode("utf-8", "ignore"))
	file.close()

def checkUpdate():
	request = requests.get("https://mirondiamond.com/api/versions/1/")
	
	if request.status_code == 200:
		eel.checkUpdate(request.text)

def loadConfig():
	try:
		file = open("config.json", "r")
		config = json.loads(file.read())
		file.close()

		eel.loadSettings(config)
		threading.Thread(target=checkUpdate, daemon=True).start()
	except:
		eel.loadSettings(None)

if __name__ == '__main__':
	try:
		atexit.register(saveSettings)

		loadConfig()

		eel.browsers.set_path('electron', 'electron/electron.exe')
		eel.start('resource/index.html', mode='electron', port=8888)
	except:
		pass