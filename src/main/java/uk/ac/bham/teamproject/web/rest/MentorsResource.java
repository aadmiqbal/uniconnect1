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
import uk.ac.bham.teamproject.domain.Mentors;
import uk.ac.bham.teamproject.repository.MentorsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Mentors}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MentorsResource {

    private final Logger log = LoggerFactory.getLogger(MentorsResource.class);

    private static final String ENTITY_NAME = "mentors";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MentorsRepository mentorsRepository;

    public MentorsResource(MentorsRepository mentorsRepository) {
        this.mentorsRepository = mentorsRepository;
    }

    /**
     * {@code POST  /mentors} : Create a new mentors.
     *
     * @param mentors the mentors to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mentors, or with status {@code 400 (Bad Request)} if the mentors has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mentors")
    public ResponseEntity<Mentors> createMentors(@RequestBody Mentors mentors) throws URISyntaxException {
        log.debug("REST request to save Mentors : {}", mentors);
        if (mentors.getId() != null) {
            throw new BadRequestAlertException("A new mentors cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mentors result = mentorsRepository.save(mentors);
        return ResponseEntity
            .created(new URI("/api/mentors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mentors/:id} : Updates an existing mentors.
     *
     * @param id the id of the mentors to save.
     * @param mentors the mentors to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentors,
     * or with status {@code 400 (Bad Request)} if the mentors is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mentors couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mentors/{id}")
    public ResponseEntity<Mentors> updateMentors(@PathVariable(value = "id", required = false) final Long id, @RequestBody Mentors mentors)
        throws URISyntaxException {
        log.debug("REST request to update Mentors : {}, {}", id, mentors);
        if (mentors.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentors.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mentorsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mentors result = mentorsRepository.save(mentors);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentors.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mentors/:id} : Partial updates given fields of an existing mentors, field will ignore if it is null
     *
     * @param id the id of the mentors to save.
     * @param mentors the mentors to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentors,
     * or with status {@code 400 (Bad Request)} if the mentors is not valid,
     * or with status {@code 404 (Not Found)} if the mentors is not found,
     * or with status {@code 500 (Internal Server Error)} if the mentors couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mentors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mentors> partialUpdateMentors(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Mentors mentors
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mentors partially : {}, {}", id, mentors);
        if (mentors.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentors.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mentorsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mentors> result = mentorsRepository
            .findById(mentors.getId())
            .map(existingMentors -> {
                return existingMentors;
            })
            .map(mentorsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentors.getId().toString())
        );
    }

    /**
     * {@code GET  /mentors} : get all the mentors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mentors in body.
     */
    @GetMapping("/mentors")
    public List<Mentors> getAllMentors() {
        log.debug("REST request to get all Mentors");
        return mentorsRepository.findAll();
    }

    /**
     * {@code GET  /mentors/:id} : get the "id" mentors.
     *
     * @param id the id of the mentors to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mentors, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mentors/{id}")
    public ResponseEntity<Mentors> getMentors(@PathVariable Long id) {
        log.debug("REST request to get Mentors : {}", id);
        Optional<Mentors> mentors = mentorsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mentors);
    }

    /**
     * {@code DELETE  /mentors/:id} : delete the "id" mentors.
     *
     * @param id the id of the mentors to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mentors/{id}")
    public ResponseEntity<Void> deleteMentors(@PathVariable Long id) {
        log.debug("REST request to delete Mentors : {}", id);
        mentorsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
