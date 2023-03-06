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
import uk.ac.bham.teamproject.domain.UserGroupUsers;
import uk.ac.bham.teamproject.repository.UserGroupUsersRepository;

/**
 * Integration tests for the {@link UserGroupUsersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserGroupUsersResourceIT {

    private static final String ENTITY_API_URL = "/api/user-group-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserGroupUsersRepository userGroupUsersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserGroupUsersMockMvc;

    private UserGroupUsers userGroupUsers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupUsers createEntity(EntityManager em) {
        UserGroupUsers userGroupUsers = new UserGroupUsers();
        return userGroupUsers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserGroupUsers createUpdatedEntity(EntityManager em) {
        UserGroupUsers userGroupUsers = new UserGroupUsers();
        return userGroupUsers;
    }

    @BeforeEach
    public void initTest() {
        userGroupUsers = createEntity(em);
    }

    @Test
    @Transactional
    void createUserGroupUsers() throws Exception {
        int databaseSizeBeforeCreate = userGroupUsersRepository.findAll().size();
        // Create the UserGroupUsers
        restUserGroupUsersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isCreated());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeCreate + 1);
        UserGroupUsers testUserGroupUsers = userGroupUsersList.get(userGroupUsersList.size() - 1);
    }

    @Test
    @Transactional
    void createUserGroupUsersWithExistingId() throws Exception {
        // Create the UserGroupUsers with an existing ID
        userGroupUsers.setId(1L);

        int databaseSizeBeforeCreate = userGroupUsersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserGroupUsersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserGroupUsers() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        // Get all the userGroupUsersList
        restUserGroupUsersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userGroupUsers.getId().intValue())));
    }

    @Test
    @Transactional
    void getUserGroupUsers() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        // Get the userGroupUsers
        restUserGroupUsersMockMvc
            .perform(get(ENTITY_API_URL_ID, userGroupUsers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userGroupUsers.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingUserGroupUsers() throws Exception {
        // Get the userGroupUsers
        restUserGroupUsersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserGroupUsers() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();

        // Update the userGroupUsers
        UserGroupUsers updatedUserGroupUsers = userGroupUsersRepository.findById(userGroupUsers.getId()).get();
        // Disconnect from session so that the updates on updatedUserGroupUsers are not directly saved in db
        em.detach(updatedUserGroupUsers);

        restUserGroupUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserGroupUsers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserGroupUsers))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
        UserGroupUsers testUserGroupUsers = userGroupUsersList.get(userGroupUsersList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userGroupUsers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userGroupUsers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserGroupUsersWithPatch() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();

        // Update the userGroupUsers using partial update
        UserGroupUsers partialUpdatedUserGroupUsers = new UserGroupUsers();
        partialUpdatedUserGroupUsers.setId(userGroupUsers.getId());

        restUserGroupUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupUsers))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
        UserGroupUsers testUserGroupUsers = userGroupUsersList.get(userGroupUsersList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateUserGroupUsersWithPatch() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();

        // Update the userGroupUsers using partial update
        UserGroupUsers partialUpdatedUserGroupUsers = new UserGroupUsers();
        partialUpdatedUserGroupUsers.setId(userGroupUsers.getId());

        restUserGroupUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserGroupUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserGroupUsers))
            )
            .andExpect(status().isOk());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
        UserGroupUsers testUserGroupUsers = userGroupUsersList.get(userGroupUsersList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userGroupUsers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserGroupUsers() throws Exception {
        int databaseSizeBeforeUpdate = userGroupUsersRepository.findAll().size();
        userGroupUsers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserGroupUsersMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userGroupUsers))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserGroupUsers in the database
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserGroupUsers() throws Exception {
        // Initialize the database
        userGroupUsersRepository.saveAndFlush(userGroupUsers);

        int databaseSizeBeforeDelete = userGroupUsersRepository.findAll().size();

        // Delete the userGroupUsers
        restUserGroupUsersMockMvc
            .perform(delete(ENTITY_API_URL_ID, userGroupUsers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserGroupUsers> userGroupUsersList = userGroupUsersRepository.findAll();
        assertThat(userGroupUsersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
