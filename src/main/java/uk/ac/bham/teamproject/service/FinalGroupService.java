package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.service.dto.FinalGroupDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.FinalGroup}.
 */
public interface FinalGroupService {
    /**
     * Save a finalGroup.
     *
     * @param finalGroupDTO the entity to save.
     * @return the persisted entity.
     */
    FinalGroupDTO save(FinalGroupDTO finalGroupDTO);

    /**
     * Updates a finalGroup.
     *
     * @param finalGroupDTO the entity to update.
     * @return the persisted entity.
     */
    FinalGroupDTO update(FinalGroupDTO finalGroupDTO);

    /**
     * Partially updates a finalGroup.
     *
     * @param finalGroupDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FinalGroupDTO> partialUpdate(FinalGroupDTO finalGroupDTO);

    /**
     * Get all the finalGroups.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FinalGroupDTO> findAll(Pageable pageable);

    /**
     * Get the "id" finalGroup.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FinalGroupDTO> findOne(Long id);

    /**
     * Delete the "id" finalGroup.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
