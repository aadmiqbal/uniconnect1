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
import uk.ac.bham.teamproject.domain.Mentees;
import uk.ac.bham.teamproject.repository.MenteesRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Mentees}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MenteesResource {

    private final Logger log = LoggerFactory.getLogger(MenteesResource.class);

    private static final String ENTITY_NAME = "mentees";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MenteesRepository menteesRepository;

    public MenteesResource(MenteesRepository menteesRepository) {
        this.menteesRepository = menteesRepository;
    }

    /**
     * {@code POST  /mentees} : Create a new mentees.
     *
     * @param mentees the mentees to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mentees, or with status {@code 400 (Bad Request)} if the mentees has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mentees")
    public ResponseEntity<Mentees> createMentees(@RequestBody Mentees mentees) throws URISyntaxException {
        log.debug("REST request to save Mentees : {}", mentees);
        if (mentees.getId() != null) {
            throw new BadRequestAlertException("A new mentees cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mentees result = menteesRepository.save(mentees);
        return ResponseEntity
            .created(new URI("/api/mentees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mentees/:id} : Updates an existing mentees.
     *
     * @param id the id of the mentees to save.
     * @param mentees the mentees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentees,
     * or with status {@code 400 (Bad Request)} if the mentees is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mentees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mentees/{id}")
    public ResponseEntity<Mentees> updateMentees(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mentees mentees)
        throws URISyntaxException {
        log.debug("REST request to update Mentees : {}, {}", id, mentees);
        if (mentees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!menteesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mentees result = menteesRepository.save(mentees);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentees.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mentees/:id} : Partial updates given fields of an existing mentees, field will ignore if it is null
     *
     * @param id the id of the mentees to save.
     * @param mentees the mentees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentees,
     * or with status {@code 400 (Bad Request)} if the mentees is not valid,
     * or with status {@code 404 (Not Found)} if the mentees is not found,
     * or with status {@code 500 (Internal Server Error)} if the mentees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mentees/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mentees> partialUpdateMentees(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mentees mentees
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mentees partially : {}, {}", id, mentees);
        if (mentees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!menteesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mentees> result = menteesRepository
            .findById(mentees.getId())
            .map(existingMentees -> {
                return existingMentees;
            })
            .map(menteesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentees.getId().toString())
        );
    }

    /**
     * {@code GET  /mentees} : get all the mentees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mentees in body.
     */
    @GetMapping("/mentees")
    public List<Mentees> getAllMentees() {
        log.debug("REST request to get all Mentees");
        return menteesRepository.findAll();
    }

    /**
     * {@code GET  /mentees/:id} : get the "id" mentees.
     *
     * @param id the id of the mentees to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mentees, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mentees/{id}")
    public ResponseEntity<Mentees> getMentees(@PathVariable Long id) {
        log.debug("REST request to get Mentees : {}", id);
        Optional<Mentees> mentees = menteesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mentees);
    }

    /**
     * {@code DELETE  /mentees/:id} : delete the "id" mentees.
     *
     * @param id the id of the mentees to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mentees/{id}")
    public ResponseEntity<Void> deleteMentees(@PathVariable Long id) {
        log.debug("REST request to delete Mentees : {}", id);
        menteesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
