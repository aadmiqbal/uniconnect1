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
import uk.ac.bham.teamproject.domain.UserGroups;
import uk.ac.bham.teamproject.repository.UserGroupsRepository;

/**
 * Integration tests for the {@link UserGroupsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserGroupsResourceIT {

    private static final String DEFAULT_GROUP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GROUP_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserGroupsMockMvc;

    private UserGroups userGroups;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroups createEntity(EntityManager em) {
        UserGroups userGroups = new UserGroups().groupName(DEFAULT_GROUP_NAME);
        return userGroups;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroups createUpdatedEntity(EntityManager em) {
        UserGroups userGroups = new UserGroups().groupName(UPDATED_GROUP_NAME);
        return userGroups;
    }

    @BeforeEach
    public void initTest() {
        userGroups = createEntity(em);
    }

    @Test
    @Transactional
    void createUserGroups() throws Exception {
        int databaseSizeBeforeCreate = userGroupsRepository.findAll().size();
        // Create the UserGroups
        restUserGroupsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroups)))
            .andExpect(status().isCreated());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeCreate + 1);
        UserGroups testUserGroups = userGroupsList.get(userGroupsList.size() - 1);
        assertThat(testUserGroups.getGroupName()).isEqualTo(DEFAULT_GROUP_NAME);
    }

    @Test
    @Transactional
    void createUserGroupsWithExistingId() throws Exception {
        // Create the UserGroups with an existing ID
        userGroups.setId(1L);

        int databaseSizeBeforeCreate = userGroupsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserGroupsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroups)))
            .andExpect(status().isBadRequest());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkGroupNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userGroupsRepository.findAll().size();
        // set the field null
        userGroups.setGroupName(null);

        // Create the UserGroups, which fails.

        restUserGroupsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroups)))
            .andExpect(status().isBadRequest());

        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserGroups() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        // Get all the userGroupsList
        restUserGroupsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userGroups.getId().intValue())))
            .andExpect(jsonPath("$.[*].groupName").value(hasItem(DEFAULT_GROUP_NAME)));
    }

    @Test
    @Transactional
    void getUserGroups() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        // Get the userGroups
        restUserGroupsMockMvc
            .perform(get(ENTITY_API_URL_ID, userGroups.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userGroups.getId().intValue()))
            .andExpect(jsonPath("$.groupName").value(DEFAULT_GROUP_NAME));
    }

    @Test
    @Transactional
    void getNonExistingUserGroups() throws Exception {
        // Get the userGroups
        restUserGroupsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserGroups() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();

        // Update the userGroups
        UserGroups updatedUserGroups = userGroupsRepository.findById(userGroups.getId()).get();
        // Disconnect from session so that the updates on updatedUserGroups are not directly saved in db
        em.detach(updatedUserGroups);
        updatedUserGroups.groupName(UPDATED_GROUP_NAME);

        restUserGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserGroups.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserGroups))
            )
            .andExpect(status().isOk());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
        UserGroups testUserGroups = userGroupsList.get(userGroupsList.size() - 1);
        assertThat(testUserGroups.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
    }

    @Test
    @Transactional
    void putNonExistingUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userGroups.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroups)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserGroupsWithPatch() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();

        // Update the userGroups using partial update
        UserGroups partialUpdatedUserGroups = new UserGroups();
        partialUpdatedUserGroups.setId(userGroups.getId());

        partialUpdatedUserGroups.groupName(UPDATED_GROUP_NAME);

        restUserGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroups.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroups))
            )
            .andExpect(status().isOk());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
        UserGroups testUserGroups = userGroupsList.get(userGroupsList.size() - 1);
        assertThat(testUserGroups.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
    }

    @Test
    @Transactional
    void fullUpdateUserGroupsWithPatch() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();

        // Update the userGroups using partial update
        UserGroups partialUpdatedUserGroups = new UserGroups();
        partialUpdatedUserGroups.setId(userGroups.getId());

        partialUpdatedUserGroups.groupName(UPDATED_GROUP_NAME);

        restUserGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroups.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroups))
            )
            .andExpect(status().isOk());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
        UserGroups testUserGroups = userGroupsList.get(userGroupsList.size() - 1);
        assertThat(testUserGroups.getGroupName()).isEqualTo(UPDATED_GROUP_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userGroups.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserGroups() throws Exception {
        int databaseSizeBeforeUpdate = userGroupsRepository.findAll().size();
        userGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userGroups))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroups in the database
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserGroups() throws Exception {
        // Initialize the database
        userGroupsRepository.saveAndFlush(userGroups);

        int databaseSizeBeforeDelete = userGroupsRepository.findAll().size();

        // Delete the userGroups
        restUserGroupsMockMvc
            .perform(delete(ENTITY_API_URL_ID, userGroups.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserGroups> userGroupsList = userGroupsRepository.findAll();
        assertThat(userGroupsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
