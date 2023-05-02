package uk.ac.bham.teamproject.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uk.ac.bham.teamproject.service.dto.FriendshipDTO;

/**
 * Service Interface for managing {@link uk.ac.bham.teamproject.domain.Friendship}.
 */
public interface FriendshipService {
    /**
     * Save a friendship.
     *
     * @param friendshipDTO the entity to save.
     * @return the persisted entity.
     */
    FriendshipDTO save(FriendshipDTO friendshipDTO);

    /**
     * Updates a friendship.
     *
     * @param friendshipDTO the entity to update.
     * @return the persisted entity.
     */
    FriendshipDTO update(FriendshipDTO friendshipDTO);

    /**
     * Partially updates a friendship.
     *
     * @param friendshipDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FriendshipDTO> partialUpdate(FriendshipDTO friendshipDTO);

    /**
     * Get all the friendships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FriendshipDTO> findAll(Pageable pageable);

    /**
     * Get the "id" friendship.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FriendshipDTO> findOne(Long id);

    /**
     * Delete the "id" friendship.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<FriendshipDTO> findAllByFinalUser(Long finalUserId);
    List<FriendshipDTO> findAllByFinalUserInEitherColumn(Long finalUserId);
}
