package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AppUsers;

/**
 * Spring Data JPA repository for the AppUsers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppUsersRepository extends JpaRepository<AppUsers, Long> {}
