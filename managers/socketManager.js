"use strict";

var RoomManager = require('../managers/RoomManager')
, _ = require('underscore')._;

class SocketManager {

  /**
   *
   * @param io
   */
  constructor(io) {
    this.io = io;

    this.sockets = [];

    this.roomManager = new RoomManager(this.io);
  }

  /**
   * Setup the connections.
   *
   * Since our app constrains us to being in one retro at a time,
   *
   * @param io
   */
  setupManager(io) {
    var self = this;
 
    this.io = io;
    this.io.sockets.on('connection', function(socket) {

      // listens when a user joins a retrospective with a roomCode  
      socket.on('joinServer', function(roomCode) {
        console.log('['+socket.id+']: joinServer: ' + roomCode);

        self.addSocket(socket.id, socket);
        self.roomManager.addSocketToRoom(socket, roomCode);
        self.roomManager.sendToEntireRoom(roomCode, 'update', socket.id + ' is in the retro');

        console.log('Client %s connected to socket server.', Object.keys(self.sockets).length);
      });

      // called whenever a retrospective is updated
      socket.on('update', function(data) {
        console.log('['+socket.id+']: update');
        console.log(data);

        var dataObj = {
          roomCode: data.roomCode,
          eventType: data.eventType,
          eventData: data.eventData
        };

        self.roomManager.sendToEntireRoom(data.roomCode, 'update', dataObj);
      });

      // listens whenever a user disconnects
      socket.on('disconnect', function() {
        console.log('['+socket.id+']: disconnect');
        self.removeSocket(socket.id);
      });

    });
  }

  /**
   * Stores a socket reference.
   *
   * @param {string} id     - client websocket id
   * @param {Object} socket - web socket
   */
  addSocket(id, socket) {
    console.log('addSocket: '+id);
    this.sockets[id] = socket;
  }

  /**
   * Retrieves a socket reference.
   *
   * @param {string} id - client websocket id
   *
   * @return {Object} web socket
   */
  getSocket(id) {
    console.log('getSocket: '+id);
    return this.sockets[id];
  };

  /**
   * Deletes a socket reference.
   *
   * @param {string} id - client websocket id
   */
  removeSocket(id) {
    delete this.sockets[id];
  };
}

module.exports = SocketManager;
