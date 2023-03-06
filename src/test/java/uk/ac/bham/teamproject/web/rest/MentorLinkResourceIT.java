package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.ac.bham.teamproject.domain.MentorLink;
import uk.ac.bham.teamproject.repository.MentorLinkRepository;

/**
 * Integration tests for the {@link MentorLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MentorLinkResourceIT {

    private static final String ENTITY_API_URL = "/api/mentor-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MentorLinkRepository mentorLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMentorLinkMockMvc;

    private MentorLink mentorLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MentorLink createEntity(EntityManager em) {
        MentorLink mentorLink = new MentorLink();
        return mentorLink;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MentorLink createUpdatedEntity(EntityManager em) {
        MentorLink mentorLink = new MentorLink();
        return mentorLink;
    }

    @BeforeEach
    public void initTest() {
        mentorLink = createEntity(em);
    }

    @Test
    @Transactional
    void createMentorLink() throws Exception {
        int databaseSizeBeforeCreate = mentorLinkRepository.findAll().size();
        // Create the MentorLink
        restMentorLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentorLink)))
            .andExpect(status().isCreated());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeCreate + 1);
        MentorLink testMentorLink = mentorLinkList.get(mentorLinkList.size() - 1);
    }

    @Test
    @Transactional
    void createMentorLinkWithExistingId() throws Exception {
        // Create the MentorLink with an existing ID
        mentorLink.setId(1L);

        int databaseSizeBeforeCreate = mentorLinkRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMentorLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentorLink)))
            .andExpect(status().isBadRequest());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMentorLinks() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        // Get all the mentorLinkList
        restMentorLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mentorLink.getId().intValue())));
    }

    @Test
    @Transactional
    void getMentorLink() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        // Get the mentorLink
        restMentorLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, mentorLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mentorLink.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMentorLink() throws Exception {
        // Get the mentorLink
        restMentorLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMentorLink() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();

        // Update the mentorLink
        MentorLink updatedMentorLink = mentorLinkRepository.findById(mentorLink.getId()).get();
        // Disconnect from session so that the updates on updatedMentorLink are not directly saved in db
        em.detach(updatedMentorLink);

        restMentorLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMentorLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMentorLink))
            )
            .andExpect(status().isOk());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
        MentorLink testMentorLink = mentorLinkList.get(mentorLinkList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mentorLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentorLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentorLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentorLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMentorLinkWithPatch() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();

        // Update the mentorLink using partial update
        MentorLink partialUpdatedMentorLink = new MentorLink();
        partialUpdatedMentorLink.setId(mentorLink.getId());

        restMentorLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentorLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentorLink))
            )
            .andExpect(status().isOk());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
        MentorLink testMentorLink = mentorLinkList.get(mentorLinkList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateMentorLinkWithPatch() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();

        // Update the mentorLink using partial update
        MentorLink partialUpdatedMentorLink = new MentorLink();
        partialUpdatedMentorLink.setId(mentorLink.getId());

        restMentorLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentorLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentorLink))
            )
            .andExpect(status().isOk());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
        MentorLink testMentorLink = mentorLinkList.get(mentorLinkList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mentorLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentorLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentorLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMentorLink() throws Exception {
        int databaseSizeBeforeUpdate = mentorLinkRepository.findAll().size();
        mentorLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorLinkMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mentorLink))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MentorLink in the database
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMentorLink() throws Exception {
        // Initialize the database
        mentorLinkRepository.saveAndFlush(mentorLink);

        int databaseSizeBeforeDelete = mentorLinkRepository.findAll().size();

        // Delete the mentorLink
        restMentorLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, mentorLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MentorLink> mentorLinkList = mentorLinkRepository.findAll();
        assertThat(mentorLinkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
