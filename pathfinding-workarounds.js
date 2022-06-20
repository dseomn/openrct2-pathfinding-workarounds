/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PLUGIN_NAME = 'Pathfinding Workarounds';

var enabled = false;

function helpLostGuests() {
  if (!enabled) {
    return;
  }

  var guestsRemoved = 0;
  map.getAllEntities('guest').forEach(function(guest) {
    if (!guest.isInPark || !guest.isLost) {
      return;
    }

    if (guest.getFlag('leavingPark')) {
      guest.remove();
      ++guestsRemoved;
      return;
    }

    // TODO(dseomn): Figure out a way to help lost guests who aren't trying to
    // leave the park. See
    // https://github.com/OpenRCT2/OpenRCT2/discussions/17379 for issues with
    // using guest.destination.
  });
  console.log('Removed ' + guestsRemoved + ' lost guests.');
}

function showSettings() {
  ui.openWindow({
    classification: PLUGIN_NAME,
    width: 220,
    height: 40,
    title: PLUGIN_NAME,
    widgets: [
      {
        type: 'checkbox',
        x: 10,
        y: 20,
        width: 200,
        height: 10,
        text: 'Enable pathfinding workarounds',
        isChecked: enabled,
        onChange: function(isChecked) { enabled = isChecked; },
      },
    ],
  });
}

function main() {
  context.subscribe('interval.day', helpLostGuests);
  if (typeof ui !== 'undefined') {
    ui.registerMenuItem(PLUGIN_NAME, showSettings);
  }
}

registerPlugin({
  name: PLUGIN_NAME,
  version: '0',
  authors: ['David Mandelberg'],
  type: 'remote',
  licence: 'Apache-2.0',
  minApiVersion: 52,
  targetApiVersion: 52,
  main: main,
});
