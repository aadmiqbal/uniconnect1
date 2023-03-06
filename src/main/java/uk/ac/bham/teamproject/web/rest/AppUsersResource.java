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
import uk.ac.bham.teamproject.domain.AppUsers;
import uk.ac.bham.teamproject.repository.AppUsersRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AppUsers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AppUsersResource {

    private final Logger log = LoggerFactory.getLogger(AppUsersResource.class);

    private static final String ENTITY_NAME = "appUsers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppUsersRepository appUsersRepository;

    public AppUsersResource(AppUsersRepository appUsersRepository) {
        this.appUsersRepository = appUsersRepository;
    }

    /**
     * {@code POST  /app-users} : Create a new appUsers.
     *
     * @param appUsers the appUsers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appUsers, or with status {@code 400 (Bad Request)} if the appUsers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/app-users")
    public ResponseEntity<AppUsers> createAppUsers(@Valid @RequestBody AppUsers appUsers) throws URISyntaxException {
        log.debug("REST request to save AppUsers : {}", appUsers);
        if (appUsers.getId() != null) {
            throw new BadRequestAlertException("A new appUsers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppUsers result = appUsersRepository.save(appUsers);
        return ResponseEntity
            .created(new URI("/api/app-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /app-users/:id} : Updates an existing appUsers.
     *
     * @param id the id of the appUsers to save.
     * @param appUsers the appUsers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUsers,
     * or with status {@code 400 (Bad Request)} if the appUsers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appUsers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/app-users/{id}")
    public ResponseEntity<AppUsers> updateAppUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AppUsers appUsers
    ) throws URISyntaxException {
        log.debug("REST request to update AppUsers : {}, {}", id, appUsers);
        if (appUsers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUsers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppUsers result = appUsersRepository.save(appUsers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUsers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /app-users/:id} : Partial updates given fields of an existing appUsers, field will ignore if it is null
     *
     * @param id the id of the appUsers to save.
     * @param appUsers the appUsers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUsers,
     * or with status {@code 400 (Bad Request)} if the appUsers is not valid,
     * or with status {@code 404 (Not Found)} if the appUsers is not found,
     * or with status {@code 500 (Internal Server Error)} if the appUsers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/app-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppUsers> partialUpdateAppUsers(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AppUsers appUsers
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppUsers partially : {}, {}", id, appUsers);
        if (appUsers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUsers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUsersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppUsers> result = appUsersRepository
            .findById(appUsers.getId())
            .map(existingAppUsers -> {
                if (appUsers.getName() != null) {
                    existingAppUsers.setName(appUsers.getName());
                }
                if (appUsers.getStudyYear() != null) {
                    existingAppUsers.setStudyYear(appUsers.getStudyYear());
                }
                if (appUsers.getBio() != null) {
                    existingAppUsers.setBio(appUsers.getBio());
                }
                if (appUsers.getPfp() != null) {
                    existingAppUsers.setPfp(appUsers.getPfp());
                }

                return existingAppUsers;
            })
            .map(appUsersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUsers.getId().toString())
        );
    }

    /**
     * {@code GET  /app-users} : get all the appUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appUsers in body.
     */
    @GetMapping("/app-users")
    public ResponseEntity<List<AppUsers>> getAllAppUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of AppUsers");
        Page<AppUsers> page = appUsersRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /app-users/:id} : get the "id" appUsers.
     *
     * @param id the id of the appUsers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appUsers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/app-users/{id}")
    public ResponseEntity<AppUsers> getAppUsers(@PathVariable Long id) {
        log.debug("REST request to get AppUsers : {}", id);
        Optional<AppUsers> appUsers = appUsersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(appUsers);
    }

    /**
     * {@code DELETE  /app-users/:id} : delete the "id" appUsers.
     *
     * @param id the id of the appUsers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/app-users/{id}")
    public ResponseEntity<Void> deleteAppUsers(@PathVariable Long id) {
        log.debug("REST request to delete AppUsers : {}", id);
        appUsersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
