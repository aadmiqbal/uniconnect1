package uk.ac.bham.teamproject.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.service.dto.FinalUserDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.FinalUser}.
 */
public interface FinalUserService {
    /**
     * Save a finalUser.
     *
     * @param finalUserDTO the entity to save.
     * @return the persisted entity.
     */
    FinalUserDTO save(FinalUserDTO finalUserDTO);

    /**
     * Updates a finalUser.
     *
     * @param finalUserDTO the entity to update.
     * @return the persisted entity.
     */
    FinalUserDTO update(FinalUserDTO finalUserDTO);

    /**
     * Partially updates a finalUser.
     *
     * @param finalUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FinalUserDTO> partialUpdate(FinalUserDTO finalUserDTO);

    /**
     * Get all the finalUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FinalUserDTO> findAll(Pageable pageable);

    /**
     * Get all the finalUsers with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FinalUserDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" finalUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FinalUserDTO> findOne(Long id);

    /**
     * Delete the "id" finalUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Optional<FinalUser> findByUserLogin(String userLogin);
}
