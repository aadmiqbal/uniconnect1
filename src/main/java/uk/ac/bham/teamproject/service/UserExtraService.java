package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.service.dto.UserExtraDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.UserExtra}.
 */
public interface UserExtraService {
    /**
     * Save a userExtra.
     *
     * @param userExtraDTO the entity to save.
     * @return the persisted entity.
     */
    UserExtraDTO save(UserExtraDTO userExtraDTO);

    /**
     * Updates a userExtra.
     *
     * @param userExtraDTO the entity to update.
     * @return the persisted entity.
     */
    UserExtraDTO update(UserExtraDTO userExtraDTO);

    /**
     * Partially updates a userExtra.
     *
     * @param userExtraDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserExtraDTO> partialUpdate(UserExtraDTO userExtraDTO);

    /**
     * Get all the userExtras.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserExtraDTO> findAll(Pageable pageable);

    /**
     * Get all the userExtras with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserExtraDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" userExtra.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserExtraDTO> findOne(Long id);

    /**
     * Delete the "id" userExtra.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
