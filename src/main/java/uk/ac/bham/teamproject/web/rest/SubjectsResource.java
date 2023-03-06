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
import uk.ac.bham.teamproject.domain.Subjects;
import uk.ac.bham.teamproject.repository.SubjectsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Subjects}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SubjectsResource {

    private final Logger log = LoggerFactory.getLogger(SubjectsResource.class);

    private static final String ENTITY_NAME = "subjects";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubjectsRepository subjectsRepository;

    public SubjectsResource(SubjectsRepository subjectsRepository) {
        this.subjectsRepository = subjectsRepository;
    }

    /**
     * {@code POST  /subjects} : Create a new subjects.
     *
     * @param subjects the subjects to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subjects, or with status {@code 400 (Bad Request)} if the subjects has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/subjects")
    public ResponseEntity<Subjects> createSubjects(@Valid @RequestBody Subjects subjects) throws URISyntaxException {
        log.debug("REST request to save Subjects : {}", subjects);
        if (subjects.getId() != null) {
            throw new BadRequestAlertException("A new subjects cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Subjects result = subjectsRepository.save(subjects);
        return ResponseEntity
            .created(new URI("/api/subjects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /subjects/:id} : Updates an existing subjects.
     *
     * @param id the id of the subjects to save.
     * @param subjects the subjects to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjects,
     * or with status {@code 400 (Bad Request)} if the subjects is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subjects couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/subjects/{id}")
    public ResponseEntity<Subjects> updateSubjects(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Subjects subjects
    ) throws URISyntaxException {
        log.debug("REST request to update Subjects : {}, {}", id, subjects);
        if (subjects.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjects.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Subjects result = subjectsRepository.save(subjects);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subjects.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /subjects/:id} : Partial updates given fields of an existing subjects, field will ignore if it is null
     *
     * @param id the id of the subjects to save.
     * @param subjects the subjects to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjects,
     * or with status {@code 400 (Bad Request)} if the subjects is not valid,
     * or with status {@code 404 (Not Found)} if the subjects is not found,
     * or with status {@code 500 (Internal Server Error)} if the subjects couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/subjects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Subjects> partialUpdateSubjects(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Subjects subjects
    ) throws URISyntaxException {
        log.debug("REST request to partial update Subjects partially : {}, {}", id, subjects);
        if (subjects.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjects.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Subjects> result = subjectsRepository
            .findById(subjects.getId())
            .map(existingSubjects -> {
                if (subjects.getSubjectName() != null) {
                    existingSubjects.setSubjectName(subjects.getSubjectName());
                }

                return existingSubjects;
            })
            .map(subjectsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subjects.getId().toString())
        );
    }

    /**
     * {@code GET  /subjects} : get all the subjects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subjects in body.
     */
    @GetMapping("/subjects")
    public List<Subjects> getAllSubjects() {
        log.debug("REST request to get all Subjects");
        return subjectsRepository.findAll();
    }

    /**
     * {@code GET  /subjects/:id} : get the "id" subjects.
     *
     * @param id the id of the subjects to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subjects, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/subjects/{id}")
    public ResponseEntity<Subjects> getSubjects(@PathVariable Long id) {
        log.debug("REST request to get Subjects : {}", id);
        Optional<Subjects> subjects = subjectsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(subjects);
    }

    /**
     * {@code DELETE  /subjects/:id} : delete the "id" subjects.
     *
     * @param id the id of the subjects to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> deleteSubjects(@PathVariable Long id) {
        log.debug("REST request to delete Subjects : {}", id);
        subjectsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
