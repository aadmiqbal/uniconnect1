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
import uk.ac.bham.teamproject.domain.DegreeSubjects;
import uk.ac.bham.teamproject.repository.DegreeSubjectsRepository;

/**
 * Integration tests for the {@link DegreeSubjectsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DegreeSubjectsResourceIT {

    private static final String ENTITY_API_URL = "/api/degree-subjects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DegreeSubjectsRepository degreeSubjectsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDegreeSubjectsMockMvc;

    private DegreeSubjects degreeSubjects;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DegreeSubjects createEntity(EntityManager em) {
        DegreeSubjects degreeSubjects = new DegreeSubjects();
        return degreeSubjects;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DegreeSubjects createUpdatedEntity(EntityManager em) {
        DegreeSubjects degreeSubjects = new DegreeSubjects();
        return degreeSubjects;
    }

    @BeforeEach
    public void initTest() {
        degreeSubjects = createEntity(em);
    }

    @Test
    @Transactional
    void createDegreeSubjects() throws Exception {
        int databaseSizeBeforeCreate = degreeSubjectsRepository.findAll().size();
        // Create the DegreeSubjects
        restDegreeSubjectsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isCreated());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeCreate + 1);
        DegreeSubjects testDegreeSubjects = degreeSubjectsList.get(degreeSubjectsList.size() - 1);
    }

    @Test
    @Transactional
    void createDegreeSubjectsWithExistingId() throws Exception {
        // Create the DegreeSubjects with an existing ID
        degreeSubjects.setId(1L);

        int databaseSizeBeforeCreate = degreeSubjectsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDegreeSubjectsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDegreeSubjects() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        // Get all the degreeSubjectsList
        restDegreeSubjectsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(degreeSubjects.getId().intValue())));
    }

    @Test
    @Transactional
    void getDegreeSubjects() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        // Get the degreeSubjects
        restDegreeSubjectsMockMvc
            .perform(get(ENTITY_API_URL_ID, degreeSubjects.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(degreeSubjects.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingDegreeSubjects() throws Exception {
        // Get the degreeSubjects
        restDegreeSubjectsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDegreeSubjects() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();

        // Update the degreeSubjects
        DegreeSubjects updatedDegreeSubjects = degreeSubjectsRepository.findById(degreeSubjects.getId()).get();
        // Disconnect from session so that the updates on updatedDegreeSubjects are not directly saved in db
        em.detach(updatedDegreeSubjects);

        restDegreeSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDegreeSubjects.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDegreeSubjects))
            )
            .andExpect(status().isOk());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
        DegreeSubjects testDegreeSubjects = degreeSubjectsList.get(degreeSubjectsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, degreeSubjects.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degreeSubjects)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDegreeSubjectsWithPatch() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();

        // Update the degreeSubjects using partial update
        DegreeSubjects partialUpdatedDegreeSubjects = new DegreeSubjects();
        partialUpdatedDegreeSubjects.setId(degreeSubjects.getId());

        restDegreeSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDegreeSubjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDegreeSubjects))
            )
            .andExpect(status().isOk());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
        DegreeSubjects testDegreeSubjects = degreeSubjectsList.get(degreeSubjectsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateDegreeSubjectsWithPatch() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();

        // Update the degreeSubjects using partial update
        DegreeSubjects partialUpdatedDegreeSubjects = new DegreeSubjects();
        partialUpdatedDegreeSubjects.setId(degreeSubjects.getId());

        restDegreeSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDegreeSubjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDegreeSubjects))
            )
            .andExpect(status().isOk());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
        DegreeSubjects testDegreeSubjects = degreeSubjectsList.get(degreeSubjectsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, degreeSubjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDegreeSubjects() throws Exception {
        int databaseSizeBeforeUpdate = degreeSubjectsRepository.findAll().size();
        degreeSubjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreeSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(degreeSubjects))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DegreeSubjects in the database
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDegreeSubjects() throws Exception {
        // Initialize the database
        degreeSubjectsRepository.saveAndFlush(degreeSubjects);

        int databaseSizeBeforeDelete = degreeSubjectsRepository.findAll().size();

        // Delete the degreeSubjects
        restDegreeSubjectsMockMvc
            .perform(delete(ENTITY_API_URL_ID, degreeSubjects.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DegreeSubjects> degreeSubjectsList = degreeSubjectsRepository.findAll();
        assertThat(degreeSubjectsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
