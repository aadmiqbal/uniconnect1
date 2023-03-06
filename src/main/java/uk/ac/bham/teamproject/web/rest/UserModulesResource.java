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
import uk.ac.bham.teamproject.domain.UserModules;
import uk.ac.bham.teamproject.repository.UserModulesRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserModules}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserModulesResource {

    private final Logger log = LoggerFactory.getLogger(UserModulesResource.class);

    private static final String ENTITY_NAME = "userModules";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserModulesRepository userModulesRepository;

    public UserModulesResource(UserModulesRepository userModulesRepository) {
        this.userModulesRepository = userModulesRepository;
    }

    /**
     * {@code POST  /user-modules} : Create a new userModules.
     *
     * @param userModules the userModules to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userModules, or with status {@code 400 (Bad Request)} if the userModules has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-modules")
    public ResponseEntity<UserModules> createUserModules(@Valid @RequestBody UserModules userModules) throws URISyntaxException {
        log.debug("REST request to save UserModules : {}", userModules);
        if (userModules.getId() != null) {
            throw new BadRequestAlertException("A new userModules cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserModules result = userModulesRepository.save(userModules);
        return ResponseEntity
            .created(new URI("/api/user-modules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-modules/:id} : Updates an existing userModules.
     *
     * @param id the id of the userModules to save.
     * @param userModules the userModules to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userModules,
     * or with status {@code 400 (Bad Request)} if the userModules is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userModules couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-modules/{id}")
    public ResponseEntity<UserModules> updateUserModules(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserModules userModules
    ) throws URISyntaxException {
        log.debug("REST request to update UserModules : {}, {}", id, userModules);
        if (userModules.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userModules.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userModulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserModules result = userModulesRepository.save(userModules);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userModules.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-modules/:id} : Partial updates given fields of an existing userModules, field will ignore if it is null
     *
     * @param id the id of the userModules to save.
     * @param userModules the userModules to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userModules,
     * or with status {@code 400 (Bad Request)} if the userModules is not valid,
     * or with status {@code 404 (Not Found)} if the userModules is not found,
     * or with status {@code 500 (Internal Server Error)} if the userModules couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-modules/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserModules> partialUpdateUserModules(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserModules userModules
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserModules partially : {}, {}", id, userModules);
        if (userModules.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userModules.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userModulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserModules> result = userModulesRepository
            .findById(userModules.getId())
            .map(existingUserModules -> {
                if (userModules.getModuleName() != null) {
                    existingUserModules.setModuleName(userModules.getModuleName());
                }
                if (userModules.getOptional() != null) {
                    existingUserModules.setOptional(userModules.getOptional());
                }
                if (userModules.getStudyYear() != null) {
                    existingUserModules.setStudyYear(userModules.getStudyYear());
                }

                return existingUserModules;
            })
            .map(userModulesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userModules.getId().toString())
        );
    }

    /**
     * {@code GET  /user-modules} : get all the userModules.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userModules in body.
     */
    @GetMapping("/user-modules")
    public List<UserModules> getAllUserModules() {
        log.debug("REST request to get all UserModules");
        return userModulesRepository.findAll();
    }

    /**
     * {@code GET  /user-modules/:id} : get the "id" userModules.
     *
     * @param id the id of the userModules to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userModules, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-modules/{id}")
    public ResponseEntity<UserModules> getUserModules(@PathVariable Long id) {
        log.debug("REST request to get UserModules : {}", id);
        Optional<UserModules> userModules = userModulesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userModules);
    }

    /**
     * {@code DELETE  /user-modules/:id} : delete the "id" userModules.
     *
     * @param id the id of the userModules to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-modules/{id}")
    public ResponseEntity<Void> deleteUserModules(@PathVariable Long id) {
        log.debug("REST request to delete UserModules : {}", id);
        userModulesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
