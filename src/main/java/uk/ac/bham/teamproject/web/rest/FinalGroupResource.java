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
import uk.ac.bham.teamproject.repository.FinalGroupRepository;
import uk.ac.bham.teamproject.service.FinalGroupQueryService;
import uk.ac.bham.teamproject.service.FinalGroupService;
import uk.ac.bham.teamproject.service.criteria.FinalGroupCriteria;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.FinalGroup}.
 */
@RestController
@RequestMapping("/api")
public class FinalGroupResource {

    private final Logger log = LoggerFactory.getLogger(FinalGroupResource.class);

    private static final String ENTITY_NAME = "finalGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinalGroupService finalGroupService;

    private final FinalGroupRepository finalGroupRepository;

    private final FinalGroupQueryService finalGroupQueryService;

    public FinalGroupResource(
        FinalGroupService finalGroupService,
        FinalGroupRepository finalGroupRepository,
        FinalGroupQueryService finalGroupQueryService
    ) {
        this.finalGroupService = finalGroupService;
        this.finalGroupRepository = finalGroupRepository;
        this.finalGroupQueryService = finalGroupQueryService;
    }

    /**
     * {@code POST  /final-groups} : Create a new finalGroup.
     *
     * @param finalGroupDTO the finalGroupDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new finalGroupDTO, or with status {@code 400 (Bad Request)} if the finalGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/final-groups")
    public ResponseEntity<FinalGroupDTO> createFinalGroup(@Valid @RequestBody FinalGroupDTO finalGroupDTO) throws URISyntaxException {
        log.debug("REST request to save FinalGroup : {}", finalGroupDTO);
        if (finalGroupDTO.getId() != null) {
            throw new BadRequestAlertException("A new finalGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FinalGroupDTO result = finalGroupService.save(finalGroupDTO);
        return ResponseEntity
            .created(new URI("/api/final-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /final-groups/:id} : Updates an existing finalGroup.
     *
     * @param id the id of the finalGroupDTO to save.
     * @param finalGroupDTO the finalGroupDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finalGroupDTO,
     * or with status {@code 400 (Bad Request)} if the finalGroupDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the finalGroupDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/final-groups/{id}")
    public ResponseEntity<FinalGroupDTO> updateFinalGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FinalGroupDTO finalGroupDTO
    ) throws URISyntaxException {
        log.debug("REST request to update FinalGroup : {}, {}", id, finalGroupDTO);
        if (finalGroupDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, finalGroupDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!finalGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FinalGroupDTO result = finalGroupService.update(finalGroupDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finalGroupDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /final-groups/:id} : Partial updates given fields of an existing finalGroup, field will ignore if it is null
     *
     * @param id the id of the finalGroupDTO to save.
     * @param finalGroupDTO the finalGroupDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated finalGroupDTO,
     * or with status {@code 400 (Bad Request)} if the finalGroupDTO is not valid,
     * or with status {@code 404 (Not Found)} if the finalGroupDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the finalGroupDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/final-groups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FinalGroupDTO> partialUpdateFinalGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FinalGroupDTO finalGroupDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update FinalGroup partially : {}, {}", id, finalGroupDTO);
        if (finalGroupDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, finalGroupDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!finalGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FinalGroupDTO> result = finalGroupService.partialUpdate(finalGroupDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, finalGroupDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /final-groups} : get all the finalGroups.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of finalGroups in body.
     */
    @GetMapping("/final-groups")
    public ResponseEntity<List<FinalGroupDTO>> getAllFinalGroups(
        FinalGroupCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get FinalGroups by criteria: {}", criteria);
        Page<FinalGroupDTO> page = finalGroupQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /final-groups/count} : count all the finalGroups.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/final-groups/count")
    public ResponseEntity<Long> countFinalGroups(FinalGroupCriteria criteria) {
        log.debug("REST request to count FinalGroups by criteria: {}", criteria);
        return ResponseEntity.ok().body(finalGroupQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /final-groups/:id} : get the "id" finalGroup.
     *
     * @param id the id of the finalGroupDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the finalGroupDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/final-groups/{id}")
    public ResponseEntity<FinalGroupDTO> getFinalGroup(@PathVariable Long id) {
        log.debug("REST request to get FinalGroup : {}", id);
        Optional<FinalGroupDTO> finalGroupDTO = finalGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(finalGroupDTO);
    }

    /**
     * {@code DELETE  /final-groups/:id} : delete the "id" finalGroup.
     *
     * @param id the id of the finalGroupDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/final-groups/{id}")
    public ResponseEntity<Void> deleteFinalGroup(@PathVariable Long id) {
        log.debug("REST request to delete FinalGroup : {}", id);
        finalGroupService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
