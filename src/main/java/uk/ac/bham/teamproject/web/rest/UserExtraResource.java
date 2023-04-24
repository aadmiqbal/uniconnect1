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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.UserExtra;
import uk.ac.bham.teamproject.repository.UserExtraRepository;
import uk.ac.bham.teamproject.service.UserExtraService;
import uk.ac.bham.teamproject.service.dto.UserExtraDTO;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserExtra}.
 */
@RestController
@RequestMapping("/api")
public class UserExtraResource {

    private final Logger log = LoggerFactory.getLogger(UserExtraResource.class);

    private static final String ENTITY_NAME = "userExtra";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserExtraService userExtraService;

    private final UserExtraRepository userExtraRepository;

    public UserExtraResource(UserExtraService userExtraService, UserExtraRepository userExtraRepository) {
        this.userExtraService = userExtraService;
        this.userExtraRepository = userExtraRepository;
    }

    /**
     * {@code POST  /user-extras} : Create a new userExtra.
     *
     * @param userExtraDTO the userExtraDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userExtraDTO, or with status {@code 400 (Bad Request)} if the userExtra has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-extras")
    public ResponseEntity<UserExtraDTO> createUserExtra(@Valid @RequestBody UserExtraDTO userExtraDTO) throws URISyntaxException {
        log.debug("REST request to save UserExtra : {}", userExtraDTO);
        if (userExtraDTO.getId() != null) {
            throw new BadRequestAlertException("A new userExtra cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(userExtraDTO.getUser())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        UserExtraDTO result = userExtraService.save(userExtraDTO);
        return ResponseEntity
            .created(new URI("/api/user-extras/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-extras/:id} : Updates an existing userExtra.
     *
     * @param id the id of the userExtraDTO to save.
     * @param userExtraDTO the userExtraDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userExtraDTO,
     * or with status {@code 400 (Bad Request)} if the userExtraDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userExtraDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-extras/{id}")
    public ResponseEntity<UserExtraDTO> updateUserExtra(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserExtraDTO userExtraDTO
    ) throws URISyntaxException {
        log.debug("REST request to update UserExtra : {}, {}", id, userExtraDTO);
        if (userExtraDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userExtraDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userExtraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserExtraDTO result = userExtraService.update(userExtraDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userExtraDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-extras/:id} : Partial updates given fields of an existing userExtra, field will ignore if it is null
     *
     * @param id the id of the userExtraDTO to save.
     * @param userExtraDTO the userExtraDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userExtraDTO,
     * or with status {@code 400 (Bad Request)} if the userExtraDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userExtraDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userExtraDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-extras/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserExtraDTO> partialUpdateUserExtra(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserExtraDTO userExtraDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserExtra partially : {}, {}", id, userExtraDTO);
        if (userExtraDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userExtraDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userExtraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserExtraDTO> result = userExtraService.partialUpdate(userExtraDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userExtraDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /user-extras} : get all the userExtras.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userExtras in body.
     */
    @GetMapping("/user-extras")
    public ResponseEntity<List<UserExtraDTO>> getAllUserExtras(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of UserExtras");
        Page<UserExtraDTO> page;
        if (eagerload) {
            page = userExtraService.findAllWithEagerRelationships(pageable);
        } else {
            page = userExtraService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-extras/:id} : get the "id" userExtra.
     *
     * @param id the id of the userExtraDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userExtraDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-extras/{id}")
    public ResponseEntity<UserExtraDTO> getUserExtra(@PathVariable Long id) {
        log.debug("REST request to get UserExtra : {}", id);
        Optional<UserExtraDTO> userExtraDTO = userExtraService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userExtraDTO);
    }

    /**
     * {@code DELETE  /user-extras/:id} : delete the "id" userExtra.
     *
     * @param id the id of the userExtraDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-extras/{id}")
    public ResponseEntity<Void> deleteUserExtra(@PathVariable Long id) {
        log.debug("REST request to delete UserExtra : {}", id);
        userExtraService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/user-extras/by-user-login/{userLogin}")
    public ResponseEntity<UserExtra> getUserExtraByUserLogin(@PathVariable String userLogin) {
        log.debug("REST request to get UserExtra by user login : {}", userLogin);
        Optional<UserExtra> userExtra = userExtraService.findByUserLogin(userLogin);
        return ResponseUtil.wrapOrNotFound(userExtra);
    }
}
