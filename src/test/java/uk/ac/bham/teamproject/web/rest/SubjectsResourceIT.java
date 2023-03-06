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
import uk.ac.bham.teamproject.domain.Subjects;
import uk.ac.bham.teamproject.repository.SubjectsRepository;

/**
 * Integration tests for the {@link SubjectsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SubjectsResourceIT {

    private static final String DEFAULT_SUBJECT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/subjects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SubjectsRepository subjectsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubjectsMockMvc;

    private Subjects subjects;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Subjects createEntity(EntityManager em) {
        Subjects subjects = new Subjects().subjectName(DEFAULT_SUBJECT_NAME);
        return subjects;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Subjects createUpdatedEntity(EntityManager em) {
        Subjects subjects = new Subjects().subjectName(UPDATED_SUBJECT_NAME);
        return subjects;
    }

    @BeforeEach
    public void initTest() {
        subjects = createEntity(em);
    }

    @Test
    @Transactional
    void createSubjects() throws Exception {
        int databaseSizeBeforeCreate = subjectsRepository.findAll().size();
        // Create the Subjects
        restSubjectsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjects)))
            .andExpect(status().isCreated());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeCreate + 1);
        Subjects testSubjects = subjectsList.get(subjectsList.size() - 1);
        assertThat(testSubjects.getSubjectName()).isEqualTo(DEFAULT_SUBJECT_NAME);
    }

    @Test
    @Transactional
    void createSubjectsWithExistingId() throws Exception {
        // Create the Subjects with an existing ID
        subjects.setId(1L);

        int databaseSizeBeforeCreate = subjectsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubjectsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjects)))
            .andExpect(status().isBadRequest());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSubjectNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = subjectsRepository.findAll().size();
        // set the field null
        subjects.setSubjectName(null);

        // Create the Subjects, which fails.

        restSubjectsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjects)))
            .andExpect(status().isBadRequest());

        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSubjects() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        // Get all the subjectsList
        restSubjectsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subjects.getId().intValue())))
            .andExpect(jsonPath("$.[*].subjectName").value(hasItem(DEFAULT_SUBJECT_NAME)));
    }

    @Test
    @Transactional
    void getSubjects() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        // Get the subjects
        restSubjectsMockMvc
            .perform(get(ENTITY_API_URL_ID, subjects.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subjects.getId().intValue()))
            .andExpect(jsonPath("$.subjectName").value(DEFAULT_SUBJECT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingSubjects() throws Exception {
        // Get the subjects
        restSubjectsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSubjects() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();

        // Update the subjects
        Subjects updatedSubjects = subjectsRepository.findById(subjects.getId()).get();
        // Disconnect from session so that the updates on updatedSubjects are not directly saved in db
        em.detach(updatedSubjects);
        updatedSubjects.subjectName(UPDATED_SUBJECT_NAME);

        restSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubjects.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSubjects))
            )
            .andExpect(status().isOk());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
        Subjects testSubjects = subjectsList.get(subjectsList.size() - 1);
        assertThat(testSubjects.getSubjectName()).isEqualTo(UPDATED_SUBJECT_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subjects.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjects)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubjectsWithPatch() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();

        // Update the subjects using partial update
        Subjects partialUpdatedSubjects = new Subjects();
        partialUpdatedSubjects.setId(subjects.getId());

        partialUpdatedSubjects.subjectName(UPDATED_SUBJECT_NAME);

        restSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubjects))
            )
            .andExpect(status().isOk());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
        Subjects testSubjects = subjectsList.get(subjectsList.size() - 1);
        assertThat(testSubjects.getSubjectName()).isEqualTo(UPDATED_SUBJECT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSubjectsWithPatch() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();

        // Update the subjects using partial update
        Subjects partialUpdatedSubjects = new Subjects();
        partialUpdatedSubjects.setId(subjects.getId());

        partialUpdatedSubjects.subjectName(UPDATED_SUBJECT_NAME);

        restSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubjects))
            )
            .andExpect(status().isOk());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
        Subjects testSubjects = subjectsList.get(subjectsList.size() - 1);
        assertThat(testSubjects.getSubjectName()).isEqualTo(UPDATED_SUBJECT_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subjects.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subjects))
            )
            .andExpect(status().isBadRequest());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubjects() throws Exception {
        int databaseSizeBeforeUpdate = subjectsRepository.findAll().size();
        subjects.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(subjects)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Subjects in the database
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubjects() throws Exception {
        // Initialize the database
        subjectsRepository.saveAndFlush(subjects);

        int databaseSizeBeforeDelete = subjectsRepository.findAll().size();

        // Delete the subjects
        restSubjectsMockMvc
            .perform(delete(ENTITY_API_URL_ID, subjects.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Subjects> subjectsList = subjectsRepository.findAll();
        assertThat(subjectsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
