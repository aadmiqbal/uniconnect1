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
import uk.ac.bham.teamproject.domain.ModuleLink;
import uk.ac.bham.teamproject.repository.ModuleLinkRepository;

/**
 * Integration tests for the {@link ModuleLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModuleLinkResourceIT {

    private static final String ENTITY_API_URL = "/api/module-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ModuleLinkRepository moduleLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModuleLinkMockMvc;

    private ModuleLink moduleLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModuleLink createEntity(EntityManager em) {
        ModuleLink moduleLink = new ModuleLink();
        return moduleLink;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModuleLink createUpdatedEntity(EntityManager em) {
        ModuleLink moduleLink = new ModuleLink();
        return moduleLink;
    }

    @BeforeEach
    public void initTest() {
        moduleLink = createEntity(em);
    }

    @Test
    @Transactional
    void createModuleLink() throws Exception {
        int databaseSizeBeforeCreate = moduleLinkRepository.findAll().size();
        // Create the ModuleLink
        restModuleLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moduleLink)))
            .andExpect(status().isCreated());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeCreate + 1);
        ModuleLink testModuleLink = moduleLinkList.get(moduleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void createModuleLinkWithExistingId() throws Exception {
        // Create the ModuleLink with an existing ID
        moduleLink.setId(1L);

        int databaseSizeBeforeCreate = moduleLinkRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModuleLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moduleLink)))
            .andExpect(status().isBadRequest());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllModuleLinks() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        // Get all the moduleLinkList
        restModuleLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moduleLink.getId().intValue())));
    }

    @Test
    @Transactional
    void getModuleLink() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        // Get the moduleLink
        restModuleLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, moduleLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moduleLink.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingModuleLink() throws Exception {
        // Get the moduleLink
        restModuleLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModuleLink() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();

        // Update the moduleLink
        ModuleLink updatedModuleLink = moduleLinkRepository.findById(moduleLink.getId()).get();
        // Disconnect from session so that the updates on updatedModuleLink are not directly saved in db
        em.detach(updatedModuleLink);

        restModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedModuleLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
        ModuleLink testModuleLink = moduleLinkList.get(moduleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, moduleLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moduleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moduleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moduleLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModuleLinkWithPatch() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();

        // Update the moduleLink using partial update
        ModuleLink partialUpdatedModuleLink = new ModuleLink();
        partialUpdatedModuleLink.setId(moduleLink.getId());

        restModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModuleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
        ModuleLink testModuleLink = moduleLinkList.get(moduleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateModuleLinkWithPatch() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();

        // Update the moduleLink using partial update
        ModuleLink partialUpdatedModuleLink = new ModuleLink();
        partialUpdatedModuleLink.setId(moduleLink.getId());

        restModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModuleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModuleLink))
            )
            .andExpect(status().isOk());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
        ModuleLink testModuleLink = moduleLinkList.get(moduleLinkList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, moduleLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moduleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moduleLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModuleLink() throws Exception {
        int databaseSizeBeforeUpdate = moduleLinkRepository.findAll().size();
        moduleLink.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleLinkMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(moduleLink))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModuleLink in the database
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModuleLink() throws Exception {
        // Initialize the database
        moduleLinkRepository.saveAndFlush(moduleLink);

        int databaseSizeBeforeDelete = moduleLinkRepository.findAll().size();

        // Delete the moduleLink
        restModuleLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, moduleLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ModuleLink> moduleLinkList = moduleLinkRepository.findAll();
        assertThat(moduleLinkList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
