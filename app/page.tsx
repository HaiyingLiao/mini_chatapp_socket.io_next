'use client';

import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const socket = io();

type MessageType = {
	author: string;
	message: string;
};

export default function Home() {
	const messagesEndRef = useRef<null | HTMLDivElement>(null);
	const [username, setUsername] = useState<string>('');
	const [startChat, setStartChat] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [messages, setMessages] = useState<Array<MessageType>>([]);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		socket.emit('chat message', { author: username, message });
		setMessage('');
	};

	useEffect(() => {
		const handleMessage = (msg: MessageType) => {
			setMessages((prevMsgs) => {
				return [...prevMsgs, { author: msg.author, message: msg.message }];
			});
		};
		socket.on('chat message', handleMessage);

		return () => {
			socket.off('chat message', handleMessage);
		};
	}, []);

	useEffect(() => {
		// This will scroll the messages container to the bottom whenever the messages array changes
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<main className='w-full h-full text-black text-2xl'>
			{!startChat ? (
				<form
					onSubmit={() => setStartChat(true)}
					className='mx-auto my-[20%] w-96 flex flex-col items-center gap-3'
				>
					<h3 className='font-bold text-xl'>Please enter your username</h3>
					<div className='flex gap-3'>
						<input
							type='text'
							placeholder='Username...'
							value={username}
							className='p-3 rounded-md outline-none'
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<button type='submit' className='bg-white rounded-md p-3 '>
							Submit
						</button>
					</div>
				</form>
			) : (
				<>
					<ul className='h-full overflow-y-scroll mb-12 mx-1'>
						{messages.map((msg, i) => {
							return (
								<li
									className={`w-full flex ${
										msg.author === username ? 'justify-start' : 'justify-end'
									} m-1`}
									key={i}
								>
									<div className='bg-white w-fit rounded py-1 px-2 '>
										<span className='font-bold'>{msg.author} :</span>
										{msg.message}
									</div>
								</li>
							);
						})}
						<div ref={messagesEndRef} />
					</ul>

					<form
						onSubmit={sendMessage}
						className='bg-[#00000026] p-1 flex h-12 fixed bottom-0 left-0 w-full'
					>
						<input
							type='text'
							placeholder='New message...'
							value={message}
							className='outline-none px-4 rounded-tl-md rounded-br-md flex-1 m-1'
							onChange={(e) => setMessage(e.target.value)}
							required
						/>

						<button
							type='submit'
							className='text-white rounded-md px-4 m-1 bg-[#333] hover:opacity-90'
						>
							Send
						</button>
					</form>
				</>
			)}
		</main>
	);
}
