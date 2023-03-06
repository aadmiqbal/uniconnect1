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
import uk.ac.bham.teamproject.domain.Mentors;
import uk.ac.bham.teamproject.repository.MentorsRepository;

/**
 * Integration tests for the {@link MentorsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MentorsResourceIT {

    private static final String ENTITY_API_URL = "/api/mentors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MentorsRepository mentorsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMentorsMockMvc;

    private Mentors mentors;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mentors createEntity(EntityManager em) {
        Mentors mentors = new Mentors();
        return mentors;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mentors createUpdatedEntity(EntityManager em) {
        Mentors mentors = new Mentors();
        return mentors;
    }

    @BeforeEach
    public void initTest() {
        mentors = createEntity(em);
    }

    @Test
    @Transactional
    void createMentors() throws Exception {
        int databaseSizeBeforeCreate = mentorsRepository.findAll().size();
        // Create the Mentors
        restMentorsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentors)))
            .andExpect(status().isCreated());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeCreate + 1);
        Mentors testMentors = mentorsList.get(mentorsList.size() - 1);
    }

    @Test
    @Transactional
    void createMentorsWithExistingId() throws Exception {
        // Create the Mentors with an existing ID
        mentors.setId(1L);

        int databaseSizeBeforeCreate = mentorsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMentorsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentors)))
            .andExpect(status().isBadRequest());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMentors() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        // Get all the mentorsList
        restMentorsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mentors.getId().intValue())));
    }

    @Test
    @Transactional
    void getMentors() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        // Get the mentors
        restMentorsMockMvc
            .perform(get(ENTITY_API_URL_ID, mentors.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mentors.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMentors() throws Exception {
        // Get the mentors
        restMentorsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMentors() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();

        // Update the mentors
        Mentors updatedMentors = mentorsRepository.findById(mentors.getId()).get();
        // Disconnect from session so that the updates on updatedMentors are not directly saved in db
        em.detach(updatedMentors);

        restMentorsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMentors.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMentors))
            )
            .andExpect(status().isOk());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
        Mentors testMentors = mentorsList.get(mentorsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mentors.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentors))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentors))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentors)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMentorsWithPatch() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();

        // Update the mentors using partial update
        Mentors partialUpdatedMentors = new Mentors();
        partialUpdatedMentors.setId(mentors.getId());

        restMentorsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentors.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentors))
            )
            .andExpect(status().isOk());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
        Mentors testMentors = mentorsList.get(mentorsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateMentorsWithPatch() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();

        // Update the mentors using partial update
        Mentors partialUpdatedMentors = new Mentors();
        partialUpdatedMentors.setId(mentors.getId());

        restMentorsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentors.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentors))
            )
            .andExpect(status().isOk());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
        Mentors testMentors = mentorsList.get(mentorsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mentors.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentors))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentors))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMentors() throws Exception {
        int databaseSizeBeforeUpdate = mentorsRepository.findAll().size();
        mentors.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMentorsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mentors)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mentors in the database
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMentors() throws Exception {
        // Initialize the database
        mentorsRepository.saveAndFlush(mentors);

        int databaseSizeBeforeDelete = mentorsRepository.findAll().size();

        // Delete the mentors
        restMentorsMockMvc
            .perform(delete(ENTITY_API_URL_ID, mentors.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mentors> mentorsList = mentorsRepository.findAll();
        assertThat(mentorsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
