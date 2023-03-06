package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserGroupUsers;

/**
 * Spring Data JPA repository for the UserGroupUsers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserGroupUsersRepository extends JpaRepository<UserGroupUsers, Long> {}
