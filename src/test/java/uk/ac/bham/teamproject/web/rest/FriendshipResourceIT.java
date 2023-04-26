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
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.Friendship;
import uk.ac.bham.teamproject.repository.FriendshipRepository;
import uk.ac.bham.teamproject.service.criteria.FriendshipCriteria;
import uk.ac.bham.teamproject.service.dto.FriendshipDTO;
import uk.ac.bham.teamproject.service.mapper.FriendshipMapper;

/**
 * Integration tests for the {@link FriendshipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FriendshipResourceIT {

    private static final String ENTITY_API_URL = "/api/friendships";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private FriendshipMapper friendshipMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFriendshipMockMvc;

    private Friendship friendship;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friendship createEntity(EntityManager em) {
        Friendship friendship = new Friendship();
        return friendship;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friendship createUpdatedEntity(EntityManager em) {
        Friendship friendship = new Friendship();
        return friendship;
    }

    @BeforeEach
    public void initTest() {
        friendship = createEntity(em);
    }

    @Test
    @Transactional
    void createFriendship() throws Exception {
        int databaseSizeBeforeCreate = friendshipRepository.findAll().size();
        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);
        restFriendshipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friendshipDTO)))
            .andExpect(status().isCreated());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeCreate + 1);
        Friendship testFriendship = friendshipList.get(friendshipList.size() - 1);
    }

    @Test
    @Transactional
    void createFriendshipWithExistingId() throws Exception {
        // Create the Friendship with an existing ID
        friendship.setId(1L);
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        int databaseSizeBeforeCreate = friendshipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFriendshipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friendshipDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFriendships() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        // Get all the friendshipList
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(friendship.getId().intValue())));
    }

    @Test
    @Transactional
    void getFriendship() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        // Get the friendship
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL_ID, friendship.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(friendship.getId().intValue()));
    }

    @Test
    @Transactional
    void getFriendshipsByIdFiltering() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        Long id = friendship.getId();

        defaultFriendshipShouldBeFound("id.equals=" + id);
        defaultFriendshipShouldNotBeFound("id.notEquals=" + id);

        defaultFriendshipShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultFriendshipShouldNotBeFound("id.greaterThan=" + id);

        defaultFriendshipShouldBeFound("id.lessThanOrEqual=" + id);
        defaultFriendshipShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllFriendshipsByFinalUserIsEqualToSomething() throws Exception {
        FinalUser finalUser;
        if (TestUtil.findAll(em, FinalUser.class).isEmpty()) {
            friendshipRepository.saveAndFlush(friendship);
            finalUser = FinalUserResourceIT.createEntity(em);
        } else {
            finalUser = TestUtil.findAll(em, FinalUser.class).get(0);
        }
        em.persist(finalUser);
        em.flush();
        friendship.setFinalUser(finalUser);
        friendshipRepository.saveAndFlush(friendship);
        Long finalUserId = finalUser.getId();

        // Get all the friendshipList where finalUser equals to finalUserId
        defaultFriendshipShouldBeFound("finalUserId.equals=" + finalUserId);

        // Get all the friendshipList where finalUser equals to (finalUserId + 1)
        defaultFriendshipShouldNotBeFound("finalUserId.equals=" + (finalUserId + 1));
    }

    @Test
    @Transactional
    void getAllFriendshipsByFinalUser2IsEqualToSomething() throws Exception {
        FinalUser finalUser2;
        if (TestUtil.findAll(em, FinalUser.class).isEmpty()) {
            friendshipRepository.saveAndFlush(friendship);
            finalUser2 = FinalUserResourceIT.createEntity(em);
        } else {
            finalUser2 = TestUtil.findAll(em, FinalUser.class).get(0);
        }
        em.persist(finalUser2);
        em.flush();
        friendship.setFinalUser2(finalUser2);
        friendshipRepository.saveAndFlush(friendship);
        Long finalUser2Id = finalUser2.getId();

        // Get all the friendshipList where finalUser2 equals to finalUser2Id
        defaultFriendshipShouldBeFound("finalUser2Id.equals=" + finalUser2Id);

        // Get all the friendshipList where finalUser2 equals to (finalUser2Id + 1)
        defaultFriendshipShouldNotBeFound("finalUser2Id.equals=" + (finalUser2Id + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultFriendshipShouldBeFound(String filter) throws Exception {
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(friendship.getId().intValue())));

        // Check, that the count call also returns 1
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultFriendshipShouldNotBeFound(String filter) throws Exception {
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restFriendshipMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingFriendship() throws Exception {
        // Get the friendship
        restFriendshipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFriendship() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();

        // Update the friendship
        Friendship updatedFriendship = friendshipRepository.findById(friendship.getId()).get();
        // Disconnect from session so that the updates on updatedFriendship are not directly saved in db
        em.detach(updatedFriendship);
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(updatedFriendship);

        restFriendshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, friendshipDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isOk());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
        Friendship testFriendship = friendshipList.get(friendshipList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, friendshipDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friendshipDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFriendshipWithPatch() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();

        // Update the friendship using partial update
        Friendship partialUpdatedFriendship = new Friendship();
        partialUpdatedFriendship.setId(friendship.getId());

        restFriendshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriendship.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriendship))
            )
            .andExpect(status().isOk());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
        Friendship testFriendship = friendshipList.get(friendshipList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateFriendshipWithPatch() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();

        // Update the friendship using partial update
        Friendship partialUpdatedFriendship = new Friendship();
        partialUpdatedFriendship.setId(friendship.getId());

        restFriendshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriendship.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriendship))
            )
            .andExpect(status().isOk());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
        Friendship testFriendship = friendshipList.get(friendshipList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, friendshipDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFriendship() throws Exception {
        int databaseSizeBeforeUpdate = friendshipRepository.findAll().size();
        friendship.setId(count.incrementAndGet());

        // Create the Friendship
        FriendshipDTO friendshipDTO = friendshipMapper.toDto(friendship);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendshipMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(friendshipDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friendship in the database
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFriendship() throws Exception {
        // Initialize the database
        friendshipRepository.saveAndFlush(friendship);

        int databaseSizeBeforeDelete = friendshipRepository.findAll().size();

        // Delete the friendship
        restFriendshipMockMvc
            .perform(delete(ENTITY_API_URL_ID, friendship.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Friendship> friendshipList = friendshipRepository.findAll();
        assertThat(friendshipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
