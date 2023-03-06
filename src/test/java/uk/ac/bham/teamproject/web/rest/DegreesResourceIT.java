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
import uk.ac.bham.teamproject.domain.Degrees;
import uk.ac.bham.teamproject.repository.DegreesRepository;

/**
 * Integration tests for the {@link DegreesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DegreesResourceIT {

    private static final String DEFAULT_DEGREE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_DEGREE_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/degrees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DegreesRepository degreesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDegreesMockMvc;

    private Degrees degrees;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Degrees createEntity(EntityManager em) {
        Degrees degrees = new Degrees().degreeName(DEFAULT_DEGREE_NAME);
        return degrees;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Degrees createUpdatedEntity(EntityManager em) {
        Degrees degrees = new Degrees().degreeName(UPDATED_DEGREE_NAME);
        return degrees;
    }

    @BeforeEach
    public void initTest() {
        degrees = createEntity(em);
    }

    @Test
    @Transactional
    void createDegrees() throws Exception {
        int databaseSizeBeforeCreate = degreesRepository.findAll().size();
        // Create the Degrees
        restDegreesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degrees)))
            .andExpect(status().isCreated());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeCreate + 1);
        Degrees testDegrees = degreesList.get(degreesList.size() - 1);
        assertThat(testDegrees.getDegreeName()).isEqualTo(DEFAULT_DEGREE_NAME);
    }

    @Test
    @Transactional
    void createDegreesWithExistingId() throws Exception {
        // Create the Degrees with an existing ID
        degrees.setId(1L);

        int databaseSizeBeforeCreate = degreesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDegreesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degrees)))
            .andExpect(status().isBadRequest());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDegreeNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = degreesRepository.findAll().size();
        // set the field null
        degrees.setDegreeName(null);

        // Create the Degrees, which fails.

        restDegreesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degrees)))
            .andExpect(status().isBadRequest());

        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDegrees() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        // Get all the degreesList
        restDegreesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(degrees.getId().intValue())))
            .andExpect(jsonPath("$.[*].degreeName").value(hasItem(DEFAULT_DEGREE_NAME)));
    }

    @Test
    @Transactional
    void getDegrees() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        // Get the degrees
        restDegreesMockMvc
            .perform(get(ENTITY_API_URL_ID, degrees.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(degrees.getId().intValue()))
            .andExpect(jsonPath("$.degreeName").value(DEFAULT_DEGREE_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDegrees() throws Exception {
        // Get the degrees
        restDegreesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDegrees() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();

        // Update the degrees
        Degrees updatedDegrees = degreesRepository.findById(degrees.getId()).get();
        // Disconnect from session so that the updates on updatedDegrees are not directly saved in db
        em.detach(updatedDegrees);
        updatedDegrees.degreeName(UPDATED_DEGREE_NAME);

        restDegreesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDegrees.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDegrees))
            )
            .andExpect(status().isOk());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
        Degrees testDegrees = degreesList.get(degreesList.size() - 1);
        assertThat(testDegrees.getDegreeName()).isEqualTo(UPDATED_DEGREE_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, degrees.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(degrees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(degrees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(degrees)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDegreesWithPatch() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();

        // Update the degrees using partial update
        Degrees partialUpdatedDegrees = new Degrees();
        partialUpdatedDegrees.setId(degrees.getId());

        partialUpdatedDegrees.degreeName(UPDATED_DEGREE_NAME);

        restDegreesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDegrees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDegrees))
            )
            .andExpect(status().isOk());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
        Degrees testDegrees = degreesList.get(degreesList.size() - 1);
        assertThat(testDegrees.getDegreeName()).isEqualTo(UPDATED_DEGREE_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDegreesWithPatch() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();

        // Update the degrees using partial update
        Degrees partialUpdatedDegrees = new Degrees();
        partialUpdatedDegrees.setId(degrees.getId());

        partialUpdatedDegrees.degreeName(UPDATED_DEGREE_NAME);

        restDegreesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDegrees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDegrees))
            )
            .andExpect(status().isOk());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
        Degrees testDegrees = degreesList.get(degreesList.size() - 1);
        assertThat(testDegrees.getDegreeName()).isEqualTo(UPDATED_DEGREE_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, degrees.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(degrees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(degrees))
            )
            .andExpect(status().isBadRequest());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDegrees() throws Exception {
        int databaseSizeBeforeUpdate = degreesRepository.findAll().size();
        degrees.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDegreesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(degrees)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Degrees in the database
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDegrees() throws Exception {
        // Initialize the database
        degreesRepository.saveAndFlush(degrees);

        int databaseSizeBeforeDelete = degreesRepository.findAll().size();

        // Delete the degrees
        restDegreesMockMvc
            .perform(delete(ENTITY_API_URL_ID, degrees.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Degrees> degreesList = degreesRepository.findAll();
        assertThat(degreesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
