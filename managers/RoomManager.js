"use strict";

class RoomManager {

  /**
   *
   * @param io
   */
  constructor(io) {
    this.io = io;
  }

  /**
   * Adds a socket to a room.
   *
   * Since our app constrains us to being in one retro at a time,
   * we will leave any existing rooms we've joined previously,
   * before being added to the desired room.
   *
   * @param {Socket} socket
   * @param {string} room
   */
  addSocketToRoom(socket, room) {
    const existingRoom = this.socketAlreadyHasRoom(socket);

    if (existingRoom) {
      socket.leave(existingRoom);
    }
  
    // socket.room = room;
    socket.join(room);

    this.sendToEntireRoom(room, 'update', 'Welcome to ' + room + ' with socket id ' + socket.id);
  }

  /**
   * Check if the socket already belongs to some room.
   *
   * @param {Socket} socket
   * @returns {string | null}
   */
  socketAlreadyHasRoom(socket) {
    let existingRoom = null;

    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        existingRoom = room;
      }
    });

    return existingRoom;
  }

  /**
   * Send an event to ALL members of a room.
   *
   * @param room
   * @param event
   * @param message
   */
  sendToEntireRoom(room, event, message) {
    this.io.to(room).emit(event, message);
  }

  /**
   * Send an event to all members of a room, excluding a particular socket.
   *
   * @param socket
   * @param room
   * @param event
   * @param message
   */
  sendToOtherMembersInRoom(socket, room, event, message) {
    socket.to(room).emit(event, message);
  }
}

module.exports = RoomManager;
