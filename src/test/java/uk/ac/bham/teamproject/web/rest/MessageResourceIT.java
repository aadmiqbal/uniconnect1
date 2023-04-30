package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Message;
import uk.ac.bham.teamproject.repository.MessageRepository;
import uk.ac.bham.teamproject.service.criteria.MessageCriteria;
import uk.ac.bham.teamproject.service.dto.MessageDTO;
import uk.ac.bham.teamproject.service.mapper.MessageMapper;

/**
 * Integration tests for the {@link MessageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MessageResourceIT {

    private static final Integer DEFAULT_SENDER_ID = 1;
    private static final Integer UPDATED_SENDER_ID = 2;
    private static final Integer SMALLER_SENDER_ID = 1 - 1;

    private static final Integer DEFAULT_RECIEVER_ID = 1;
    private static final Integer UPDATED_RECIEVER_ID = 2;
    private static final Integer SMALLER_RECIEVER_ID = 1 - 1;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/messages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMessageMockMvc;

    private Message message;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Message createEntity(EntityManager em) {
        Message message = new Message()
            .senderId(DEFAULT_SENDER_ID)
            .recieverId(DEFAULT_RECIEVER_ID)
            .content(DEFAULT_CONTENT)
            .timestamp(DEFAULT_TIMESTAMP);
        return message;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Message createUpdatedEntity(EntityManager em) {
        Message message = new Message()
            .senderId(UPDATED_SENDER_ID)
            .recieverId(UPDATED_RECIEVER_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP);
        return message;
    }

    @BeforeEach
    public void initTest() {
        message = createEntity(em);
    }

    @Test
    @Transactional
    void createMessage() throws Exception {
        int databaseSizeBeforeCreate = messageRepository.findAll().size();
        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);
        restMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(messageDTO)))
            .andExpect(status().isCreated());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeCreate + 1);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(DEFAULT_SENDER_ID);
        assertThat(testMessage.getRecieverId()).isEqualTo(DEFAULT_RECIEVER_ID);
        assertThat(testMessage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testMessage.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createMessageWithExistingId() throws Exception {
        // Create the Message with an existing ID
        message.setId(1L);
        MessageDTO messageDTO = messageMapper.toDto(message);

        int databaseSizeBeforeCreate = messageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMessageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(messageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMessages() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList
        restMessageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(message.getId().intValue())))
            .andExpect(jsonPath("$.[*].senderId").value(hasItem(DEFAULT_SENDER_ID)))
            .andExpect(jsonPath("$.[*].recieverId").value(hasItem(DEFAULT_RECIEVER_ID)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getMessage() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get the message
        restMessageMockMvc
            .perform(get(ENTITY_API_URL_ID, message.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(message.getId().intValue()))
            .andExpect(jsonPath("$.senderId").value(DEFAULT_SENDER_ID))
            .andExpect(jsonPath("$.recieverId").value(DEFAULT_RECIEVER_ID))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getMessagesByIdFiltering() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        Long id = message.getId();

        defaultMessageShouldBeFound("id.equals=" + id);
        defaultMessageShouldNotBeFound("id.notEquals=" + id);

        defaultMessageShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultMessageShouldNotBeFound("id.greaterThan=" + id);

        defaultMessageShouldBeFound("id.lessThanOrEqual=" + id);
        defaultMessageShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId equals to DEFAULT_SENDER_ID
        defaultMessageShouldBeFound("senderId.equals=" + DEFAULT_SENDER_ID);

        // Get all the messageList where senderId equals to UPDATED_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.equals=" + UPDATED_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsInShouldWork() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId in DEFAULT_SENDER_ID or UPDATED_SENDER_ID
        defaultMessageShouldBeFound("senderId.in=" + DEFAULT_SENDER_ID + "," + UPDATED_SENDER_ID);

        // Get all the messageList where senderId equals to UPDATED_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.in=" + UPDATED_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId is not null
        defaultMessageShouldBeFound("senderId.specified=true");

        // Get all the messageList where senderId is null
        defaultMessageShouldNotBeFound("senderId.specified=false");
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId is greater than or equal to DEFAULT_SENDER_ID
        defaultMessageShouldBeFound("senderId.greaterThanOrEqual=" + DEFAULT_SENDER_ID);

        // Get all the messageList where senderId is greater than or equal to UPDATED_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.greaterThanOrEqual=" + UPDATED_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId is less than or equal to DEFAULT_SENDER_ID
        defaultMessageShouldBeFound("senderId.lessThanOrEqual=" + DEFAULT_SENDER_ID);

        // Get all the messageList where senderId is less than or equal to SMALLER_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.lessThanOrEqual=" + SMALLER_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsLessThanSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId is less than DEFAULT_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.lessThan=" + DEFAULT_SENDER_ID);

        // Get all the messageList where senderId is less than UPDATED_SENDER_ID
        defaultMessageShouldBeFound("senderId.lessThan=" + UPDATED_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesBySenderIdIsGreaterThanSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where senderId is greater than DEFAULT_SENDER_ID
        defaultMessageShouldNotBeFound("senderId.greaterThan=" + DEFAULT_SENDER_ID);

        // Get all the messageList where senderId is greater than SMALLER_SENDER_ID
        defaultMessageShouldBeFound("senderId.greaterThan=" + SMALLER_SENDER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId equals to DEFAULT_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.equals=" + DEFAULT_RECIEVER_ID);

        // Get all the messageList where recieverId equals to UPDATED_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.equals=" + UPDATED_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsInShouldWork() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId in DEFAULT_RECIEVER_ID or UPDATED_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.in=" + DEFAULT_RECIEVER_ID + "," + UPDATED_RECIEVER_ID);

        // Get all the messageList where recieverId equals to UPDATED_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.in=" + UPDATED_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId is not null
        defaultMessageShouldBeFound("recieverId.specified=true");

        // Get all the messageList where recieverId is null
        defaultMessageShouldNotBeFound("recieverId.specified=false");
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId is greater than or equal to DEFAULT_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.greaterThanOrEqual=" + DEFAULT_RECIEVER_ID);

        // Get all the messageList where recieverId is greater than or equal to UPDATED_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.greaterThanOrEqual=" + UPDATED_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId is less than or equal to DEFAULT_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.lessThanOrEqual=" + DEFAULT_RECIEVER_ID);

        // Get all the messageList where recieverId is less than or equal to SMALLER_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.lessThanOrEqual=" + SMALLER_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsLessThanSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId is less than DEFAULT_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.lessThan=" + DEFAULT_RECIEVER_ID);

        // Get all the messageList where recieverId is less than UPDATED_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.lessThan=" + UPDATED_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByRecieverIdIsGreaterThanSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where recieverId is greater than DEFAULT_RECIEVER_ID
        defaultMessageShouldNotBeFound("recieverId.greaterThan=" + DEFAULT_RECIEVER_ID);

        // Get all the messageList where recieverId is greater than SMALLER_RECIEVER_ID
        defaultMessageShouldBeFound("recieverId.greaterThan=" + SMALLER_RECIEVER_ID);
    }

    @Test
    @Transactional
    void getAllMessagesByContentIsEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where content equals to DEFAULT_CONTENT
        defaultMessageShouldBeFound("content.equals=" + DEFAULT_CONTENT);

        // Get all the messageList where content equals to UPDATED_CONTENT
        defaultMessageShouldNotBeFound("content.equals=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllMessagesByContentIsInShouldWork() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where content in DEFAULT_CONTENT or UPDATED_CONTENT
        defaultMessageShouldBeFound("content.in=" + DEFAULT_CONTENT + "," + UPDATED_CONTENT);

        // Get all the messageList where content equals to UPDATED_CONTENT
        defaultMessageShouldNotBeFound("content.in=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllMessagesByContentIsNullOrNotNull() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where content is not null
        defaultMessageShouldBeFound("content.specified=true");

        // Get all the messageList where content is null
        defaultMessageShouldNotBeFound("content.specified=false");
    }

    @Test
    @Transactional
    void getAllMessagesByContentContainsSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where content contains DEFAULT_CONTENT
        defaultMessageShouldBeFound("content.contains=" + DEFAULT_CONTENT);

        // Get all the messageList where content contains UPDATED_CONTENT
        defaultMessageShouldNotBeFound("content.contains=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllMessagesByContentNotContainsSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where content does not contain DEFAULT_CONTENT
        defaultMessageShouldNotBeFound("content.doesNotContain=" + DEFAULT_CONTENT);

        // Get all the messageList where content does not contain UPDATED_CONTENT
        defaultMessageShouldBeFound("content.doesNotContain=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllMessagesByTimestampIsEqualToSomething() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where timestamp equals to DEFAULT_TIMESTAMP
        defaultMessageShouldBeFound("timestamp.equals=" + DEFAULT_TIMESTAMP);

        // Get all the messageList where timestamp equals to UPDATED_TIMESTAMP
        defaultMessageShouldNotBeFound("timestamp.equals=" + UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void getAllMessagesByTimestampIsInShouldWork() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where timestamp in DEFAULT_TIMESTAMP or UPDATED_TIMESTAMP
        defaultMessageShouldBeFound("timestamp.in=" + DEFAULT_TIMESTAMP + "," + UPDATED_TIMESTAMP);

        // Get all the messageList where timestamp equals to UPDATED_TIMESTAMP
        defaultMessageShouldNotBeFound("timestamp.in=" + UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void getAllMessagesByTimestampIsNullOrNotNull() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        // Get all the messageList where timestamp is not null
        defaultMessageShouldBeFound("timestamp.specified=true");

        // Get all the messageList where timestamp is null
        defaultMessageShouldNotBeFound("timestamp.specified=false");
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultMessageShouldBeFound(String filter) throws Exception {
        restMessageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(message.getId().intValue())))
            .andExpect(jsonPath("$.[*].senderId").value(hasItem(DEFAULT_SENDER_ID)))
            .andExpect(jsonPath("$.[*].recieverId").value(hasItem(DEFAULT_RECIEVER_ID)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));

        // Check, that the count call also returns 1
        restMessageMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultMessageShouldNotBeFound(String filter) throws Exception {
        restMessageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restMessageMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingMessage() throws Exception {
        // Get the message
        restMessageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMessage() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        int databaseSizeBeforeUpdate = messageRepository.findAll().size();

        // Update the message
        Message updatedMessage = messageRepository.findById(message.getId()).get();
        // Disconnect from session so that the updates on updatedMessage are not directly saved in db
        em.detach(updatedMessage);
        updatedMessage.senderId(UPDATED_SENDER_ID).recieverId(UPDATED_RECIEVER_ID).content(UPDATED_CONTENT).timestamp(UPDATED_TIMESTAMP);
        MessageDTO messageDTO = messageMapper.toDto(updatedMessage);

        restMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, messageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isOk());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(UPDATED_SENDER_ID);
        assertThat(testMessage.getRecieverId()).isEqualTo(UPDATED_RECIEVER_ID);
        assertThat(testMessage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testMessage.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, messageDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(messageDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMessageWithPatch() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        int databaseSizeBeforeUpdate = messageRepository.findAll().size();

        // Update the message using partial update
        Message partialUpdatedMessage = new Message();
        partialUpdatedMessage.setId(message.getId());

        restMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMessage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMessage))
            )
            .andExpect(status().isOk());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(DEFAULT_SENDER_ID);
        assertThat(testMessage.getRecieverId()).isEqualTo(DEFAULT_RECIEVER_ID);
        assertThat(testMessage.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testMessage.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateMessageWithPatch() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        int databaseSizeBeforeUpdate = messageRepository.findAll().size();

        // Update the message using partial update
        Message partialUpdatedMessage = new Message();
        partialUpdatedMessage.setId(message.getId());

        partialUpdatedMessage
            .senderId(UPDATED_SENDER_ID)
            .recieverId(UPDATED_RECIEVER_ID)
            .content(UPDATED_CONTENT)
            .timestamp(UPDATED_TIMESTAMP);

        restMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMessage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMessage))
            )
            .andExpect(status().isOk());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
        Message testMessage = messageList.get(messageList.size() - 1);
        assertThat(testMessage.getSenderId()).isEqualTo(UPDATED_SENDER_ID);
        assertThat(testMessage.getRecieverId()).isEqualTo(UPDATED_RECIEVER_ID);
        assertThat(testMessage.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testMessage.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, messageDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMessage() throws Exception {
        int databaseSizeBeforeUpdate = messageRepository.findAll().size();
        message.setId(count.incrementAndGet());

        // Create the Message
        MessageDTO messageDTO = messageMapper.toDto(message);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMessageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(messageDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Message in the database
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMessage() throws Exception {
        // Initialize the database
        messageRepository.saveAndFlush(message);

        int databaseSizeBeforeDelete = messageRepository.findAll().size();

        // Delete the message
        restMessageMockMvc
            .perform(delete(ENTITY_API_URL_ID, message.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Message> messageList = messageRepository.findAll();
        assertThat(messageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
