"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/buttons/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  User, 
  Mail, 
  Clock,
  CheckCircle,
  Send,
  Trash2,
  Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  replied_at: string | null;
  admin_response: string | null;
}

interface MessagesListProps {
  messages: Message[];
}

export function MessagesList({ messages }: MessagesListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const unreadCount = messages.filter(m => !m.replied_at).length;

  const selectedMsg = messages.find(m => m.id === selectedMessage);

  const handleResponse = async () => {
    if (!responseText.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("messages")
        .update({
          admin_response: responseText,
          replied_at: new Date().toISOString(),
        })
        .eq("id", selectedMessage);

      if (error) throw error;
      
      setMessage({ type: "success", text: "Response sent successfully!" });
      setResponseText("");
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
      
      setMessage({ type: "success", text: "Message deleted successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {message && (
        <div className={`lg:col-span-3 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.type === "success" 
            ? "bg-green-500/10 text-green-600 border border-green-500/20" 
            : "bg-red-500/10 text-red-600 border border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Messages List */}
      <div className="lg:col-span-1 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <span className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded-full text-xs sm:text-sm font-medium">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[600px] sm:max-h-[800px] overflow-y-auto">
          {messages.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No messages yet</p>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card
                key={msg.id}
                className={`p-3 sm:p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedMessage === msg.id
                    ? "border-primary bg-primary/5"
                    : msg.replied_at
                    ? "opacity-75"
                    : "border-orange-500/50 bg-orange-500/5"
                }`}
                onClick={() => setSelectedMessage(msg.id)}
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      msg.replied_at ? "bg-green-600" : "bg-orange-600"
                    }`} />
                    <span className="font-semibold text-xs sm:text-sm truncate">{msg.name}</span>
                  </div>
                  {msg.replied_at && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium mb-1 truncate">{msg.subject}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(msg.created_at)}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Message Details */}
      <div className="lg:col-span-2">
        {selectedMsg ? (
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Message Header */}
              <div className="flex items-start justify-between pb-3 sm:pb-4 border-b gap-3">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-lg sm:text-xl truncate">{selectedMsg.name}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{selectedMsg.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMessage(selectedMsg.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              {/* Subject */}
              <div>
                <Label className="text-xs sm:text-sm text-muted-foreground mb-1 block">
                  Subject
                </Label>
                <p className="text-base sm:text-lg font-semibold break-words">{selectedMsg.subject}</p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{formatDate(selectedMsg.created_at)}</span>
              </div>

              {/* Message */}
              <div>
                <Label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Message
                </Label>
                <div className="bg-muted p-3 sm:p-4 rounded-lg border border-border">
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{selectedMsg.message}</p>
                </div>
              </div>

              {/* Previous Response */}
              {selectedMsg.replied_at && selectedMsg.admin_response && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-green-600">
                      Replied on {formatDate(selectedMsg.replied_at)}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{selectedMsg.admin_response}</p>
                </div>
              )}

              {/* Response Form */}
              {!selectedMsg.replied_at && (
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                  <Label htmlFor="response" className="text-sm">Your Response</Label>
                  <Textarea
                    id="response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    rows={6}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleResponse}
                    disabled={loading || !responseText.trim()}
                    className="w-full sm:w-auto"
                    size="sm"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? "Sending..." : "Send Response"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-8 sm:p-10 md:p-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base md:text-lg">Select a message to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
}




