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
import uk.ac.bham.teamproject.domain.DegreeSubjects;
import uk.ac.bham.teamproject.repository.DegreeSubjectsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.DegreeSubjects}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DegreeSubjectsResource {

    private final Logger log = LoggerFactory.getLogger(DegreeSubjectsResource.class);

    private static final String ENTITY_NAME = "degreeSubjects";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DegreeSubjectsRepository degreeSubjectsRepository;

    public DegreeSubjectsResource(DegreeSubjectsRepository degreeSubjectsRepository) {
        this.degreeSubjectsRepository = degreeSubjectsRepository;
    }

    /**
     * {@code POST  /degree-subjects} : Create a new degreeSubjects.
     *
     * @param degreeSubjects the degreeSubjects to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new degreeSubjects, or with status {@code 400 (Bad Request)} if the degreeSubjects has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/degree-subjects")
    public ResponseEntity<DegreeSubjects> createDegreeSubjects(@RequestBody DegreeSubjects degreeSubjects) throws URISyntaxException {
        log.debug("REST request to save DegreeSubjects : {}", degreeSubjects);
        if (degreeSubjects.getId() != null) {
            throw new BadRequestAlertException("A new degreeSubjects cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DegreeSubjects result = degreeSubjectsRepository.save(degreeSubjects);
        return ResponseEntity
            .created(new URI("/api/degree-subjects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /degree-subjects/:id} : Updates an existing degreeSubjects.
     *
     * @param id the id of the degreeSubjects to save.
     * @param degreeSubjects the degreeSubjects to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated degreeSubjects,
     * or with status {@code 400 (Bad Request)} if the degreeSubjects is not valid,
     * or with status {@code 500 (Internal Server Error)} if the degreeSubjects couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/degree-subjects/{id}")
    public ResponseEntity<DegreeSubjects> updateDegreeSubjects(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DegreeSubjects degreeSubjects
    ) throws URISyntaxException {
        log.debug("REST request to update DegreeSubjects : {}, {}", id, degreeSubjects);
        if (degreeSubjects.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, degreeSubjects.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!degreeSubjectsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DegreeSubjects result = degreeSubjectsRepository.save(degreeSubjects);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, degreeSubjects.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /degree-subjects/:id} : Partial updates given fields of an existing degreeSubjects, field will ignore if it is null
     *
     * @param id the id of the degreeSubjects to save.
     * @param degreeSubjects the degreeSubjects to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated degreeSubjects,
     * or with status {@code 400 (Bad Request)} if the degreeSubjects is not valid,
     * or with status {@code 404 (Not Found)} if the degreeSubjects is not found,
     * or with status {@code 500 (Internal Server Error)} if the degreeSubjects couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/degree-subjects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DegreeSubjects> partialUpdateDegreeSubjects(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DegreeSubjects degreeSubjects
    ) throws URISyntaxException {
        log.debug("REST request to partial update DegreeSubjects partially : {}, {}", id, degreeSubjects);
        if (degreeSubjects.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, degreeSubjects.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!degreeSubjectsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DegreeSubjects> result = degreeSubjectsRepository
            .findById(degreeSubjects.getId())
            .map(existingDegreeSubjects -> {
                return existingDegreeSubjects;
            })
            .map(degreeSubjectsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, degreeSubjects.getId().toString())
        );
    }

    /**
     * {@code GET  /degree-subjects} : get all the degreeSubjects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of degreeSubjects in body.
     */
    @GetMapping("/degree-subjects")
    public List<DegreeSubjects> getAllDegreeSubjects() {
        log.debug("REST request to get all DegreeSubjects");
        return degreeSubjectsRepository.findAll();
    }

    /**
     * {@code GET  /degree-subjects/:id} : get the "id" degreeSubjects.
     *
     * @param id the id of the degreeSubjects to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the degreeSubjects, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/degree-subjects/{id}")
    public ResponseEntity<DegreeSubjects> getDegreeSubjects(@PathVariable Long id) {
        log.debug("REST request to get DegreeSubjects : {}", id);
        Optional<DegreeSubjects> degreeSubjects = degreeSubjectsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(degreeSubjects);
    }

    /**
     * {@code DELETE  /degree-subjects/:id} : delete the "id" degreeSubjects.
     *
     * @param id the id of the degreeSubjects to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/degree-subjects/{id}")
    public ResponseEntity<Void> deleteDegreeSubjects(@PathVariable Long id) {
        log.debug("REST request to delete DegreeSubjects : {}", id);
        degreeSubjectsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
