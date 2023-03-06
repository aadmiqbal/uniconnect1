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
import uk.ac.bham.teamproject.domain.UserModules;
import uk.ac.bham.teamproject.repository.UserModulesRepository;

/**
 * Integration tests for the {@link UserModulesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserModulesResourceIT {

    private static final String DEFAULT_MODULE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MODULE_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_OPTIONAL = false;
    private static final Boolean UPDATED_OPTIONAL = true;

    private static final Integer DEFAULT_STUDY_YEAR = 1;
    private static final Integer UPDATED_STUDY_YEAR = 2;

    private static final String ENTITY_API_URL = "/api/user-modules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserModulesRepository userModulesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserModulesMockMvc;

    private UserModules userModules;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserModules createEntity(EntityManager em) {
        UserModules userModules = new UserModules()
            .moduleName(DEFAULT_MODULE_NAME)
            .optional(DEFAULT_OPTIONAL)
            .studyYear(DEFAULT_STUDY_YEAR);
        return userModules;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserModules createUpdatedEntity(EntityManager em) {
        UserModules userModules = new UserModules()
            .moduleName(UPDATED_MODULE_NAME)
            .optional(UPDATED_OPTIONAL)
            .studyYear(UPDATED_STUDY_YEAR);
        return userModules;
    }

    @BeforeEach
    public void initTest() {
        userModules = createEntity(em);
    }

    @Test
    @Transactional
    void createUserModules() throws Exception {
        int databaseSizeBeforeCreate = userModulesRepository.findAll().size();
        // Create the UserModules
        restUserModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isCreated());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeCreate + 1);
        UserModules testUserModules = userModulesList.get(userModulesList.size() - 1);
        assertThat(testUserModules.getModuleName()).isEqualTo(DEFAULT_MODULE_NAME);
        assertThat(testUserModules.getOptional()).isEqualTo(DEFAULT_OPTIONAL);
        assertThat(testUserModules.getStudyYear()).isEqualTo(DEFAULT_STUDY_YEAR);
    }

    @Test
    @Transactional
    void createUserModulesWithExistingId() throws Exception {
        // Create the UserModules with an existing ID
        userModules.setId(1L);

        int databaseSizeBeforeCreate = userModulesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isBadRequest());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkModuleNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userModulesRepository.findAll().size();
        // set the field null
        userModules.setModuleName(null);

        // Create the UserModules, which fails.

        restUserModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isBadRequest());

        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOptionalIsRequired() throws Exception {
        int databaseSizeBeforeTest = userModulesRepository.findAll().size();
        // set the field null
        userModules.setOptional(null);

        // Create the UserModules, which fails.

        restUserModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isBadRequest());

        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStudyYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = userModulesRepository.findAll().size();
        // set the field null
        userModules.setStudyYear(null);

        // Create the UserModules, which fails.

        restUserModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isBadRequest());

        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserModules() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        // Get all the userModulesList
        restUserModulesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userModules.getId().intValue())))
            .andExpect(jsonPath("$.[*].moduleName").value(hasItem(DEFAULT_MODULE_NAME)))
            .andExpect(jsonPath("$.[*].optional").value(hasItem(DEFAULT_OPTIONAL.booleanValue())))
            .andExpect(jsonPath("$.[*].studyYear").value(hasItem(DEFAULT_STUDY_YEAR)));
    }

    @Test
    @Transactional
    void getUserModules() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        // Get the userModules
        restUserModulesMockMvc
            .perform(get(ENTITY_API_URL_ID, userModules.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userModules.getId().intValue()))
            .andExpect(jsonPath("$.moduleName").value(DEFAULT_MODULE_NAME))
            .andExpect(jsonPath("$.optional").value(DEFAULT_OPTIONAL.booleanValue()))
            .andExpect(jsonPath("$.studyYear").value(DEFAULT_STUDY_YEAR));
    }

    @Test
    @Transactional
    void getNonExistingUserModules() throws Exception {
        // Get the userModules
        restUserModulesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserModules() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();

        // Update the userModules
        UserModules updatedUserModules = userModulesRepository.findById(userModules.getId()).get();
        // Disconnect from session so that the updates on updatedUserModules are not directly saved in db
        em.detach(updatedUserModules);
        updatedUserModules.moduleName(UPDATED_MODULE_NAME).optional(UPDATED_OPTIONAL).studyYear(UPDATED_STUDY_YEAR);

        restUserModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserModules.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserModules))
            )
            .andExpect(status().isOk());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
        UserModules testUserModules = userModulesList.get(userModulesList.size() - 1);
        assertThat(testUserModules.getModuleName()).isEqualTo(UPDATED_MODULE_NAME);
        assertThat(testUserModules.getOptional()).isEqualTo(UPDATED_OPTIONAL);
        assertThat(testUserModules.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void putNonExistingUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userModules.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userModules))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userModules))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userModules)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserModulesWithPatch() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();

        // Update the userModules using partial update
        UserModules partialUpdatedUserModules = new UserModules();
        partialUpdatedUserModules.setId(userModules.getId());

        partialUpdatedUserModules.optional(UPDATED_OPTIONAL).studyYear(UPDATED_STUDY_YEAR);

        restUserModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserModules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserModules))
            )
            .andExpect(status().isOk());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
        UserModules testUserModules = userModulesList.get(userModulesList.size() - 1);
        assertThat(testUserModules.getModuleName()).isEqualTo(DEFAULT_MODULE_NAME);
        assertThat(testUserModules.getOptional()).isEqualTo(UPDATED_OPTIONAL);
        assertThat(testUserModules.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void fullUpdateUserModulesWithPatch() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();

        // Update the userModules using partial update
        UserModules partialUpdatedUserModules = new UserModules();
        partialUpdatedUserModules.setId(userModules.getId());

        partialUpdatedUserModules.moduleName(UPDATED_MODULE_NAME).optional(UPDATED_OPTIONAL).studyYear(UPDATED_STUDY_YEAR);

        restUserModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserModules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserModules))
            )
            .andExpect(status().isOk());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
        UserModules testUserModules = userModulesList.get(userModulesList.size() - 1);
        assertThat(testUserModules.getModuleName()).isEqualTo(UPDATED_MODULE_NAME);
        assertThat(testUserModules.getOptional()).isEqualTo(UPDATED_OPTIONAL);
        assertThat(testUserModules.getStudyYear()).isEqualTo(UPDATED_STUDY_YEAR);
    }

    @Test
    @Transactional
    void patchNonExistingUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userModules.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userModules))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userModules))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserModules() throws Exception {
        int databaseSizeBeforeUpdate = userModulesRepository.findAll().size();
        userModules.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserModulesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userModules))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserModules in the database
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserModules() throws Exception {
        // Initialize the database
        userModulesRepository.saveAndFlush(userModules);

        int databaseSizeBeforeDelete = userModulesRepository.findAll().size();

        // Delete the userModules
        restUserModulesMockMvc
            .perform(delete(ENTITY_API_URL_ID, userModules.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserModules> userModulesList = userModulesRepository.findAll();
        assertThat(userModulesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
