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
import uk.ac.bham.teamproject.domain.UserGroupAd;
import uk.ac.bham.teamproject.repository.UserGroupAdRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserGroupAd}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserGroupAdResource {

    private final Logger log = LoggerFactory.getLogger(UserGroupAdResource.class);

    private static final String ENTITY_NAME = "userGroupAd";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserGroupAdRepository userGroupAdRepository;

    public UserGroupAdResource(UserGroupAdRepository userGroupAdRepository) {
        this.userGroupAdRepository = userGroupAdRepository;
    }

    /**
     * {@code POST  /user-group-ads} : Create a new userGroupAd.
     *
     * @param userGroupAd the userGroupAd to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userGroupAd, or with status {@code 400 (Bad Request)} if the userGroupAd has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-group-ads")
    public ResponseEntity<UserGroupAd> createUserGroupAd(@RequestBody UserGroupAd userGroupAd) throws URISyntaxException {
        log.debug("REST request to save UserGroupAd : {}", userGroupAd);
        if (userGroupAd.getId() != null) {
            throw new BadRequestAlertException("A new userGroupAd cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserGroupAd result = userGroupAdRepository.save(userGroupAd);
        return ResponseEntity
            .created(new URI("/api/user-group-ads/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-group-ads/:id} : Updates an existing userGroupAd.
     *
     * @param id the id of the userGroupAd to save.
     * @param userGroupAd the userGroupAd to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupAd,
     * or with status {@code 400 (Bad Request)} if the userGroupAd is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userGroupAd couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-group-ads/{id}")
    public ResponseEntity<UserGroupAd> updateUserGroupAd(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGroupAd userGroupAd
    ) throws URISyntaxException {
        log.debug("REST request to update UserGroupAd : {}, {}", id, userGroupAd);
        if (userGroupAd.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupAd.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupAdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserGroupAd result = userGroupAdRepository.save(userGroupAd);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupAd.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-group-ads/:id} : Partial updates given fields of an existing userGroupAd, field will ignore if it is null
     *
     * @param id the id of the userGroupAd to save.
     * @param userGroupAd the userGroupAd to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupAd,
     * or with status {@code 400 (Bad Request)} if the userGroupAd is not valid,
     * or with status {@code 404 (Not Found)} if the userGroupAd is not found,
     * or with status {@code 500 (Internal Server Error)} if the userGroupAd couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-group-ads/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserGroupAd> partialUpdateUserGroupAd(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGroupAd userGroupAd
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserGroupAd partially : {}, {}", id, userGroupAd);
        if (userGroupAd.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupAd.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupAdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserGroupAd> result = userGroupAdRepository
            .findById(userGroupAd.getId())
            .map(existingUserGroupAd -> {
                if (userGroupAd.getGroupBio() != null) {
                    existingUserGroupAd.setGroupBio(userGroupAd.getGroupBio());
                }

                return existingUserGroupAd;
            })
            .map(userGroupAdRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupAd.getId().toString())
        );
    }

    /**
     * {@code GET  /user-group-ads} : get all the userGroupAds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userGroupAds in body.
     */
    @GetMapping("/user-group-ads")
    public List<UserGroupAd> getAllUserGroupAds() {
        log.debug("REST request to get all UserGroupAds");
        return userGroupAdRepository.findAll();
    }

    /**
     * {@code GET  /user-group-ads/:id} : get the "id" userGroupAd.
     *
     * @param id the id of the userGroupAd to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userGroupAd, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-group-ads/{id}")
    public ResponseEntity<UserGroupAd> getUserGroupAd(@PathVariable Long id) {
        log.debug("REST request to get UserGroupAd : {}", id);
        Optional<UserGroupAd> userGroupAd = userGroupAdRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userGroupAd);
    }

    /**
     * {@code DELETE  /user-group-ads/:id} : delete the "id" userGroupAd.
     *
     * @param id the id of the userGroupAd to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-group-ads/{id}")
    public ResponseEntity<Void> deleteUserGroupAd(@PathVariable Long id) {
        log.debug("REST request to delete UserGroupAd : {}", id);
        userGroupAdRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
