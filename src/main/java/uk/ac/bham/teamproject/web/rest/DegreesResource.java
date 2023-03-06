package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Degrees;
import uk.ac.bham.teamproject.repository.DegreesRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Degrees}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DegreesResource {

    private final Logger log = LoggerFactory.getLogger(DegreesResource.class);

    private static final String ENTITY_NAME = "degrees";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DegreesRepository degreesRepository;

    public DegreesResource(DegreesRepository degreesRepository) {
        this.degreesRepository = degreesRepository;
    }

    /**
     * {@code POST  /degrees} : Create a new degrees.
     *
     * @param degrees the degrees to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new degrees, or with status {@code 400 (Bad Request)} if the degrees has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/degrees")
    public ResponseEntity<Degrees> createDegrees(@Valid @RequestBody Degrees degrees) throws URISyntaxException {
        log.debug("REST request to save Degrees : {}", degrees);
        if (degrees.getId() != null) {
            throw new BadRequestAlertException("A new degrees cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Degrees result = degreesRepository.save(degrees);
        return ResponseEntity
            .created(new URI("/api/degrees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /degrees/:id} : Updates an existing degrees.
     *
     * @param id the id of the degrees to save.
     * @param degrees the degrees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated degrees,
     * or with status {@code 400 (Bad Request)} if the degrees is not valid,
     * or with status {@code 500 (Internal Server Error)} if the degrees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/degrees/{id}")
    public ResponseEntity<Degrees> updateDegrees(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Degrees degrees
    ) throws URISyntaxException {
        log.debug("REST request to update Degrees : {}, {}", id, degrees);
        if (degrees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, degrees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!degreesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Degrees result = degreesRepository.save(degrees);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, degrees.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /degrees/:id} : Partial updates given fields of an existing degrees, field will ignore if it is null
     *
     * @param id the id of the degrees to save.
     * @param degrees the degrees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated degrees,
     * or with status {@code 400 (Bad Request)} if the degrees is not valid,
     * or with status {@code 404 (Not Found)} if the degrees is not found,
     * or with status {@code 500 (Internal Server Error)} if the degrees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/degrees/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Degrees> partialUpdateDegrees(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Degrees degrees
    ) throws URISyntaxException {
        log.debug("REST request to partial update Degrees partially : {}, {}", id, degrees);
        if (degrees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, degrees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!degreesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Degrees> result = degreesRepository
            .findById(degrees.getId())
            .map(existingDegrees -> {
                if (degrees.getDegreeName() != null) {
                    existingDegrees.setDegreeName(degrees.getDegreeName());
                }

                return existingDegrees;
            })
            .map(degreesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, degrees.getId().toString())
        );
    }

    /**
     * {@code GET  /degrees} : get all the degrees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of degrees in body.
     */
    @GetMapping("/degrees")
    public List<Degrees> getAllDegrees() {
        log.debug("REST request to get all Degrees");
        return degreesRepository.findAll();
    }

    /**
     * {@code GET  /degrees/:id} : get the "id" degrees.
     *
     * @param id the id of the degrees to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the degrees, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/degrees/{id}")
    public ResponseEntity<Degrees> getDegrees(@PathVariable Long id) {
        log.debug("REST request to get Degrees : {}", id);
        Optional<Degrees> degrees = degreesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(degrees);
    }

    /**
     * {@code DELETE  /degrees/:id} : delete the "id" degrees.
     *
     * @param id the id of the degrees to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/degrees/{id}")
    public ResponseEntity<Void> deleteDegrees(@PathVariable Long id) {
        log.debug("REST request to delete Degrees : {}", id);
        degreesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
