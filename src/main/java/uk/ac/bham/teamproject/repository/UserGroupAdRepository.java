package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserGroupAd;

/**
 * Spring Data JPA repository for the UserGroupAd entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserGroupAdRepository extends JpaRepository<UserGroupAd, Long> {}
