package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AppUserLogins;

/**
 * Spring Data JPA repository for the AppUserLogins entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppUserLoginsRepository extends JpaRepository<AppUserLogins, Long> {}
