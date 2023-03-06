package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
import uk.ac.bham.teamproject.domain.UserGroupUsers;
import uk.ac.bham.teamproject.repository.UserGroupUsersRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserGroupUsers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserGroupUsersResource {

    private final Logger log = LoggerFactory.getLogger(UserGroupUsersResource.class);

    private static final String ENTITY_NAME = "userGroupUsers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserGroupUsersRepository userGroupUsersRepository;

    public UserGroupUsersResource(UserGroupUsersRepository userGroupUsersRepository) {
        this.userGroupUsersRepository = userGroupUsersRepository;
    }

    /**
     * {@code POST  /user-group-users} : Create a new userGroupUsers.
     *
     * @param userGroupUsers the userGroupUsers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userGroupUsers, or with status {@code 400 (Bad Request)} if the userGroupUsers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-group-users")
    public ResponseEntity<UserGroupUsers> createUserGroupUsers(@RequestBody UserGroupUsers userGroupUsers) throws URISyntaxException {
        log.debug("REST request to save UserGroupUsers : {}", userGroupUsers);
        if (userGroupUsers.getId() != null) {
            throw new BadRequestAlertException("A new userGroupUsers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserGroupUsers result = userGroupUsersRepository.save(userGroupUsers);
        return ResponseEntity
            .created(new URI("/api/user-group-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-group-users/:id} : Updates an existing userGroupUsers.
     *
     * @param id the id of the userGroupUsers to save.
     * @param userGroupUsers the userGroupUsers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupUsers,
     * or with status {@code 400 (Bad Request)} if the userGroupUsers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userGroupUsers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-group-users/{id}")
    public ResponseEntity<UserGroupUsers> updateUserGroupUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGroupUsers userGroupUsers
    ) throws URISyntaxException {
        log.debug("REST request to update UserGroupUsers : {}, {}", id, userGroupUsers);
        if (userGroupUsers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupUsers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserGroupUsers result = userGroupUsersRepository.save(userGroupUsers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupUsers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-group-users/:id} : Partial updates given fields of an existing userGroupUsers, field will ignore if it is null
     *
     * @param id the id of the userGroupUsers to save.
     * @param userGroupUsers the userGroupUsers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userGroupUsers,
     * or with status {@code 400 (Bad Request)} if the userGroupUsers is not valid,
     * or with status {@code 404 (Not Found)} if the userGroupUsers is not found,
     * or with status {@code 500 (Internal Server Error)} if the userGroupUsers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-group-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserGroupUsers> partialUpdateUserGroupUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserGroupUsers userGroupUsers
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserGroupUsers partially : {}, {}", id, userGroupUsers);
        if (userGroupUsers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userGroupUsers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userGroupUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserGroupUsers> result = userGroupUsersRepository
            .findById(userGroupUsers.getId())
            .map(existingUserGroupUsers -> {
                return existingUserGroupUsers;
            })
            .map(userGroupUsersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userGroupUsers.getId().toString())
        );
    }

    /**
     * {@code GET  /user-group-users} : get all the userGroupUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userGroupUsers in body.
     */
    @GetMapping("/user-group-users")
    public ResponseEntity<List<UserGroupUsers>> getAllUserGroupUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of UserGroupUsers");
        Page<UserGroupUsers> page = userGroupUsersRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-group-users/:id} : get the "id" userGroupUsers.
     *
     * @param id the id of the userGroupUsers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userGroupUsers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-group-users/{id}")
    public ResponseEntity<UserGroupUsers> getUserGroupUsers(@PathVariable Long id) {
        log.debug("REST request to get UserGroupUsers : {}", id);
        Optional<UserGroupUsers> userGroupUsers = userGroupUsersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userGroupUsers);
    }

    /**
     * {@code DELETE  /user-group-users/:id} : delete the "id" userGroupUsers.
     *
     * @param id the id of the userGroupUsers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-group-users/{id}")
    public ResponseEntity<Void> deleteUserGroupUsers(@PathVariable Long id) {
        log.debug("REST request to delete UserGroupUsers : {}", id);
        userGroupUsersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
