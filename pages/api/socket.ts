import { Server } from 'socket.io';

export default function SocketHandler(req: Request, res: any) {
	// It means that socket server was already initialised
	if (res.socket.server.io) {
		console.log('socket is already set up');
		res.end();
		return;
	}

	const io = new Server(res.socket.server);
	res.socket.server.io = io;

	// Define actions inside
	io.on('connection', (socket) => {
		socket.on('chat message', (msg) => {
			console.log('message: ' + msg);

			// send a message to everyone except for a certain emitting socket
			socket.broadcast.emit('chat message', msg);

			//send the message to everyone, including the sender.
			// io.emit('chat message', msg);
		});

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});

	console.log('Setting up socket');
	res.end();
}
