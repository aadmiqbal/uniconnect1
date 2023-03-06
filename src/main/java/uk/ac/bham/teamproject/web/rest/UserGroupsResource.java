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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.UserGroups;
import uk.ac.bham.teamproject.repository.UserGroupsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserGroups}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserGroupsResource {

    private final Logger log = LoggerFactory.getLogger(UserGroupsResource.class);

    private static final String ENTITY_NAME = "userGroups";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserGroupsRepository userGroupsRepository;

    public UserGroupsResource(UserGroupsRepository userGroupsRepository) {
        this.userGroupsRepository = userGroupsRepository;
    }

    /**
     * {@code POST  /user-groups} : Create a new userGroups.
     *
     * @param userGroups the userGroups to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userGroups, or with status {@code 400 (Bad Request)} if the userGroups has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-groups")
    public ResponseEntity<UserGroups> createUserGroups(@Valid @RequestBody UserGroups userGroups) throws URISyntaxException {
        log.debug("REST request to save UserGroups : {}", userGroups);
        if (userGroups.getId() != null) {
            throw new BadRequestAlertException("A new userGroups cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserGroups result = userGroupsRepository.save(userGroups);
        return ResponseEntity
            .created(new URI("/api/user-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-groups/:id} : Updates an existing userGroups.
     *
     * @param id the id of the userGroups to save.
     * @param userGroups the userGroups to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroups,
     * or with status {@code 400 (Bad Request)} if the userGroups is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userGroups couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-groups/{id}")
    public ResponseEntity<UserGroups> updateUserGroups(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserGroups userGroups
    ) throws URISyntaxException {
        log.debug("REST request to update UserGroups : {}, {}", id, userGroups);
        if (userGroups.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroups.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserGroups result = userGroupsRepository.save(userGroups);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroups.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-groups/:id} : Partial updates given fields of an existing userGroups, field will ignore if it is null
     *
     * @param id the id of the userGroups to save.
     * @param userGroups the userGroups to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroups,
     * or with status {@code 400 (Bad Request)} if the userGroups is not valid,
     * or with status {@code 404 (Not Found)} if the userGroups is not found,
     * or with status {@code 500 (Internal Server Error)} if the userGroups couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-groups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserGroups> partialUpdateUserGroups(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserGroups userGroups
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserGroups partially : {}, {}", id, userGroups);
        if (userGroups.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroups.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserGroups> result = userGroupsRepository
            .findById(userGroups.getId())
            .map(existingUserGroups -> {
                if (userGroups.getGroupName() != null) {
                    existingUserGroups.setGroupName(userGroups.getGroupName());
                }

                return existingUserGroups;
            })
            .map(userGroupsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroups.getId().toString())
        );
    }

    /**
     * {@code GET  /user-groups} : get all the userGroups.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userGroups in body.
     */
    @GetMapping("/user-groups")
    public ResponseEntity<List<UserGroups>> getAllUserGroups(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of UserGroups");
        Page<UserGroups> page = userGroupsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-groups/:id} : get the "id" userGroups.
     *
     * @param id the id of the userGroups to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userGroups, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-groups/{id}")
    public ResponseEntity<UserGroups> getUserGroups(@PathVariable Long id) {
        log.debug("REST request to get UserGroups : {}", id);
        Optional<UserGroups> userGroups = userGroupsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userGroups);
    }

    /**
     * {@code DELETE  /user-groups/:id} : delete the "id" userGroups.
     *
     * @param id the id of the userGroups to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-groups/{id}")
    public ResponseEntity<Void> deleteUserGroups(@PathVariable Long id) {
        log.debug("REST request to delete UserGroups : {}", id);
        userGroupsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
