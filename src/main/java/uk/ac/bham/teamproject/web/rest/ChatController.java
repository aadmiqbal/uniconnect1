package uk.ac.bham.teamproject.web.rest;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate template;

    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }
    /* @MessageMapping("/sendMessage")
    public void sendMessage(Message message) {
        template.convertAndSend("/topic/messages/" + message.getReceiverId(), message);
    } */
}
