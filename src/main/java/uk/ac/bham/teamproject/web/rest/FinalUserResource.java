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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.repository.FinalUserRepository;
import uk.ac.bham.teamproject.service.FinalUserQueryService;
import uk.ac.bham.teamproject.service.FinalUserService;
import uk.ac.bham.teamproject.service.criteria.FinalUserCriteria;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.FinalUser}.
 */
@RestController
@RequestMapping("/api")
public class FinalUserResource {

    private final Logger log = LoggerFactory.getLogger(FinalUserResource.class);

    private static final String ENTITY_NAME = "finalUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinalUserService finalUserService;

    private final FinalUserRepository finalUserRepository;

    private final FinalUserQueryService finalUserQueryService;

    public FinalUserResource(
        FinalUserService finalUserService,
        FinalUserRepository finalUserRepository,
        FinalUserQueryService finalUserQueryService
    ) {
        this.finalUserService = finalUserService;
        this.finalUserRepository = finalUserRepository;
        this.finalUserQueryService = finalUserQueryService;
    }

    /**
     * {@code POST  /final-users} : Create a new finalUser.
     *
     * @param finalUserDTO the finalUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new finalUserDTO, or with status {@code 400 (Bad Request)} if the finalUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/final-users")
    public ResponseEntity<FinalUserDTO> createFinalUser(@Valid @RequestBody FinalUserDTO finalUserDTO) throws URISyntaxException {
        log.debug("REST request to save FinalUser : {}", finalUserDTO);
        if (finalUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new finalUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(finalUserDTO.getUser())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        FinalUserDTO result = finalUserService.save(finalUserDTO);
        return ResponseEntity
            .created(new URI("/api/final-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /final-users/:id} : Updates an existing finalUser.
     *
     * @param id the id of the finalUserDTO to save.
     * @param finalUserDTO the finalUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finalUserDTO,
     * or with status {@code 400 (Bad Request)} if the finalUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the finalUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/final-users/{id}")
    public ResponseEntity<FinalUserDTO> updateFinalUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FinalUserDTO finalUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to update FinalUser : {}, {}", id, finalUserDTO);
        if (finalUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, finalUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!finalUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FinalUserDTO result = finalUserService.update(finalUserDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finalUserDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /final-users/:id} : Partial updates given fields of an existing finalUser, field will ignore if it is null
     *
     * @param id the id of the finalUserDTO to save.
     * @param finalUserDTO the finalUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finalUserDTO,
     * or with status {@code 400 (Bad Request)} if the finalUserDTO is not valid,
     * or with status {@code 404 (Not Found)} if the finalUserDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the finalUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/final-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FinalUserDTO> partialUpdateFinalUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FinalUserDTO finalUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update FinalUser partially : {}, {}", id, finalUserDTO);
        if (finalUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, finalUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!finalUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FinalUserDTO> result = finalUserService.partialUpdate(finalUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finalUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /final-users} : get all the finalUsers.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of finalUsers in body.
     */
    @GetMapping("/final-users")
    public ResponseEntity<List<FinalUserDTO>> getAllFinalUsers(
        FinalUserCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get FinalUsers by criteria: {}", criteria);
        Page<FinalUserDTO> page = finalUserQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /final-users/count} : count all the finalUsers.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/final-users/count")
    public ResponseEntity<Long> countFinalUsers(FinalUserCriteria criteria) {
        log.debug("REST request to count FinalUsers by criteria: {}", criteria);
        return ResponseEntity.ok().body(finalUserQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /final-users/:id} : get the "id" finalUser.
     *
     * @param id the id of the finalUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the finalUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/final-users/{id}")
    public ResponseEntity<FinalUserDTO> getFinalUser(@PathVariable Long id) {
        log.debug("REST request to get FinalUser : {}", id);
        Optional<FinalUserDTO> finalUserDTO = finalUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(finalUserDTO);
    }

    /**
     * {@code DELETE  /final-users/:id} : delete the "id" finalUser.
     *
     * @param id the id of the finalUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/final-users/{id}")
    public ResponseEntity<Void> deleteFinalUser(@PathVariable Long id) {
        log.debug("REST request to delete FinalUser : {}", id);
        finalUserService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
