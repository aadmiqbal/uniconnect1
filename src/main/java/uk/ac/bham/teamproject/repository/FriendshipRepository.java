package uk.ac.bham.teamproject.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.FinalUser;
import uk.ac.bham.teamproject.domain.Friendship;

/**
 * Spring Data JPA repository for the Friendship entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long>, JpaSpecificationExecutor<Friendship> {
    List<Friendship> findAllByFinalUser(FinalUser finalUser);
    List<Friendship> findAllByFinalUser_IdOrFinalUser2_Id(Long finalUserId, Long finalUser2Id);
}
