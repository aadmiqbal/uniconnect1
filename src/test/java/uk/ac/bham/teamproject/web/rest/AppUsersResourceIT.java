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
import uk.ac.bham.teamproject.domain.AppUsers;
import uk.ac.bham.teamproject.repository.AppUsersRepository;

/**
 * Integration tests for the {@link AppUsersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppUsersResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_STUDY_YEAR = 5;
    private static final Integer UPDATED_STUDY_YEAR = 4;

    private static final String DEFAULT_BIO = "AAAAAAAAAA";
    private static final String UPDATED_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_PFP = "AAAAAAAAAA";
    private static final String UPDATED_PFP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/app-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppUsersRepository appUsersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppUsersMockMvc;

    private AppUsers appUsers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUsers createEntity(EntityManager em) {
        AppUsers appUsers = new AppUsers().name(DEFAULT_NAME).studyYear(DEFAULT_STUDY_YEAR).bio(DEFAULT_BIO).pfp(DEFAULT_PFP);
        return appUsers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUsers createUpdatedEntity(EntityManager em) {
        AppUsers appUsers = new AppUsers().name(UPDATED_NAME).studyYear(UPDATED_STUDY_YEAR).bio(UPDATED_BIO).pfp(UPDATED_PFP);
        return appUsers;
    }

    @BeforeEach
    public void initTest() {
        appUsers = createEntity(em);
    }

    @Test
    @Transactional
    void createAppUsers() throws Exception {
        int databaseSizeBeforeCreate = appUsersRepository.findAll().size();
        // Create the AppUsers
        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isCreated());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeCreate + 1);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAppUsers.getStudyYear()).isEqualTo(DEFAULT_STUDY_YEAR);
        assertThat(testAppUsers.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testAppUsers.getPfp()).isEqualTo(DEFAULT_PFP);
    }

    @Test
    @Transactional
    void createAppUsersWithExistingId() throws Exception {
        // Create the AppUsers with an existing ID
        appUsers.setId(1L);

        int databaseSizeBeforeCreate = appUsersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setName(null);

        // Create the AppUsers, which fails.

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStudyYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUsersRepository.findAll().size();
        // set the field null
        appUsers.setStudyYear(null);

        // Create the AppUsers, which fails.

        restAppUsersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isBadRequest());

        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        // Get all the appUsersList
        restAppUsersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appUsers.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].studyYear").value(hasItem(DEFAULT_STUDY_YEAR)))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].pfp").value(hasItem(DEFAULT_PFP)));
    }

    @Test
    @Transactional
    void getAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        // Get the appUsers
        restAppUsersMockMvc
            .perform(get(ENTITY_API_URL_ID, appUsers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appUsers.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.studyYear").value(DEFAULT_STUDY_YEAR))
            .andExpect(jsonPath("$.bio").value(DEFAULT_BIO))
            .andExpect(jsonPath("$.pfp").value(DEFAULT_PFP));
    }

    @Test
    @Transactional
    void getNonExistingAppUsers() throws Exception {
        // Get the appUsers
        restAppUsersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers
        AppUsers updatedAppUsers = appUsersRepository.findById(appUsers.getId()).get();
        // Disconnect from session so that the updates on updatedAppUsers are not directly saved in db
        em.detach(updatedAppUsers);
        updatedAppUsers.name(UPDATED_NAME).studyYear(UPDATED_STUDY_YEAR).bio(UPDATED_BIO).pfp(UPDATED_PFP);

        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAppUsers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAppUsers))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAppUsers.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
        assertThat(testAppUsers.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testAppUsers.getPfp()).isEqualTo(UPDATED_PFP);
    }

    @Test
    @Transactional
    void putNonExistingAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appUsers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppUsersWithPatch() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers using partial update
        AppUsers partialUpdatedAppUsers = new AppUsers();
        partialUpdatedAppUsers.setId(appUsers.getId());

        partialUpdatedAppUsers.name(UPDATED_NAME).studyYear(UPDATED_STUDY_YEAR).bio(UPDATED_BIO);

        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUsers))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAppUsers.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
        assertThat(testAppUsers.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testAppUsers.getPfp()).isEqualTo(DEFAULT_PFP);
    }

    @Test
    @Transactional
    void fullUpdateAppUsersWithPatch() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();

        // Update the appUsers using partial update
        AppUsers partialUpdatedAppUsers = new AppUsers();
        partialUpdatedAppUsers.setId(appUsers.getId());

        partialUpdatedAppUsers.name(UPDATED_NAME).studyYear(UPDATED_STUDY_YEAR).bio(UPDATED_BIO).pfp(UPDATED_PFP);

        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUsers))
            )
            .andExpect(status().isOk());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
        AppUsers testAppUsers = appUsersList.get(appUsersList.size() - 1);
        assertThat(testAppUsers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAppUsers.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
        assertThat(testAppUsers.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testAppUsers.getPfp()).isEqualTo(UPDATED_PFP);
    }

    @Test
    @Transactional
    void patchNonExistingAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppUsers() throws Exception {
        int databaseSizeBeforeUpdate = appUsersRepository.findAll().size();
        appUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUsersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(appUsers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUsers in the database
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppUsers() throws Exception {
        // Initialize the database
        appUsersRepository.saveAndFlush(appUsers);

        int databaseSizeBeforeDelete = appUsersRepository.findAll().size();

        // Delete the appUsers
        restAppUsersMockMvc
            .perform(delete(ENTITY_API_URL_ID, appUsers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppUsers> appUsersList = appUsersRepository.findAll();
        assertThat(appUsersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
