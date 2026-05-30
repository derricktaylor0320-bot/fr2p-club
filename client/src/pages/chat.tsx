import { useState, useEffect, useRef } from 'react';
import { SidebarNav } from '@/components/ui/sidebar-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Users } from 'lucide-react';
import type { ChatMessage, OnlinePresence } from '@shared/schema';

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();
const DEMO_USER_NAME = "Founder FR2P";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlinePresence[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      
      // Join chat
      socket.send(JSON.stringify({
        type: 'join',
        memberId: DEMO_USER_ID,
        memberName: DEMO_USER_NAME
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chatHistory') {
        setMessages(data.messages);
      } else if (data.type === 'newMessage') {
        setMessages(prev => [...prev, data.message]);
      } else if (data.type === 'onlineUsers') {
        setOnlineUsers(data.users);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ws || !messageInput.trim()) return;

    ws.send(JSON.stringify({
      type: 'chatMessage',
      memberId: DEMO_USER_ID,
      memberName: DEMO_USER_NAME,
      message: messageInput.trim(),
      isFromAdmin: false
    }));

    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">FR2P Community Chat</h1>
            <p className="text-foreground/80 mt-2">
              Connect with fellow members and get support from our team
            </p>
            <div className="mt-2">
              <Badge variant={isConnected ? "default" : "destructive"} data-testid="badge-connection-status">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Online Users Sidebar */}
            <Card className="lg:col-span-1" data-testid="card-online-users">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Online Now ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {onlineUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members online</p>
                  ) : (
                    onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2" data-testid={`user-online-${user.memberId}`}>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">{user.memberName}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3" data-testid="card-chat-messages">
              <CardHeader>
                <CardTitle>Chat Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages Display */}
                <div className="h-[500px] overflow-y-auto px-6 py-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === DEMO_USER_ID ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.senderId === DEMO_USER_ID
                              ? 'bg-primary text-primary-foreground'
                              : msg.isFromAdmin
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">
                            {msg.senderName} {msg.isFromAdmin && <Badge variant="secondary" className="ml-1 text-xs">Admin</Badge>}
                          </div>
                          <div className="text-sm break-words">{msg.message}</div>
                          <div className="text-xs opacity-50 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={!isConnected}
                      data-testid="input-chat-message"
                    />
                    <Button
                      type="submit"
                      disabled={!isConnected || !messageInput.trim()}
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
