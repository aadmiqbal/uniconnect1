package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Connections;
import uk.ac.bham.teamproject.repository.ConnectionsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Connections}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConnectionsResource {

    private final Logger log = LoggerFactory.getLogger(ConnectionsResource.class);

    private static final String ENTITY_NAME = "connections";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConnectionsRepository connectionsRepository;

    public ConnectionsResource(ConnectionsRepository connectionsRepository) {
        this.connectionsRepository = connectionsRepository;
    }

    /**
     * {@code POST  /connections} : Create a new connections.
     *
     * @param connections the connections to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new connections, or with status {@code 400 (Bad Request)} if the connections has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/connections")
    public ResponseEntity<Connections> createConnections(@RequestBody Connections connections) throws URISyntaxException {
        log.debug("REST request to save Connections : {}", connections);
        if (connections.getId() != null) {
            throw new BadRequestAlertException("A new connections cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Connections result = connectionsRepository.save(connections);
        return ResponseEntity
            .created(new URI("/api/connections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /connections/:id} : Updates an existing connections.
     *
     * @param id the id of the connections to save.
     * @param connections the connections to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated connections,
     * or with status {@code 400 (Bad Request)} if the connections is not valid,
     * or with status {@code 500 (Internal Server Error)} if the connections couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/connections/{id}")
    public ResponseEntity<Connections> updateConnections(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Connections connections
    ) throws URISyntaxException {
        log.debug("REST request to update Connections : {}, {}", id, connections);
        if (connections.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, connections.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!connectionsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Connections result = connectionsRepository.save(connections);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, connections.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /connections/:id} : Partial updates given fields of an existing connections, field will ignore if it is null
     *
     * @param id the id of the connections to save.
     * @param connections the connections to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated connections,
     * or with status {@code 400 (Bad Request)} if the connections is not valid,
     * or with status {@code 404 (Not Found)} if the connections is not found,
     * or with status {@code 500 (Internal Server Error)} if the connections couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/connections/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Connections> partialUpdateConnections(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Connections connections
    ) throws URISyntaxException {
        log.debug("REST request to partial update Connections partially : {}, {}", id, connections);
        if (connections.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, connections.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!connectionsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Connections> result = connectionsRepository
            .findById(connections.getId())
            .map(existingConnections -> {
                return existingConnections;
            })
            .map(connectionsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, connections.getId().toString())
        );
    }

    /**
     * {@code GET  /connections} : get all the connections.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of connections in body.
     */
    @GetMapping("/connections")
    public ResponseEntity<List<Connections>> getAllConnections(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Connections");
        Page<Connections> page = connectionsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /connections/:id} : get the "id" connections.
     *
     * @param id the id of the connections to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the connections, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/connections/{id}")
    public ResponseEntity<Connections> getConnections(@PathVariable Long id) {
        log.debug("REST request to get Connections : {}", id);
        Optional<Connections> connections = connectionsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(connections);
    }

    /**
     * {@code DELETE  /connections/:id} : delete the "id" connections.
     *
     * @param id the id of the connections to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/connections/{id}")
    public ResponseEntity<Void> deleteConnections(@PathVariable Long id) {
        log.debug("REST request to delete Connections : {}", id);
        connectionsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
