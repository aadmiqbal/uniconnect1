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
import uk.ac.bham.teamproject.domain.OptionalModuleLink;
import uk.ac.bham.teamproject.repository.OptionalModuleLinkRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.OptionalModuleLink}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OptionalModuleLinkResource {

    private final Logger log = LoggerFactory.getLogger(OptionalModuleLinkResource.class);

    private static final String ENTITY_NAME = "optionalModuleLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OptionalModuleLinkRepository optionalModuleLinkRepository;

    public OptionalModuleLinkResource(OptionalModuleLinkRepository optionalModuleLinkRepository) {
        this.optionalModuleLinkRepository = optionalModuleLinkRepository;
    }

    /**
     * {@code POST  /optional-module-links} : Create a new optionalModuleLink.
     *
     * @param optionalModuleLink the optionalModuleLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new optionalModuleLink, or with status {@code 400 (Bad Request)} if the optionalModuleLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/optional-module-links")
    public ResponseEntity<OptionalModuleLink> createOptionalModuleLink(@RequestBody OptionalModuleLink optionalModuleLink)
        throws URISyntaxException {
        log.debug("REST request to save OptionalModuleLink : {}", optionalModuleLink);
        if (optionalModuleLink.getId() != null) {
            throw new BadRequestAlertException("A new optionalModuleLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OptionalModuleLink result = optionalModuleLinkRepository.save(optionalModuleLink);
        return ResponseEntity
            .created(new URI("/api/optional-module-links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /optional-module-links/:id} : Updates an existing optionalModuleLink.
     *
     * @param id the id of the optionalModuleLink to save.
     * @param optionalModuleLink the optionalModuleLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated optionalModuleLink,
     * or with status {@code 400 (Bad Request)} if the optionalModuleLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the optionalModuleLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/optional-module-links/{id}")
    public ResponseEntity<OptionalModuleLink> updateOptionalModuleLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OptionalModuleLink optionalModuleLink
    ) throws URISyntaxException {
        log.debug("REST request to update OptionalModuleLink : {}, {}", id, optionalModuleLink);
        if (optionalModuleLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, optionalModuleLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!optionalModuleLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OptionalModuleLink result = optionalModuleLinkRepository.save(optionalModuleLink);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, optionalModuleLink.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /optional-module-links/:id} : Partial updates given fields of an existing optionalModuleLink, field will ignore if it is null
     *
     * @param id the id of the optionalModuleLink to save.
     * @param optionalModuleLink the optionalModuleLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated optionalModuleLink,
     * or with status {@code 400 (Bad Request)} if the optionalModuleLink is not valid,
     * or with status {@code 404 (Not Found)} if the optionalModuleLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the optionalModuleLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/optional-module-links/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OptionalModuleLink> partialUpdateOptionalModuleLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OptionalModuleLink optionalModuleLink
    ) throws URISyntaxException {
        log.debug("REST request to partial update OptionalModuleLink partially : {}, {}", id, optionalModuleLink);
        if (optionalModuleLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, optionalModuleLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!optionalModuleLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OptionalModuleLink> result = optionalModuleLinkRepository
            .findById(optionalModuleLink.getId())
            .map(existingOptionalModuleLink -> {
                return existingOptionalModuleLink;
            })
            .map(optionalModuleLinkRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, optionalModuleLink.getId().toString())
        );
    }

    /**
     * {@code GET  /optional-module-links} : get all the optionalModuleLinks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of optionalModuleLinks in body.
     */
    @GetMapping("/optional-module-links")
    public List<OptionalModuleLink> getAllOptionalModuleLinks() {
        log.debug("REST request to get all OptionalModuleLinks");
        return optionalModuleLinkRepository.findAll();
    }

    /**
     * {@code GET  /optional-module-links/:id} : get the "id" optionalModuleLink.
     *
     * @param id the id of the optionalModuleLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the optionalModuleLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/optional-module-links/{id}")
    public ResponseEntity<OptionalModuleLink> getOptionalModuleLink(@PathVariable Long id) {
        log.debug("REST request to get OptionalModuleLink : {}", id);
        Optional<OptionalModuleLink> optionalModuleLink = optionalModuleLinkRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(optionalModuleLink);
    }

    /**
     * {@code DELETE  /optional-module-links/:id} : delete the "id" optionalModuleLink.
     *
     * @param id the id of the optionalModuleLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/optional-module-links/{id}")
    public ResponseEntity<Void> deleteOptionalModuleLink(@PathVariable Long id) {
        log.debug("REST request to delete OptionalModuleLink : {}", id);
        optionalModuleLinkRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
