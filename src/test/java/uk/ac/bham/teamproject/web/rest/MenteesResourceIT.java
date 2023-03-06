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
import uk.ac.bham.teamproject.domain.Mentees;
import uk.ac.bham.teamproject.repository.MenteesRepository;

/**
 * Integration tests for the {@link MenteesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MenteesResourceIT {

    private static final String ENTITY_API_URL = "/api/mentees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MenteesRepository menteesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMenteesMockMvc;

    private Mentees mentees;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mentees createEntity(EntityManager em) {
        Mentees mentees = new Mentees();
        return mentees;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mentees createUpdatedEntity(EntityManager em) {
        Mentees mentees = new Mentees();
        return mentees;
    }

    @BeforeEach
    public void initTest() {
        mentees = createEntity(em);
    }

    @Test
    @Transactional
    void createMentees() throws Exception {
        int databaseSizeBeforeCreate = menteesRepository.findAll().size();
        // Create the Mentees
        restMenteesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentees)))
            .andExpect(status().isCreated());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeCreate + 1);
        Mentees testMentees = menteesList.get(menteesList.size() - 1);
    }

    @Test
    @Transactional
    void createMenteesWithExistingId() throws Exception {
        // Create the Mentees with an existing ID
        mentees.setId(1L);

        int databaseSizeBeforeCreate = menteesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMenteesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentees)))
            .andExpect(status().isBadRequest());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMentees() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        // Get all the menteesList
        restMenteesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mentees.getId().intValue())));
    }

    @Test
    @Transactional
    void getMentees() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        // Get the mentees
        restMenteesMockMvc
            .perform(get(ENTITY_API_URL_ID, mentees.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mentees.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMentees() throws Exception {
        // Get the mentees
        restMenteesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMentees() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();

        // Update the mentees
        Mentees updatedMentees = menteesRepository.findById(mentees.getId()).get();
        // Disconnect from session so that the updates on updatedMentees are not directly saved in db
        em.detach(updatedMentees);

        restMenteesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMentees.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMentees))
            )
            .andExpect(status().isOk());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
        Mentees testMentees = menteesList.get(menteesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mentees.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mentees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mentees)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMenteesWithPatch() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();

        // Update the mentees using partial update
        Mentees partialUpdatedMentees = new Mentees();
        partialUpdatedMentees.setId(mentees.getId());

        restMenteesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentees))
            )
            .andExpect(status().isOk());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
        Mentees testMentees = menteesList.get(menteesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateMenteesWithPatch() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();

        // Update the mentees using partial update
        Mentees partialUpdatedMentees = new Mentees();
        partialUpdatedMentees.setId(mentees.getId());

        restMenteesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMentees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMentees))
            )
            .andExpect(status().isOk());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
        Mentees testMentees = menteesList.get(menteesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mentees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mentees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMentees() throws Exception {
        int databaseSizeBeforeUpdate = menteesRepository.findAll().size();
        mentees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMenteesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mentees)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mentees in the database
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMentees() throws Exception {
        // Initialize the database
        menteesRepository.saveAndFlush(mentees);

        int databaseSizeBeforeDelete = menteesRepository.findAll().size();

        // Delete the mentees
        restMenteesMockMvc
            .perform(delete(ENTITY_API_URL_ID, mentees.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mentees> menteesList = menteesRepository.findAll();
        assertThat(menteesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
