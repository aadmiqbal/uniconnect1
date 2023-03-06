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
import uk.ac.bham.teamproject.domain.MentorLink;
import uk.ac.bham.teamproject.repository.MentorLinkRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.MentorLink}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MentorLinkResource {

    private final Logger log = LoggerFactory.getLogger(MentorLinkResource.class);

    private static final String ENTITY_NAME = "mentorLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MentorLinkRepository mentorLinkRepository;

    public MentorLinkResource(MentorLinkRepository mentorLinkRepository) {
        this.mentorLinkRepository = mentorLinkRepository;
    }

    /**
     * {@code POST  /mentor-links} : Create a new mentorLink.
     *
     * @param mentorLink the mentorLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mentorLink, or with status {@code 400 (Bad Request)} if the mentorLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mentor-links")
    public ResponseEntity<MentorLink> createMentorLink(@RequestBody MentorLink mentorLink) throws URISyntaxException {
        log.debug("REST request to save MentorLink : {}", mentorLink);
        if (mentorLink.getId() != null) {
            throw new BadRequestAlertException("A new mentorLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MentorLink result = mentorLinkRepository.save(mentorLink);
        return ResponseEntity
            .created(new URI("/api/mentor-links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mentor-links/:id} : Updates an existing mentorLink.
     *
     * @param id the id of the mentorLink to save.
     * @param mentorLink the mentorLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentorLink,
     * or with status {@code 400 (Bad Request)} if the mentorLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mentorLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mentor-links/{id}")
    public ResponseEntity<MentorLink> updateMentorLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MentorLink mentorLink
    ) throws URISyntaxException {
        log.debug("REST request to update MentorLink : {}, {}", id, mentorLink);
        if (mentorLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentorLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mentorLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MentorLink result = mentorLinkRepository.save(mentorLink);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentorLink.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mentor-links/:id} : Partial updates given fields of an existing mentorLink, field will ignore if it is null
     *
     * @param id the id of the mentorLink to save.
     * @param mentorLink the mentorLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mentorLink,
     * or with status {@code 400 (Bad Request)} if the mentorLink is not valid,
     * or with status {@code 404 (Not Found)} if the mentorLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the mentorLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mentor-links/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MentorLink> partialUpdateMentorLink(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MentorLink mentorLink
    ) throws URISyntaxException {
        log.debug("REST request to partial update MentorLink partially : {}, {}", id, mentorLink);
        if (mentorLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mentorLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mentorLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MentorLink> result = mentorLinkRepository
            .findById(mentorLink.getId())
            .map(existingMentorLink -> {
                return existingMentorLink;
            })
            .map(mentorLinkRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mentorLink.getId().toString())
        );
    }

    /**
     * {@code GET  /mentor-links} : get all the mentorLinks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mentorLinks in body.
     */
    @GetMapping("/mentor-links")
    public List<MentorLink> getAllMentorLinks() {
        log.debug("REST request to get all MentorLinks");
        return mentorLinkRepository.findAll();
    }

    /**
     * {@code GET  /mentor-links/:id} : get the "id" mentorLink.
     *
     * @param id the id of the mentorLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mentorLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mentor-links/{id}")
    public ResponseEntity<MentorLink> getMentorLink(@PathVariable Long id) {
        log.debug("REST request to get MentorLink : {}", id);
        Optional<MentorLink> mentorLink = mentorLinkRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mentorLink);
    }

    /**
     * {@code DELETE  /mentor-links/:id} : delete the "id" mentorLink.
     *
     * @param id the id of the mentorLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mentor-links/{id}")
    public ResponseEntity<Void> deleteMentorLink(@PathVariable Long id) {
        log.debug("REST request to delete MentorLink : {}", id);
        mentorLinkRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
