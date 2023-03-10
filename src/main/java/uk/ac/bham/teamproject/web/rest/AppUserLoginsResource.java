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
import uk.ac.bham.teamproject.domain.AppUserLogins;
import uk.ac.bham.teamproject.repository.AppUserLoginsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AppUserLogins}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AppUserLoginsResource {

    private final Logger log = LoggerFactory.getLogger(AppUserLoginsResource.class);

    private static final String ENTITY_NAME = "appUserLogins";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppUserLoginsRepository appUserLoginsRepository;

    public AppUserLoginsResource(AppUserLoginsRepository appUserLoginsRepository) {
        this.appUserLoginsRepository = appUserLoginsRepository;
    }

    /**
     * {@code POST  /app-user-logins} : Create a new appUserLogins.
     *
     * @param appUserLogins the appUserLogins to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appUserLogins, or with status {@code 400 (Bad Request)} if the appUserLogins has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/app-user-logins")
    public ResponseEntity<AppUserLogins> createAppUserLogins(@Valid @RequestBody AppUserLogins appUserLogins) throws URISyntaxException {
        log.debug("REST request to save AppUserLogins : {}", appUserLogins);
        if (appUserLogins.getId() != null) {
            throw new BadRequestAlertException("A new appUserLogins cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppUserLogins result = appUserLoginsRepository.save(appUserLogins);
        return ResponseEntity
            .created(new URI("/api/app-user-logins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /app-user-logins/:id} : Updates an existing appUserLogins.
     *
     * @param id the id of the appUserLogins to save.
     * @param appUserLogins the appUserLogins to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUserLogins,
     * or with status {@code 400 (Bad Request)} if the appUserLogins is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appUserLogins couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/app-user-logins/{id}")
    public ResponseEntity<AppUserLogins> updateAppUserLogins(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AppUserLogins appUserLogins
    ) throws URISyntaxException {
        log.debug("REST request to update AppUserLogins : {}, {}", id, appUserLogins);
        if (appUserLogins.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUserLogins.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUserLoginsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppUserLogins result = appUserLoginsRepository.save(appUserLogins);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUserLogins.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /app-user-logins/:id} : Partial updates given fields of an existing appUserLogins, field will ignore if it is null
     *
     * @param id the id of the appUserLogins to save.
     * @param appUserLogins the appUserLogins to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUserLogins,
     * or with status {@code 400 (Bad Request)} if the appUserLogins is not valid,
     * or with status {@code 404 (Not Found)} if the appUserLogins is not found,
     * or with status {@code 500 (Internal Server Error)} if the appUserLogins couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/app-user-logins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppUserLogins> partialUpdateAppUserLogins(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AppUserLogins appUserLogins
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppUserLogins partially : {}, {}", id, appUserLogins);
        if (appUserLogins.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUserLogins.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUserLoginsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppUserLogins> result = appUserLoginsRepository
            .findById(appUserLogins.getId())
            .map(existingAppUserLogins -> {
                if (appUserLogins.getUserEmail() != null) {
                    existingAppUserLogins.setUserEmail(appUserLogins.getUserEmail());
                }
                if (appUserLogins.getPasswordSalt() != null) {
                    existingAppUserLogins.setPasswordSalt(appUserLogins.getPasswordSalt());
                }
                if (appUserLogins.getPasswordHash() != null) {
                    existingAppUserLogins.setPasswordHash(appUserLogins.getPasswordHash());
                }

                return existingAppUserLogins;
            })
            .map(appUserLoginsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUserLogins.getId().toString())
        );
    }

    /**
     * {@code GET  /app-user-logins} : get all the appUserLogins.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appUserLogins in body.
     */
    @GetMapping("/app-user-logins")
    public List<AppUserLogins> getAllAppUserLogins() {
        log.debug("REST request to get all AppUserLogins");
        return appUserLoginsRepository.findAll();
    }

    /**
     * {@code GET  /app-user-logins/:id} : get the "id" appUserLogins.
     *
     * @param id the id of the appUserLogins to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appUserLogins, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/app-user-logins/{id}")
    public ResponseEntity<AppUserLogins> getAppUserLogins(@PathVariable Long id) {
        log.debug("REST request to get AppUserLogins : {}", id);
        Optional<AppUserLogins> appUserLogins = appUserLoginsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(appUserLogins);
    }

    /**
     * {@code DELETE  /app-user-logins/:id} : delete the "id" appUserLogins.
     *
     * @param id the id of the appUserLogins to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/app-user-logins/{id}")
    public ResponseEntity<Void> deleteAppUserLogins(@PathVariable Long id) {
        log.debug("REST request to delete AppUserLogins : {}", id);
        appUserLoginsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
