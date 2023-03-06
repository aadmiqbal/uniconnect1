package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserGroups;

/**
 * Spring Data JPA repository for the UserGroups entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserGroupsRepository extends JpaRepository<UserGroups, Long> {}
