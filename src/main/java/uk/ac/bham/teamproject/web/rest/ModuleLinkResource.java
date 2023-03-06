package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.ModuleLink;
import uk.ac.bham.teamproject.repository.ModuleLinkRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.ModuleLink}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ModuleLinkResource {

    private final Logger log = LoggerFactory.getLogger(ModuleLinkResource.class);

    private static final String ENTITY_NAME = "moduleLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModuleLinkRepository moduleLinkRepository;

    public ModuleLinkResource(ModuleLinkRepository moduleLinkRepository) {
        this.moduleLinkRepository = moduleLinkRepository;
    }

    /**
     * {@code POST  /module-links} : Create a new moduleLink.
     *
     * @param moduleLink the moduleLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moduleLink, or with status {@code 400 (Bad Request)} if the moduleLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/module-links")
    public ResponseEntity<ModuleLink> createModuleLink(@RequestBody ModuleLink moduleLink) throws URISyntaxException {
        log.debug("REST request to save ModuleLink : {}", moduleLink);
        if (moduleLink.getId() != null) {
            throw new BadRequestAlertException("A new moduleLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ModuleLink result = moduleLinkRepository.save(moduleLink);
        return ResponseEntity
            .created(new URI("/api/module-links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /module-links/:id} : Updates an existing moduleLink.
     *
     * @param id the id of the moduleLink to save.
     * @param moduleLink the moduleLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moduleLink,
     * or with status {@code 400 (Bad Request)} if the moduleLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moduleLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/module-links/{id}")
    public ResponseEntity<ModuleLink> updateModuleLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModuleLink moduleLink
    ) throws URISyntaxException {
        log.debug("REST request to update ModuleLink : {}, {}", id, moduleLink);
        if (moduleLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moduleLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moduleLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ModuleLink result = moduleLinkRepository.save(moduleLink);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, moduleLink.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /module-links/:id} : Partial updates given fields of an existing moduleLink, field will ignore if it is null
     *
     * @param id the id of the moduleLink to save.
     * @param moduleLink the moduleLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moduleLink,
     * or with status {@code 400 (Bad Request)} if the moduleLink is not valid,
     * or with status {@code 404 (Not Found)} if the moduleLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the moduleLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/module-links/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ModuleLink> partialUpdateModuleLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModuleLink moduleLink
    ) throws URISyntaxException {
        log.debug("REST request to partial update ModuleLink partially : {}, {}", id, moduleLink);
        if (moduleLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moduleLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moduleLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ModuleLink> result = moduleLinkRepository
            .findById(moduleLink.getId())
            .map(existingModuleLink -> {
                return existingModuleLink;
            })
            .map(moduleLinkRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, moduleLink.getId().toString())
        );
    }

    /**
     * {@code GET  /module-links} : get all the moduleLinks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moduleLinks in body.
     */
    @GetMapping("/module-links")
    public List<ModuleLink> getAllModuleLinks() {
        log.debug("REST request to get all ModuleLinks");
        return moduleLinkRepository.findAll();
    }

    /**
     * {@code GET  /module-links/:id} : get the "id" moduleLink.
     *
     * @param id the id of the moduleLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moduleLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/module-links/{id}")
    public ResponseEntity<ModuleLink> getModuleLink(@PathVariable Long id) {
        log.debug("REST request to get ModuleLink : {}", id);
        Optional<ModuleLink> moduleLink = moduleLinkRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moduleLink);
    }

    /**
     * {@code DELETE  /module-links/:id} : delete the "id" moduleLink.
     *
     * @param id the id of the moduleLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/module-links/{id}")
    public ResponseEntity<Void> deleteModuleLink(@PathVariable Long id) {
        log.debug("REST request to delete ModuleLink : {}", id);
        moduleLinkRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
