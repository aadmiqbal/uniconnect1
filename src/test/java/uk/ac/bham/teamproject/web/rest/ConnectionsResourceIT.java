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
import uk.ac.bham.teamproject.domain.Connections;
import uk.ac.bham.teamproject.repository.ConnectionsRepository;

/**
 * Integration tests for the {@link ConnectionsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConnectionsResourceIT {

    private static final String ENTITY_API_URL = "/api/connections";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConnectionsRepository connectionsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConnectionsMockMvc;

    private Connections connections;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Connections createEntity(EntityManager em) {
        Connections connections = new Connections();
        return connections;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Connections createUpdatedEntity(EntityManager em) {
        Connections connections = new Connections();
        return connections;
    }

    @BeforeEach
    public void initTest() {
        connections = createEntity(em);
    }

    @Test
    @Transactional
    void createConnections() throws Exception {
        int databaseSizeBeforeCreate = connectionsRepository.findAll().size();
        // Create the Connections
        restConnectionsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connections)))
            .andExpect(status().isCreated());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeCreate + 1);
        Connections testConnections = connectionsList.get(connectionsList.size() - 1);
    }

    @Test
    @Transactional
    void createConnectionsWithExistingId() throws Exception {
        // Create the Connections with an existing ID
        connections.setId(1L);

        int databaseSizeBeforeCreate = connectionsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConnectionsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connections)))
            .andExpect(status().isBadRequest());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConnections() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        // Get all the connectionsList
        restConnectionsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(connections.getId().intValue())));
    }

    @Test
    @Transactional
    void getConnections() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        // Get the connections
        restConnectionsMockMvc
            .perform(get(ENTITY_API_URL_ID, connections.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(connections.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingConnections() throws Exception {
        // Get the connections
        restConnectionsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConnections() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();

        // Update the connections
        Connections updatedConnections = connectionsRepository.findById(connections.getId()).get();
        // Disconnect from session so that the updates on updatedConnections are not directly saved in db
        em.detach(updatedConnections);

        restConnectionsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConnections.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConnections))
            )
            .andExpect(status().isOk());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
        Connections testConnections = connectionsList.get(connectionsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, connections.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(connections))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(connections))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connections)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConnectionsWithPatch() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();

        // Update the connections using partial update
        Connections partialUpdatedConnections = new Connections();
        partialUpdatedConnections.setId(connections.getId());

        restConnectionsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConnections.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConnections))
            )
            .andExpect(status().isOk());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
        Connections testConnections = connectionsList.get(connectionsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateConnectionsWithPatch() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();

        // Update the connections using partial update
        Connections partialUpdatedConnections = new Connections();
        partialUpdatedConnections.setId(connections.getId());

        restConnectionsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConnections.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConnections))
            )
            .andExpect(status().isOk());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
        Connections testConnections = connectionsList.get(connectionsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, connections.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(connections))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(connections))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConnections() throws Exception {
        int databaseSizeBeforeUpdate = connectionsRepository.findAll().size();
        connections.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnectionsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(connections))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Connections in the database
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConnections() throws Exception {
        // Initialize the database
        connectionsRepository.saveAndFlush(connections);

        int databaseSizeBeforeDelete = connectionsRepository.findAll().size();

        // Delete the connections
        restConnectionsMockMvc
            .perform(delete(ENTITY_API_URL_ID, connections.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Connections> connectionsList = connectionsRepository.findAll();
        assertThat(connectionsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
