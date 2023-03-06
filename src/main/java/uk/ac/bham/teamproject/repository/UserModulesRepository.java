package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.UserModules;

/**
 * Spring Data JPA repository for the UserModules entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserModulesRepository extends JpaRepository<UserModules, Long> {}
