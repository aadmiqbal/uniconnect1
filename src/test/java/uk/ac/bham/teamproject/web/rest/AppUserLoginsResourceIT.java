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
import uk.ac.bham.teamproject.domain.AppUserLogins;
import uk.ac.bham.teamproject.repository.AppUserLoginsRepository;

/**
 * Integration tests for the {@link AppUserLoginsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppUserLoginsResourceIT {

    private static final String DEFAULT_USER_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_USER_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD_SALT = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD_SALT = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD_HASH = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD_HASH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/app-user-logins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppUserLoginsRepository appUserLoginsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppUserLoginsMockMvc;

    private AppUserLogins appUserLogins;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUserLogins createEntity(EntityManager em) {
        AppUserLogins appUserLogins = new AppUserLogins()
            .userEmail(DEFAULT_USER_EMAIL)
            .passwordSalt(DEFAULT_PASSWORD_SALT)
            .passwordHash(DEFAULT_PASSWORD_HASH);
        return appUserLogins;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUserLogins createUpdatedEntity(EntityManager em) {
        AppUserLogins appUserLogins = new AppUserLogins()
            .userEmail(UPDATED_USER_EMAIL)
            .passwordSalt(UPDATED_PASSWORD_SALT)
            .passwordHash(UPDATED_PASSWORD_HASH);
        return appUserLogins;
    }

    @BeforeEach
    public void initTest() {
        appUserLogins = createEntity(em);
    }

    @Test
    @Transactional
    void createAppUserLogins() throws Exception {
        int databaseSizeBeforeCreate = appUserLoginsRepository.findAll().size();
        // Create the AppUserLogins
        restAppUserLoginsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isCreated());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeCreate + 1);
        AppUserLogins testAppUserLogins = appUserLoginsList.get(appUserLoginsList.size() - 1);
        assertThat(testAppUserLogins.getUserEmail()).isEqualTo(DEFAULT_USER_EMAIL);
        assertThat(testAppUserLogins.getPasswordSalt()).isEqualTo(DEFAULT_PASSWORD_SALT);
        assertThat(testAppUserLogins.getPasswordHash()).isEqualTo(DEFAULT_PASSWORD_HASH);
    }

    @Test
    @Transactional
    void createAppUserLoginsWithExistingId() throws Exception {
        // Create the AppUserLogins with an existing ID
        appUserLogins.setId(1L);

        int databaseSizeBeforeCreate = appUserLoginsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppUserLoginsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isBadRequest());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUserLoginsRepository.findAll().size();
        // set the field null
        appUserLogins.setUserEmail(null);

        // Create the AppUserLogins, which fails.

        restAppUserLoginsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isBadRequest());

        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasswordSaltIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUserLoginsRepository.findAll().size();
        // set the field null
        appUserLogins.setPasswordSalt(null);

        // Create the AppUserLogins, which fails.

        restAppUserLoginsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isBadRequest());

        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasswordHashIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUserLoginsRepository.findAll().size();
        // set the field null
        appUserLogins.setPasswordHash(null);

        // Create the AppUserLogins, which fails.

        restAppUserLoginsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isBadRequest());

        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAppUserLogins() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        // Get all the appUserLoginsList
        restAppUserLoginsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appUserLogins.getId().intValue())))
            .andExpect(jsonPath("$.[*].userEmail").value(hasItem(DEFAULT_USER_EMAIL)))
            .andExpect(jsonPath("$.[*].passwordSalt").value(hasItem(DEFAULT_PASSWORD_SALT)))
            .andExpect(jsonPath("$.[*].passwordHash").value(hasItem(DEFAULT_PASSWORD_HASH)));
    }

    @Test
    @Transactional
    void getAppUserLogins() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        // Get the appUserLogins
        restAppUserLoginsMockMvc
            .perform(get(ENTITY_API_URL_ID, appUserLogins.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appUserLogins.getId().intValue()))
            .andExpect(jsonPath("$.userEmail").value(DEFAULT_USER_EMAIL))
            .andExpect(jsonPath("$.passwordSalt").value(DEFAULT_PASSWORD_SALT))
            .andExpect(jsonPath("$.passwordHash").value(DEFAULT_PASSWORD_HASH));
    }

    @Test
    @Transactional
    void getNonExistingAppUserLogins() throws Exception {
        // Get the appUserLogins
        restAppUserLoginsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAppUserLogins() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();

        // Update the appUserLogins
        AppUserLogins updatedAppUserLogins = appUserLoginsRepository.findById(appUserLogins.getId()).get();
        // Disconnect from session so that the updates on updatedAppUserLogins are not directly saved in db
        em.detach(updatedAppUserLogins);
        updatedAppUserLogins.userEmail(UPDATED_USER_EMAIL).passwordSalt(UPDATED_PASSWORD_SALT).passwordHash(UPDATED_PASSWORD_HASH);

        restAppUserLoginsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAppUserLogins.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAppUserLogins))
            )
            .andExpect(status().isOk());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
        AppUserLogins testAppUserLogins = appUserLoginsList.get(appUserLoginsList.size() - 1);
        assertThat(testAppUserLogins.getUserEmail()).isEqualTo(UPDATED_USER_EMAIL);
        assertThat(testAppUserLogins.getPasswordSalt()).isEqualTo(UPDATED_PASSWORD_SALT);
        assertThat(testAppUserLogins.getPasswordHash()).isEqualTo(UPDATED_PASSWORD_HASH);
    }

    @Test
    @Transactional
    void putNonExistingAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appUserLogins.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUserLogins))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appUserLogins))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appUserLogins)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppUserLoginsWithPatch() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();

        // Update the appUserLogins using partial update
        AppUserLogins partialUpdatedAppUserLogins = new AppUserLogins();
        partialUpdatedAppUserLogins.setId(appUserLogins.getId());

        partialUpdatedAppUserLogins.passwordSalt(UPDATED_PASSWORD_SALT).passwordHash(UPDATED_PASSWORD_HASH);

        restAppUserLoginsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUserLogins.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUserLogins))
            )
            .andExpect(status().isOk());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
        AppUserLogins testAppUserLogins = appUserLoginsList.get(appUserLoginsList.size() - 1);
        assertThat(testAppUserLogins.getUserEmail()).isEqualTo(DEFAULT_USER_EMAIL);
        assertThat(testAppUserLogins.getPasswordSalt()).isEqualTo(UPDATED_PASSWORD_SALT);
        assertThat(testAppUserLogins.getPasswordHash()).isEqualTo(UPDATED_PASSWORD_HASH);
    }

    @Test
    @Transactional
    void fullUpdateAppUserLoginsWithPatch() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();

        // Update the appUserLogins using partial update
        AppUserLogins partialUpdatedAppUserLogins = new AppUserLogins();
        partialUpdatedAppUserLogins.setId(appUserLogins.getId());

        partialUpdatedAppUserLogins.userEmail(UPDATED_USER_EMAIL).passwordSalt(UPDATED_PASSWORD_SALT).passwordHash(UPDATED_PASSWORD_HASH);

        restAppUserLoginsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppUserLogins.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppUserLogins))
            )
            .andExpect(status().isOk());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
        AppUserLogins testAppUserLogins = appUserLoginsList.get(appUserLoginsList.size() - 1);
        assertThat(testAppUserLogins.getUserEmail()).isEqualTo(UPDATED_USER_EMAIL);
        assertThat(testAppUserLogins.getPasswordSalt()).isEqualTo(UPDATED_PASSWORD_SALT);
        assertThat(testAppUserLogins.getPasswordHash()).isEqualTo(UPDATED_PASSWORD_HASH);
    }

    @Test
    @Transactional
    void patchNonExistingAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appUserLogins.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUserLogins))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appUserLogins))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppUserLogins() throws Exception {
        int databaseSizeBeforeUpdate = appUserLoginsRepository.findAll().size();
        appUserLogins.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppUserLoginsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(appUserLogins))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppUserLogins in the database
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppUserLogins() throws Exception {
        // Initialize the database
        appUserLoginsRepository.saveAndFlush(appUserLogins);

        int databaseSizeBeforeDelete = appUserLoginsRepository.findAll().size();

        // Delete the appUserLogins
        restAppUserLoginsMockMvc
            .perform(delete(ENTITY_API_URL_ID, appUserLogins.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppUserLogins> appUserLoginsList = appUserLoginsRepository.findAll();
        assertThat(appUserLoginsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
