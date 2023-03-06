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
import uk.ac.bham.teamproject.domain.UserGroupAd;
import uk.ac.bham.teamproject.repository.UserGroupAdRepository;

/**
 * Integration tests for the {@link UserGroupAdResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserGroupAdResourceIT {

    private static final String DEFAULT_GROUP_BIO = "AAAAAAAAAA";
    private static final String UPDATED_GROUP_BIO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-group-ads";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserGroupAdRepository userGroupAdRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserGroupAdMockMvc;

    private UserGroupAd userGroupAd;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupAd createEntity(EntityManager em) {
        UserGroupAd userGroupAd = new UserGroupAd().groupBio(DEFAULT_GROUP_BIO);
        return userGroupAd;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupAd createUpdatedEntity(EntityManager em) {
        UserGroupAd userGroupAd = new UserGroupAd().groupBio(UPDATED_GROUP_BIO);
        return userGroupAd;
    }

    @BeforeEach
    public void initTest() {
        userGroupAd = createEntity(em);
    }

    @Test
    @Transactional
    void createUserGroupAd() throws Exception {
        int databaseSizeBeforeCreate = userGroupAdRepository.findAll().size();
        // Create the UserGroupAd
        restUserGroupAdMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupAd)))
            .andExpect(status().isCreated());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeCreate + 1);
        UserGroupAd testUserGroupAd = userGroupAdList.get(userGroupAdList.size() - 1);
        assertThat(testUserGroupAd.getGroupBio()).isEqualTo(DEFAULT_GROUP_BIO);
    }

    @Test
    @Transactional
    void createUserGroupAdWithExistingId() throws Exception {
        // Create the UserGroupAd with an existing ID
        userGroupAd.setId(1L);

        int databaseSizeBeforeCreate = userGroupAdRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserGroupAdMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupAd)))
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserGroupAds() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        // Get all the userGroupAdList
        restUserGroupAdMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userGroupAd.getId().intValue())))
            .andExpect(jsonPath("$.[*].groupBio").value(hasItem(DEFAULT_GROUP_BIO)));
    }

    @Test
    @Transactional
    void getUserGroupAd() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        // Get the userGroupAd
        restUserGroupAdMockMvc
            .perform(get(ENTITY_API_URL_ID, userGroupAd.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userGroupAd.getId().intValue()))
            .andExpect(jsonPath("$.groupBio").value(DEFAULT_GROUP_BIO));
    }

    @Test
    @Transactional
    void getNonExistingUserGroupAd() throws Exception {
        // Get the userGroupAd
        restUserGroupAdMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserGroupAd() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();

        // Update the userGroupAd
        UserGroupAd updatedUserGroupAd = userGroupAdRepository.findById(userGroupAd.getId()).get();
        // Disconnect from session so that the updates on updatedUserGroupAd are not directly saved in db
        em.detach(updatedUserGroupAd);
        updatedUserGroupAd.groupBio(UPDATED_GROUP_BIO);

        restUserGroupAdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserGroupAd.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserGroupAd))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAd testUserGroupAd = userGroupAdList.get(userGroupAdList.size() - 1);
        assertThat(testUserGroupAd.getGroupBio()).isEqualTo(UPDATED_GROUP_BIO);
    }

    @Test
    @Transactional
    void putNonExistingUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userGroupAd.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAd))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAd))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupAd)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserGroupAdWithPatch() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();

        // Update the userGroupAd using partial update
        UserGroupAd partialUpdatedUserGroupAd = new UserGroupAd();
        partialUpdatedUserGroupAd.setId(userGroupAd.getId());

        restUserGroupAdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupAd.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupAd))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAd testUserGroupAd = userGroupAdList.get(userGroupAdList.size() - 1);
        assertThat(testUserGroupAd.getGroupBio()).isEqualTo(DEFAULT_GROUP_BIO);
    }

    @Test
    @Transactional
    void fullUpdateUserGroupAdWithPatch() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();

        // Update the userGroupAd using partial update
        UserGroupAd partialUpdatedUserGroupAd = new UserGroupAd();
        partialUpdatedUserGroupAd.setId(userGroupAd.getId());

        partialUpdatedUserGroupAd.groupBio(UPDATED_GROUP_BIO);

        restUserGroupAdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupAd.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupAd))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
        UserGroupAd testUserGroupAd = userGroupAdList.get(userGroupAdList.size() - 1);
        assertThat(testUserGroupAd.getGroupBio()).isEqualTo(UPDATED_GROUP_BIO);
    }

    @Test
    @Transactional
    void patchNonExistingUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userGroupAd.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAd))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupAd))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserGroupAd() throws Exception {
        int databaseSizeBeforeUpdate = userGroupAdRepository.findAll().size();
        userGroupAd.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupAdMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userGroupAd))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupAd in the database
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserGroupAd() throws Exception {
        // Initialize the database
        userGroupAdRepository.saveAndFlush(userGroupAd);

        int databaseSizeBeforeDelete = userGroupAdRepository.findAll().size();

        // Delete the userGroupAd
        restUserGroupAdMockMvc
            .perform(delete(ENTITY_API_URL_ID, userGroupAd.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserGroupAd> userGroupAdList = userGroupAdRepository.findAll();
        assertThat(userGroupAdList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
