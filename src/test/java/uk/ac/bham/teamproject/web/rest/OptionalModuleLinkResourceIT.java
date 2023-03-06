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
import uk.ac.bham.teamproject.domain.OptionalModuleLink;
import uk.ac.bham.teamproject.repository.OptionalModuleLinkRepository;

/**
 * Integration tests for the {@link OptionalModuleLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OptionalModuleLinkResourceIT {

    private static final String ENTITY_API_URL = "/api/optional-module-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OptionalModuleLinkRepository optionalModuleLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOptionalModuleLinkMockMvc;

    private OptionalModuleLink optionalModuleLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OptionalModuleLink createEntity(EntityManager em) {
        OptionalModuleLink optionalModuleLink = new OptionalModuleLink();
        return optionalModuleLink;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OptionalModuleLink createUpdatedEntity(EntityManager em) {
        OptionalModuleLink optionalModuleLink = new OptionalModuleLink();
        return optionalModuleLink;
    }

    @BeforeEach
    public void initTest() {
        optionalModuleLink = createEntity(em);
    }

    @Test
    @Transactional
    void createOptionalModuleLink() throws Exception {
        int databaseSizeBeforeCreate = optionalModuleLinkRepository.findAll().size();
        // Create the OptionalModuleLink
        restOptionalModuleLinkMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isCreated());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeCreate + 1);
        OptionalModuleLink testOptionalModuleLink = optionalModuleLinkList.get(optionalModuleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void createOptionalModuleLinkWithExistingId() throws Exception {
        // Create the OptionalModuleLink with an existing ID
        optionalModuleLink.setId(1L);

        int databaseSizeBeforeCreate = optionalModuleLinkRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOptionalModuleLinkMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOptionalModuleLinks() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        // Get all the optionalModuleLinkList
        restOptionalModuleLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(optionalModuleLink.getId().intValue())));
    }

    @Test
    @Transactional
    void getOptionalModuleLink() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        // Get the optionalModuleLink
        restOptionalModuleLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, optionalModuleLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(optionalModuleLink.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingOptionalModuleLink() throws Exception {
        // Get the optionalModuleLink
        restOptionalModuleLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOptionalModuleLink() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();

        // Update the optionalModuleLink
        OptionalModuleLink updatedOptionalModuleLink = optionalModuleLinkRepository.findById(optionalModuleLink.getId()).get();
        // Disconnect from session so that the updates on updatedOptionalModuleLink are not directly saved in db
        em.detach(updatedOptionalModuleLink);

        restOptionalModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOptionalModuleLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOptionalModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
        OptionalModuleLink testOptionalModuleLink = optionalModuleLinkList.get(optionalModuleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, optionalModuleLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOptionalModuleLinkWithPatch() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();

        // Update the optionalModuleLink using partial update
        OptionalModuleLink partialUpdatedOptionalModuleLink = new OptionalModuleLink();
        partialUpdatedOptionalModuleLink.setId(optionalModuleLink.getId());

        restOptionalModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOptionalModuleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOptionalModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
        OptionalModuleLink testOptionalModuleLink = optionalModuleLinkList.get(optionalModuleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateOptionalModuleLinkWithPatch() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();

        // Update the optionalModuleLink using partial update
        OptionalModuleLink partialUpdatedOptionalModuleLink = new OptionalModuleLink();
        partialUpdatedOptionalModuleLink.setId(optionalModuleLink.getId());

        restOptionalModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOptionalModuleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOptionalModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
        OptionalModuleLink testOptionalModuleLink = optionalModuleLinkList.get(optionalModuleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, optionalModuleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOptionalModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = optionalModuleLinkRepository.findAll().size();
        optionalModuleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOptionalModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(optionalModuleLink))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OptionalModuleLink in the database
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOptionalModuleLink() throws Exception {
        // Initialize the database
        optionalModuleLinkRepository.saveAndFlush(optionalModuleLink);

        int databaseSizeBeforeDelete = optionalModuleLinkRepository.findAll().size();

        // Delete the optionalModuleLink
        restOptionalModuleLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, optionalModuleLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OptionalModuleLink> optionalModuleLinkList = optionalModuleLinkRepository.findAll();
        assertThat(optionalModuleLinkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
